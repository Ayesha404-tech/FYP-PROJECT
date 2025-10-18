import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { EmployeeKPIData } from '../../types';
import KPICard from './KPICard';
import KPIChart from './KPIChart';
import { Id } from '../../convex/_generated/dataModel';

interface KPIDashboardProps {
  employeeId: Id<"users">;
}

const KPIDashboard: React.FC<KPIDashboardProps> = ({ employeeId }) => {
  const [month] = useState(new Date().getMonth() + 1);
  const [year] = useState(new Date().getFullYear());

  const employeeKPIs = useQuery(api.kpi.getKPIs.getEmployeeKPIs, { employeeId, month, year });
  const overallScoreData = useQuery(api.kpi.calculateKPI.getOverallEmployeeKPIScore, { employeeId, month, year });
  const kpiTemplates = useQuery(api.kpi.getKPIs.getKPITemplates);

  const calculateKPI = useMutation(api.kpi.calculateKPI.calculateEmployeeKPI);
  const collectData = useMutation(api.kpi.calculateKPI.collectModuleDataForKPI);

  useEffect(() => {
    const setupKPIs = async () => {
      if (employeeId && kpiTemplates) {
        const collectedData = await collectData({ employeeId, month, year });
        console.log("Collected module data:", collectedData);

        for (const template of kpiTemplates) {
          let actualValue = template.targetValue * (0.8 + Math.random() * 0.4);
          if (template.metricType === "count") {
            actualValue = Math.round(actualValue);
          }
          
          await calculateKPI({
            employeeId,
            kpiTemplateId: template._id,
            actualValue,
            month,
            year,
          });
        }
      }
    };

    setupKPIs();
  }, [employeeId, kpiTemplates, month, year, calculateKPI, collectData]);

  const overallScore = overallScoreData?.totalScore || 0;
  const topKPI = employeeKPIs?.reduce((prev: EmployeeKPIData, current: EmployeeKPIData) =>
    (prev.calculatedScore > current.calculatedScore) ? prev : current,
    { calculatedScore: -1, kpiTemplate: { title: "N/A" } } as EmployeeKPIData
  );
  const improvementPercentage = "N/A";

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">KPI Dashboard for Employee: {employeeId}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <KPICard
          title="Overall Score"
          value={overallScore.toFixed(2)}
          description="Aggregated performance score"
        />
        <KPICard
          title="Top KPI"
          value={topKPI?.kpiTemplate?.title || "N/A"}
          description={`Score: ${topKPI?.calculatedScore?.toFixed(2) || "N/A"}`}
        />
        <KPICard
          title="Improvement %"
          value={improvementPercentage}
          description="Compared to previous period"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <KPIChart data={employeeKPIs || []} type="bar" title="KPI Scores (Bar Chart)" />
        <KPIChart data={employeeKPIs || []} type="pie" title="KPI Score Distribution (Pie Chart)" />
      </div>

      <div className="mt-8 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Detailed KPI Breakdown</h2>
        {employeeKPIs?.length === 0 ? (
          <p className="text-gray-500">No detailed KPI data available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KPI</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actual</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weightage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employeeKPIs?.map((kpi: EmployeeKPIData) => (
                  <tr key={kpi._id.toString()}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {kpi.kpiTemplate?.title || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {kpi.kpiTemplate?.description || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {kpi.kpiTemplate?.targetValue || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {kpi.actualValue}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {kpi.kpiTemplate?.weightage || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {kpi.calculatedScore.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default KPIDashboard;
