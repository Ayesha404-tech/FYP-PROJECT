import React, { useState } from 'react';
import { FileText, Eye, Download, Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { Candidate } from '../../types';
import { formatDate } from '../../lib/utils';

// Mock data for user's applications - in real app this would come from API
const mockUserApplications: Candidate[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '+1-555-0123',
    position: 'Frontend Developer',
    status: 'interview',
    appliedAt: '2024-01-15',
    aiScore: 85,
    resumeUrl: '/resume-john.pdf',
  },
  {
    id: '2',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '+1-555-0123',
    position: 'Full Stack Developer',
    status: 'screening',
    appliedAt: '2024-01-20',
    aiScore: 78,
    resumeUrl: '/resume-john-fullstack.pdf',
  },
  {
    id: '3',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '+1-555-0123',
    position: 'Senior Developer',
    status: 'rejected',
    appliedAt: '2024-01-10',
    aiScore: 65,
    resumeUrl: '/resume-john-senior.pdf',
  },
];

export const MyApplications: React.FC = () => {
  const { user } = useAuth();
  const [applications] = useState<Candidate[]>(mockUserApplications);
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'screening': return 'bg-yellow-100 text-yellow-800';
      case 'interview': return 'bg-blue-100 text-blue-800';
      case 'offered': return 'bg-purple-100 text-purple-800';
      case 'hired': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'screening': return <Clock size={16} className="text-yellow-600" />;
      case 'interview': return <Calendar size={16} className="text-blue-600" />;
      case 'offered': return <CheckCircle size={16} className="text-purple-600" />;
      case 'hired': return <CheckCircle size={16} className="text-green-600" />;
      case 'rejected': return <XCircle size={16} className="text-red-600" />;
      default: return <AlertCircle size={16} className="text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'screening': return 'Under Review';
      case 'interview': return 'Interview Scheduled';
      case 'offered': return 'Offer Extended';
      case 'hired': return 'Hired';
      case 'rejected': return 'Not Selected';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const filteredApplications = applications.filter(app =>
    selectedStatus === '' || app.status === selectedStatus
  );

  const stats = {
    total: applications.length,
    screening: applications.filter(a => a.status === 'screening').length,
    interview: applications.filter(a => a.status === 'interview').length,
    hired: applications.filter(a => a.status === 'hired').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Applications</h2>
        <div className="text-sm text-gray-600">
          Welcome back, {user?.firstName}!
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Under Review</p>
              <p className="text-2xl font-bold text-gray-900">{stats.screening}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Interviews</p>
              <p className="text-2xl font-bold text-gray-900">{stats.interview}</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-600" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Successful</p>
              <p className="text-2xl font-bold text-gray-900">{stats.hired}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </Card>
      </div>

      {/* Applications List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Application History</CardTitle>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="screening">Under Review</option>
              <option value="interview">Interview</option>
              <option value="offered">Offered</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredApplications.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No applications found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((application) => (
                <div key={application.id} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {application.position}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Applied on {formatDate(application.appliedAt || '')}
                      </p>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(application.status)}
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                          {getStatusText(application.status)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600 mb-1">AI Score</div>
                      <div className="text-2xl font-bold text-blue-600">
                        {application.aiScore}%
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      Application ID: {application.id}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(application.resumeUrl, '_blank')}
                      >
                        <Eye size={16} className="mr-2" />
                        View Resume
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (application.resumeUrl) {
                            // Create a proper download with actual content
                            const resumeContent = `
Resume for ${application.firstName} ${application.lastName}
Position: ${application.position}
Email: ${application.email}
Phone: ${application.phone}

AI Score: ${application.aiScore}%

Skills: ${application.skills?.join(', ') || 'Not specified'}
Experience: ${application.experience || 'Not specified'}
Education: ${application.education || 'Not specified'}

Strengths:
${application.strengths?.map(strength => `- ${strength}`).join('\n') || 'Not specified'}

Weaknesses:
${application.weaknesses?.map(weakness => `- ${weakness}`).join('\n') || 'Not specified'}

Recommendation: ${application.recommendation || 'Not specified'}
Summary: ${application.summary || 'Not specified'}

Applied on: ${application.appliedAt}
                            `.trim();

                            const blob = new Blob([resumeContent], { type: 'application/pdf' });
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = `resume-${application.position.toLowerCase().replace(/\s+/g, '-')}.pdf`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            URL.revokeObjectURL(url);
                          }
                        }}
                      >
                        <Download size={16} className="mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>

                  {/* Status-specific information */}
                  {application.status === 'interview' && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Next Step:</strong> Your interview is scheduled. Check your email for details and meeting link.
                      </p>
                    </div>
                  )}

                  {application.status === 'offered' && (
                    <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm text-purple-800">
                        <strong>Congratulations!</strong> An offer has been extended. Please review the details and respond within 7 days.
                      </p>
                    </div>
                  )}

                  {application.status === 'rejected' && (
                    <div className="mt-4 p-3 bg-red-50 rounded-lg">
                      <p className="text-sm text-red-800">
                        We appreciate your interest in this position. While we won't be moving forward with your application at this time, we encourage you to apply for future opportunities.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="text-left justify-start h-auto py-4">
              <div>
                <div className="font-medium">Apply for New Position</div>
                <div className="text-sm text-gray-500">Browse available jobs</div>
              </div>
            </Button>
            <Button variant="outline" className="text-left justify-start h-auto py-4">
              <div>
                <div className="font-medium">Update Resume</div>
                <div className="text-sm text-gray-500">Keep your profile current</div>
              </div>
            </Button>
            <Button variant="outline" className="text-left justify-start h-auto py-4">
              <div>
                <div className="font-medium">Contact Recruiter</div>
                <div className="text-sm text-gray-500">Get help with applications</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
