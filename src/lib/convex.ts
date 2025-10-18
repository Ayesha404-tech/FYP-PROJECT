import { ConvexReactClient } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL || "");

export default convex;

// Helper functions for API calls
export const convexApi = {
  // Authentication
  auth: {
    login: async (email: string, password: string) => {
      return await convex.action(api.auth.login, { email, password });
    },
    register: async (userData: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      role: "admin" | "hr" | "employee" | "candidate";
      department?: string;
      position?: string;
      salary?: number;
    }) => {
      return await convex.action(api.auth.register, userData);
    },
    verifyToken: async (token: string) => {
      return await convex.action(api.auth.verifyToken, { token });
    },
  },

  // Users
  users: {
    getAll: () => convex.query(api.users.getUsers),
    getById: (id: Id<"users">) => convex.query(api.users.get, { id }),
    create: (userData: {
      email: string;
      passwordHash: string;
      firstName: string;
      lastName: string;
      role: "admin" | "hr" | "employee" | "candidate";
      department?: string;
      position?: string;
      salary?: number;
      joinDate?: string;
      isActive: boolean;
    }) => convex.mutation(api.users.create, userData),
    update: (userData: {
      userId: Id<"users">;
      firstName?: string;
      lastName?: string;
      role?: "admin" | "hr" | "employee" | "candidate";
      department?: string;
      position?: string;
      salary?: number;
      isActive?: boolean;
    }) => convex.mutation(api.users.updateUser, userData),
    delete: (userId: Id<"users">) => convex.mutation(api.users.deleteUser, { userId }),
  },

  // Candidates
  candidates: {
    getAll: () => convex.query(api.candidates.getAllCandidates),
    getById: (candidateId: Id<"candidates">) => convex.query(api.candidates.getCandidateById, { candidateId }),
    create: (candidateData: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      position: string;
      resumeUrl?: string;
    }) => convex.mutation(api.candidates.createCandidate, candidateData),
    updateStatus: (candidateId: Id<"candidates">, status: "applied" | "screening" | "interview" | "offered" | "hired" | "rejected") => convex.mutation(api.candidates.updateCandidateStatus, { candidateId, status }),
    updateAIScore: (data: {
      candidateId: Id<"candidates">;
      aiScore: number;
      skills?: string[];
      experience?: string;
      education?: string;
      strengths?: string[];
      weaknesses?: string[];
      recommendation?: string;
      summary?: string;
    }) => convex.mutation(api.candidates.updateCandidateAIScore, data),
    search: (searchData: {
      searchTerm: string;
      position?: string;
      status?: "applied" | "screening" | "interview" | "offered" | "hired" | "rejected";
    }) => convex.query(api.candidates.searchCandidates, searchData),
  },

  // Interviews
  interviews: {
    getByCandidate: (candidateId: Id<"candidates">) => convex.query(api.interviews.getInterviewsByCandidate, { candidateId }),
    getByInterviewer: (interviewerId: Id<"users">) => convex.query(api.interviews.getInterviewsByInterviewer, { interviewerId }),
    getAll: () => convex.query(api.interviews.getAllInterviews),
    schedule: (interviewData: {
      candidateId: Id<"candidates">;
      interviewerId: Id<"users">;
      position: string;
      scheduledAt: string;
      meetingLink?: string;
    }) => convex.mutation(api.interviews.scheduleInterview, interviewData),
    updateStatus: (data: {
      interviewId: Id<"interviews">;
      status: "scheduled" | "completed" | "cancelled";
      feedback?: string;
      rating?: number;
    }) => convex.mutation(api.interviews.updateInterviewStatus, data),
    getCalendar: (data: {
      startDate: string;
      endDate: string;
      interviewerId?: Id<"users">;
    }) => convex.query(api.interviews.getInterviewCalendar, data),
    reschedule: (data: {
      interviewId: Id<"interviews">;
      newScheduledAt: string;
      meetingLink?: string;
    }) => convex.mutation(api.interviews.rescheduleInterview, data),
  },

  // Payroll
  payroll: {
    getByUser: (userId: Id<"users">) => convex.query(api.payroll.getPayrollByUser, { userId }),
    getAll: () => convex.query(api.payroll.getAllPayroll),
    process: (payrollData: {
      userId: Id<"users">;
      month: string;
      year: number;
      baseSalary: number;
      allowances?: number;
      deductions?: number;
    }) => convex.mutation(api.payroll.processPayroll, payrollData),
    generatePayslip: (payrollId: Id<"payroll">) => convex.mutation(api.payroll.generatePayslip, { payrollId }),
    updateStatus: (data: {
      payrollId: Id<"payroll">;
      status: "pending" | "processed" | "paid";
    }) => convex.mutation(api.payroll.updatePayrollStatus, data),
  },

  // Performance
  performance: {
    getByUser: (userId: Id<"users">) => convex.query(api.performance.getPerformanceByUser, { userId }),
    getAll: () => convex.query(api.performance.getAllPerformanceReviews),
    create: (reviewData: {
      userId: Id<"users">;
      reviewerId: Id<"users">;
      period: string;
      score: number;
      feedback: string;
      goals: string[];
      achievements: string[];
    }) => convex.mutation(api.performance.createPerformanceReview, reviewData),
    update: (data: {
      reviewId: Id<"performance">;
      score?: number;
      feedback?: string;
      goals?: string[];
      achievements?: string[];
    }) => convex.mutation(api.performance.updatePerformanceReview, data),
    getAnalytics: (userId?: Id<"users">) => convex.query(api.performance.getPerformanceAnalytics, { userId }),
  },

  // Leaves
  leaves: {
    getByUser: (userId: Id<"users">) => convex.query(api.leaves.getLeavesByUser, { userId }),
    getAll: () => convex.query(api.leaves.getAllLeaves),
    create: (leaveData: {
      userId: Id<"users">;
      type: "sick" | "vacation" | "personal" | "maternity" | "paternity";
      startDate: string;
      endDate: string;
      reason: string;
    }) => convex.mutation(api.leaves.createLeaveRequest, leaveData),
    updateStatus: (data: {
      leaveId: Id<"leaves">;
      status: "approved" | "rejected";
      approvedBy: Id<"users">;
    }) => convex.mutation(api.leaves.updateLeaveStatus, data),
  },

  // Attendance
  attendance: {
    getByUser: (userId: Id<"users">) => convex.query(api.attendance.getAttendanceByUser, { userId }),
    getAll: () => convex.query(api.attendance.getAllAttendance),
    clockIn: (userId: Id<"users">) => convex.mutation(api.attendance.clockIn, { userId }),
    clockOut: (userId: Id<"users">) => convex.mutation(api.attendance.clockOut, { userId }),
  },

  // AI
  ai: {
    analyzeResume: (data: {
      candidateId: Id<"candidates">;
      resumeText: string;
    }) => convex.mutation(api.ai.analyzeResume, data),
    chatWithAI: (data: {
      userId: Id<"users">;
      message: string;
    }) => convex.mutation(api.ai.chatWithAI, data),
    getChatHistory: (userId: Id<"users">) => convex.query(api.ai.getChatHistory, { userId }),
  },

  // Email
  email: {
    sendLeaveNotification: (data: {
      userEmail: string;
      userName: string;
      leaveType: string;
      status: string;
      startDate: string;
      endDate: string;
    }) => convex.mutation(api.email.sendLeaveNotification, data),
    sendInterviewNotification: (data: {
      candidateEmail: string;
      candidateName: string;
      position: string;
      scheduledAt: string;
      meetingLink?: string;
    }) => convex.mutation(api.email.sendInterviewNotification, data),
    sendPayrollNotification: (data: {
      userEmail: string;
      userName: string;
      month: string;
      year: number;
      netSalary: number;
    }) => convex.mutation(api.email.sendPayrollNotification, data),
    sendWelcomeEmail: (data: {
      userEmail: string;
      userName: string;
      role: string;
      temporaryPassword: string;
    }) => convex.mutation(api.email.sendWelcomeEmail, data),
  },

  // Notifications
  notifications: {
    get: (userId: Id<"users">) => convex.query(api.notifications.getNotifications, { userId }),
    create: (notificationData: {
      userId: Id<"users">;
      title: string;
      message: string;
      type: "info" | "success" | "warning" | "error";
    }) => convex.mutation(api.notifications.createNotification, notificationData),
    markAsRead: (notificationId: Id<"notifications">) => convex.mutation(api.notifications.markAsRead, { notificationId }),
    markAllAsRead: (userId: Id<"users">) => convex.mutation(api.notifications.markAllAsRead, { userId }),
  },

  // Reports
  reports: {
    getAttendanceReport: (data: {
      startDate: string;
      endDate: string;
      userId?: Id<"users">;
    }) => convex.query(api.reports.getAttendanceReport, data),
    getLeaveReport: (data: {
      startDate: string;
      endDate: string;
      userId?: Id<"users">;
    }) => convex.query(api.reports.getLeaveReport, data),
    getPayrollReport: (data: {
      year: number;
      month?: string;
      userId?: Id<"users">;
    }) => convex.query(api.reports.getPayrollReport, data),
    getPerformanceReport: (data: {
      period?: string;
      userId?: Id<"users">;
    }) => convex.query(api.reports.getPerformanceReport, data),
    getDashboardAnalytics: () => convex.query(api.reports.getDashboardAnalytics),
  },
};
