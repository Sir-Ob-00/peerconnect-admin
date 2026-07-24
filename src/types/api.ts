export interface UserSkill {
  id: string;
  name: string;
  category: string;
  proficiency: string;
}

export interface AcademicProfile {
  university: string;
  department: string;
  programme: string;
  level: string;
}

export interface StudentProfile {
  wantsToLearnCourses: boolean;
  wantsToLearnSkills: boolean;
  skills: string[];
  learningInterests: string[];
  bio: string;
  availability: string;
  isAvailable: boolean;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  university: string;
  department: string;
  level: string;
  accountType: string;
  accountStatus: string;
  avatarUrl: string | null;
  bio: string;
  skills: UserSkill[];
  learningInterests: string[];
  availability: string;
  setupProgress: string;
  idPhotoUrl: string | null;
  rating: number;
  sessionsCompleted: number;
  studentsHelped: number;
  isAvailable: boolean;
  isOnline: boolean;
  isVerified: boolean;
  emailVerified: boolean;
  studentVerified: boolean;
  verificationStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentListItem {
  id: string;
  fullName: string;
  email: string;
  role: string;
  accountStatus: string;
  avatarUrl: string | null;
  isEmailVerified: boolean;
  studentVerified: boolean;
  verificationStatus: string;
  setupProgress: string;
  university: string;
  department: string;
  level: string;
  createdAt: string;
  updatedAt: string;
  academicProfile?: AcademicProfile;
}

export interface CourseItem {
  id: string;
  name: string;
  code?: string;
}

export interface SkillItem {
  id: string;
  name: string;
}

export interface LearningGoals {
  courses: CourseItem[];
  skills: SkillItem[];
}

export interface CanHelpWith {
  courses: CourseItem[];
  skills: SkillItem[];
}

export interface LearningInterestObject {
  id: string;
  name: string;
  description?: string;
}

export interface AvailabilitySlot {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export interface IdVerification {
  idPhotoUrl: string;
  status: string;
  submittedAt: string;
  rejectionReason: string | null;
}

export interface StudentSummary {
  id: string;
  fullName: string;
  email: string;
  profileImage: string | null;
  verificationStatus: string;
  setupProgress: string;
  createdAt: string;
}

export interface StudentDetail {
  student: StudentSummary;
  academicProfile: AcademicProfile;
  learningGoals: LearningGoals;
  canHelpWith: CanHelpWith;
  learningInterests: LearningInterestObject[];
  availability: AvailabilitySlot[];
  bio: string | null;
  idVerification: IdVerification;
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
  verificationStatus: string;
  idPhotoUrl: string;
  submittedAt: string;
  academicProfile: AcademicProfile;
  profile: StudentProfile;
  adminNotes?: string | null;
  profileImage?: string | null;
}

export interface VerificationDetailResponse {
  student: StudentSummary;
  academicProfile: AcademicProfile;
  learningGoals: LearningGoals;
  canHelpWith: CanHelpWith;
  learningInterests: LearningInterestObject[];
  availability: AvailabilitySlot[];
  bio: string | null;
  idVerification: IdVerification;
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

export interface UniversityItem {
  id: string;
  name: string;
  code?: string;
  location?: string;
  status: string;
  departmentsCount?: number;
  studentsCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface DepartmentItem {
  id: string;
  name: string;
  code?: string;
  universityId: string;
  universityName?: string;
  status: string;
  programmesCount?: number;
  studentsCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface ProgrammeItem {
  id: string;
  name: string;
  code?: string;
  departmentId: string;
  departmentName?: string;
  universityName?: string;
  durationYears?: number;
  status: string;
  studentsCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface LevelItem {
  id: string;
  name: string;
  code: string;
  sortOrder: number;
  status: string;
  studentsCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface StudyGroupItem {
  id: string;
  name: string;
  description?: string;
  creatorId: string;
  creatorName?: string;
  university?: string;
  department?: string;
  programme?: string;
  membersCount: number;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

export interface StudyGroupMember {
  userId: string;
  fullName: string;
  email: string;
  avatarUrl?: string | null;
  role: string;
  joinedAt: string;
}

export interface ChatConversationItem {
  id: string;
  type: 'DIRECT' | 'GROUP';
  name?: string;
  participants: Array<{
    id: string;
    fullName: string;
    avatarUrl?: string | null;
  }>;
  lastMessage?: string;
  lastMessageAt?: string;
  isFlagged?: boolean;
  createdAt: string;
}

export interface ChatMessageItem {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  isFlagged?: boolean;
  createdAt: string;
}

export interface ReportItem {
  id: string;
  reporterId: string;
  reporterName: string;
  reporterEmail: string;
  reportedUserId?: string;
  reportedUserName?: string;
  targetType: 'USER' | 'STUDY_GROUP' | 'MESSAGE' | 'REVIEW';
  targetId: string;
  reason: string;
  details?: string;
  status: 'PENDING' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';
  adminNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AnalyticsOverview {
  totalStudents: number;
  pendingApprovals: number;
  approvedStudents: number;
  rejectedStudents: number;
  suspendedStudents: number;
  activeStudents: number;
  totalStudyGroups: number;
  totalConnections: number;
  activeUsers: number;
  userGrowthRate: number;
  sessionCompletionRate: number;
}

export interface UserAnalytics {
  registrationsOverTime: Array<{ date: string; count: number }>;
  studentsByUniversity: Array<{ university: string; count: number }>;
  studentsByDepartment: Array<{ department: string; count: number }>;
  studentsByLevel: Array<{ level: string; count: number }>;
  approvalStatusBreakdown: {
    pending: number;
    approved: number;
    rejected: number;
    suspended: number;
  };
}

export interface SessionAnalytics {
  sessionsOverTime: Array<{ date: string; count: number }>;
  sessionsByStatus: {
    PENDING: number;
    ACCEPTED: number;
    COMPLETED: number;
    REJECTED: number;
    CANCELLED: number;
  };
  topSkillsRequested: Array<{ skill: string; count: number }>;
}

export interface EngagementAnalytics {
  activeStudyGroups: number;
  totalPeerConnections: number;
  messagesSent30Days: number;
  avgSessionDurationMinutes: number;
}

export interface NotificationItem {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type: string;
  targetType?: string;
  isRead?: boolean;
  sentAt: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  targetAudience: 'ALL' | 'UNIVERSITY' | 'DEPARTMENT' | 'LEVEL';
  targetValue?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  createdAt: string;
  publishedAt?: string;
}

export interface AuditLogItem {
  id: string;
  action: string;
  adminId: string;
  adminName: string;
  targetEntity: string;
  targetId?: string;
  description: string;
  ipAddress?: string;
  createdAt: string;
}

export interface SystemSetting {
  key: string;
  value: string | number | boolean | Record<string, unknown>;
  category: 'GENERAL' | 'REGISTRATION' | 'NOTIFICATIONS' | 'SECURITY' | 'SYSTEM';
  description?: string;
  updatedAt?: string;
}

