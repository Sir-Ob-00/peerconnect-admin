
export const MOCK_STUDENTS = [
  { id: '1', name: 'Alice Johnson', email: 'alice@uni.edu', department: 'Computer Science', skills: ['React', 'TypeScript'], status: 'Active', joinedDate: '2025-08-15', avatar: 'https://i.pravatar.cc/150?u=1', verified: true, academicLevel: 'Senior', learningInterests: ['Machine Learning', 'Python'], bio: 'Passionate about frontend development and building accessible UIs.', availability: 'Weekends' },
  { id: '2', name: 'Bob Smith', email: 'bob@uni.edu', department: 'Mechanical Engineering', skills: ['AutoCAD', 'SolidWorks'], status: 'Suspended', joinedDate: '2025-09-01', avatar: 'https://i.pravatar.cc/150?u=2', verified: true, academicLevel: 'Junior', learningInterests: ['Robotics'], bio: 'Looking to learn more about automation.', availability: 'Evenings' },
  { id: '3', name: 'Charlie Davis', email: 'charlie@uni.edu', department: 'Mathematics', skills: ['Calculus', 'Statistics'], status: 'Pending', joinedDate: '2026-01-10', avatar: 'https://i.pravatar.cc/150?u=3', verified: false, academicLevel: 'Sophomore', learningInterests: ['Data Science', 'R'], bio: 'Math enthusiast trying to transition to data science.', availability: 'Weekdays' },
  { id: '4', name: 'Diana Prince', email: 'diana@uni.edu', department: 'Business', skills: ['Marketing', 'Public Speaking'], status: 'Active', joinedDate: '2025-11-20', avatar: 'https://i.pravatar.cc/150?u=4', verified: true, academicLevel: 'Senior', learningInterests: ['Leadership', 'Finance'], bio: 'Aspiring entrepreneur.', availability: 'Flexible' },
  { id: '5', name: 'Evan Wright', email: 'evan@uni.edu', department: 'Physics', skills: ['Quantum Mechanics'], status: 'Active', joinedDate: '2026-02-05', avatar: 'https://i.pravatar.cc/150?u=5', verified: true, academicLevel: 'Graduate', learningInterests: ['Programming'], bio: 'Researching particle physics.', availability: 'Weekends' },
];

export const MOCK_SESSIONS = [
  { id: '1', requester: 'Alice Johnson', receiver: 'Charlie Davis', skill: 'Statistics', date: '2026-07-21T14:00:00Z', status: 'Pending' },
  { id: '2', requester: 'Bob Smith', receiver: 'Alice Johnson', skill: 'React', date: '2026-07-19T10:00:00Z', status: 'Completed' },
  { id: '3', requester: 'Diana Prince', receiver: 'Evan Wright', skill: 'Programming', date: '2026-07-25T16:00:00Z', status: 'Accepted' },
  { id: '4', requester: 'Charlie Davis', receiver: 'Bob Smith', skill: 'AutoCAD', date: '2026-07-15T09:00:00Z', status: 'Cancelled' },
];

export const MOCK_REPORTS = [
  { id: '1', reporter: 'Alice Johnson', reportedUser: 'Bob Smith', reason: 'No-show for session', date: '2026-07-19', status: 'Pending', details: 'Bob never showed up for our scheduled React session.' },
  { id: '2', reporter: 'Diana Prince', reportedUser: 'Charlie Davis', reason: 'Inappropriate behavior', date: '2026-07-10', status: 'Resolved', details: 'Resolved after mediation.' },
];

export const MOCK_REVIEWS = [
  { id: '1', reviewer: 'Alice Johnson', recipient: 'Diana Prince', rating: 5, comment: 'Diana is an amazing mentor!', date: '2026-07-20' },
  { id: '2', reviewer: 'Bob Smith', recipient: 'Evan Wright', rating: 2, comment: 'Was somewhat helpful but arrived late.', date: '2026-07-18' },
  { id: '3', reviewer: 'Charlie Davis', recipient: 'Alice Johnson', rating: 4, comment: 'Great session, learned a lot.', date: '2026-07-15' },
];

export const MOCK_STATS = {
  totalStudents: { value: 14532, trend: { value: '12%', positive: true } },
  totalSessions: { value: 3840, trend: { value: '8%', positive: true } },
  totalReviews: { value: 8920, trend: { value: '5%', positive: true } },
  totalReports: { value: 42, trend: { value: '2%', positive: false } },
};
