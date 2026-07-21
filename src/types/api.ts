export interface StudentProfile {
  university: string;
  department: string;
  level: string;
  skills: string[];
  learningInterests: string[];
  bio: string;
  availability: string;
  isAvailable: boolean;
  profilePhoto: string | null;
  studentId: string | null;
}

export interface StudentListItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  accountStatus: string;
  profileImage: string | null;
  isEmailVerified: boolean;
  studentVerified: boolean;
  verificationStatus: string;
  setupProgress: string;
  createdAt: string;
  updatedAt: string;
  profile: StudentProfile;
}

export interface StudentDetail {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  accountStatus: string;
  profileImage: string | null;
  isEmailVerified: boolean;
  studentVerified: boolean;
  verificationStatus: string;
  setupProgress: string;
  createdAt: string;
  updatedAt: string;
  profile: StudentProfile;
}

export interface StudentsListResponse {
  data: StudentListItem[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface SimpleUser {
  id: string;
  firstName: string;
  lastName: string;
  profileImage: string | null;
  email: string;
}

export interface SessionListItem {
  id: string;
  skill: string;
  message: string;
  status: string;
  scheduledDate: string;
  createdAt: string;
  updatedAt: string;
  requester: SimpleUser;
  receiver: SimpleUser;
}

export type SessionDetail = SessionListItem;

export interface SessionsListResponse {
  data: SessionListItem[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface ReviewUser {
  id: string;
  firstName: string;
  lastName: string;
  profileImage: string | null;
}

export interface ReviewListItem {
  id: string;
  sessionId: string;
  rating: number;
  comment: string;
  createdAt: string;
  reviewer: ReviewUser;
  receiverId: string;
}

export interface ReviewsListResponse {
  data: ReviewListItem[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface ReviewUserDetail {
  id: string;
  fullName: string;
  email: string;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
}

export interface ReviewsForUserResponse {
  user: ReviewUserDetail;
  summary: ReviewSummary;
  data: Array<{
    id: string;
    sessionId: string;
    rating: number;
    comment: string;
    createdAt: string;
    reviewer: ReviewUser;
  }>;
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface SessionBreakdown {
  PENDING: number;
  ACCEPTED: number;
  COMPLETED: number;
  REJECTED: number;
  CANCELLED: number;
}

export interface StatsResponseData {
  totalStudents: number;
  totalSessions: number;
  totalReviews: number;
  pendingVerifications: number;
  sessionsByStatus: SessionBreakdown;
  newStudentsLast30Days: number;
  averageRating: number;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  department: string;
  status: string;
  joinedDate: string;
  avatar?: string;
  verified: boolean;
  academicLevel: string;
  skills: string[];
  learningInterests: string[];
  bio: string;
  availability: string;
  activeSessions?: number;
  totalSessions?: number;
  averageRating?: number;
  reviews?: number;
}

export interface Session {
  id: string;
  requester: string;
  receiver: string;
  skill: string;
  date: string;
  status: string;
}

export interface SessionsStats {
  total: number;
  pending: number;
  completed: number;
  cancelled: number;
}

export interface Report {
  id: string;
  reporter: string;
  reportedUser: string;
  reason: string;
  date: string;
  status: string;
  details: string;
}

export interface ReportStats {
  pending: number;
  resolved: number;
}

export interface Review {
  id: string;
  reviewer: string;
  recipient: string;
  rating: number;
  comment: string;
  date: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalSessions: number;
  totalReviews: number;
  totalReports: number;
  studentGrowth: string;
  sessionGrowth: string;
  reviewGrowth: string;
  reportGrowth: string;
  trendIsPositive: boolean;
}

export interface VerificationItem {
  userId: string;
  fullName: string;
  email: string;
  studentId: string;
  department: string;
  level: string;
  idPhotoUrl: string;
  submittedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  accountStatus: string;
  profileImage: string | null;
  isEmailVerified: boolean;
  studentVerified: boolean;
  verificationStatus: string;
  setupProgress: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: AdminUser;
  accessToken: string;
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken?: string;
}
