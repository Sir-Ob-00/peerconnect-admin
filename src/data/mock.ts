export const MOCK_STUDENTS = [
  { id: '1', name: 'Alice Johnson', email: 'alice.johnson@university.edu', department: 'Computer Science', skills: ['React', 'TypeScript', 'Node.js'], status: 'Active', joinedDate: '2025-08-15', avatar: 'https://i.pravatar.cc/150?u=1', verified: true, academicLevel: 'Senior', learningInterests: ['Machine Learning', 'Python'], bio: 'Passionate about frontend development and building accessible UIs. Currently working on a full-stack project using React and Node.js.', availability: 'Weekends' },
  { id: '2', name: 'Bob Smith', email: 'bob.smith@university.edu', department: 'Mechanical Engineering', skills: ['AutoCAD', 'SolidWorks', 'MATLAB'], status: 'Suspended', joinedDate: '2025-09-01', avatar: 'https://i.pravatar.cc/150?u=2', verified: true, academicLevel: 'Junior', learningInterests: ['Robotics', 'Python'], bio: 'Looking to learn more about automation and robotics systems.', availability: 'Evenings' },
  { id: '3', name: 'Charlie Davis', email: 'charlie.davis@university.edu', department: 'Mathematics', skills: ['Calculus', 'Statistics', 'R'], status: 'Pending', joinedDate: '2026-01-10', avatar: 'https://i.pravatar.cc/150?u=3', verified: false, academicLevel: 'Sophomore', learningInterests: ['Data Science', 'Python'], bio: 'Math enthusiast trying to transition to data science and machine learning.', availability: 'Weekdays' },
  { id: '4', name: 'Diana Prince', email: 'diana.prince@university.edu', department: 'Business', skills: ['Marketing', 'Public Speaking', 'Leadership'], status: 'Active', joinedDate: '2025-11-20', avatar: 'https://i.pravatar.cc/150?u=4', verified: true, academicLevel: 'Senior', learningInterests: ['Finance', 'Entrepreneurship'], bio: 'Aspiring entrepreneur building a social impact startup.', availability: 'Flexible' },
  { id: '5', name: 'Evan Wright', email: 'evan.wright@university.edu', department: 'Physics', skills: ['Quantum Mechanics', 'Python', 'LaTeX'], status: 'Active', joinedDate: '2026-02-05', avatar: 'https://i.pravatar.cc/150?u=5', verified: true, academicLevel: 'Graduate', learningInterests: ['Programming', 'Data Science'], bio: 'Researching particle physics at the university lab.', availability: 'Weekends' },
  { id: '6', name: 'Fiona Green', email: 'fiona.green@university.edu', department: 'Computer Science', skills: ['Python', 'Django', 'PostgreSQL'], status: 'Active', joinedDate: '2025-10-12', avatar: 'https://i.pravatar.cc/150?u=6', verified: true, academicLevel: 'Junior', learningInterests: ['Machine Learning', 'Cloud Computing'], bio: 'Backend developer passionate about building scalable APIs.', availability: 'Weekdays' },
  { id: '7', name: 'George Harris', email: 'george.harris@university.edu', department: 'Business', skills: ['Finance', 'Excel', 'Data Analysis'], status: 'Pending', joinedDate: '2026-03-18', avatar: 'https://i.pravatar.cc/150?u=7', verified: false, academicLevel: 'Freshman', learningInterests: ['Investing', 'Economics'], bio: 'First-year business student eager to learn about financial markets.', availability: 'Evenings' },
  { id: '8', name: 'Helen Clark', email: 'helen.clark@university.edu', department: 'Mathematics', skills: ['Linear Algebra', 'Probability', 'MATLAB'], status: 'Active', joinedDate: '2025-07-22', avatar: 'https://i.pravatar.cc/150?u=8', verified: true, academicLevel: 'Senior', learningInterests: ['Data Science', 'Deep Learning'], bio: 'Math major interested in applied statistics and data science.', availability: 'Weekends' },
  { id: '9', name: 'Ian Martinez', email: 'ian.martinez@university.edu', department: 'Mechanical Engineering', skills: ['SolidWorks', 'FEA', 'Thermodynamics'], status: 'Suspended', joinedDate: '2025-12-01', avatar: 'https://i.pravatar.cc/150?u=9', verified: true, academicLevel: 'Graduate', learningInterests: ['Robotics', 'Programming'], bio: 'Graduate researcher in mechanical systems and automation.', availability: 'Flexible' },
  { id: '10', name: 'Julia Turner', email: 'julia.turner@university.edu', department: 'Computer Science', skills: ['Figma', 'UI/UX', 'CSS'], status: 'Active', joinedDate: '2026-04-05', avatar: 'https://i.pravatar.cc/150?u=10', verified: true, academicLevel: 'Sophomore', learningInterests: ['Frontend Development', 'React'], bio: 'Design-minded developer who loves creating beautiful interfaces.', availability: 'Weekdays' },
  { id: '11', name: 'Kevin Brown', email: 'kevin.brown@university.edu', department: 'Physics', skills: ['Classical Mechanics', 'Python', 'LaTeX'], status: 'Active', joinedDate: '2025-06-30', avatar: 'https://i.pravatar.cc/150?u=11', verified: true, academicLevel: 'Senior', learningInterests: ['Quantum Computing', 'Programming'], bio: 'Physics student exploring computational physics.', availability: 'Evenings' },
  { id: '12', name: 'Laura Wilson', email: 'laura.wilson@university.edu', department: 'Business', skills: ['Accounting', 'Excel', 'Management'], status: 'Pending', joinedDate: '2026-05-14', avatar: 'https://i.pravatar.cc/150?u=12', verified: false, academicLevel: 'Junior', learningInterests: ['Marketing', 'Leadership'], bio: 'Business student aiming for a career in management consulting.', availability: 'Weekends' },
];

export const MOCK_SESSIONS = [
  { id: '1', requester: 'Alice Johnson', receiver: 'Charlie Davis', skill: 'Statistics', date: '2026-07-21T14:00:00Z', status: 'Pending' },
  { id: '2', requester: 'Bob Smith', receiver: 'Alice Johnson', skill: 'React', date: '2026-07-19T10:00:00Z', status: 'Completed' },
  { id: '3', requester: 'Diana Prince', receiver: 'Evan Wright', skill: 'Programming', date: '2026-07-25T16:00:00Z', status: 'Accepted' },
  { id: '4', requester: 'Charlie Davis', receiver: 'Bob Smith', skill: 'AutoCAD', date: '2026-07-15T09:00:00Z', status: 'Cancelled' },
  { id: '5', requester: 'Fiona Green', receiver: 'Alice Johnson', skill: 'TypeScript', date: '2026-07-22T11:00:00Z', status: 'Completed' },
  { id: '6', requester: 'Helen Clark', receiver: 'Charlie Davis', skill: 'R', date: '2026-07-18T15:00:00Z', status: 'Completed' },
  { id: '7', requester: 'Julia Turner', receiver: 'Fiona Green', skill: 'Python', date: '2026-07-28T13:00:00Z', status: 'Pending' },
  { id: '8', requester: 'Kevin Brown', receiver: 'Evan Wright', skill: 'Quantum Mechanics', date: '2026-08-01T10:00:00Z', status: 'Accepted' },
  { id: '9', requester: 'Laura Wilson', receiver: 'Diana Prince', skill: 'Public Speaking', date: '2026-07-10T12:00:00Z', status: 'Completed' },
  { id: '10', requester: 'Ian Martinez', receiver: 'Bob Smith', skill: 'SolidWorks', date: '2026-07-12T09:00:00Z', status: 'Cancelled' },
];

export const MOCK_REPORTS = [
  { id: '1', reporter: 'Alice Johnson', reportedUser: 'Bob Smith', reason: 'No-show for session', date: '2026-07-19', status: 'Pending', details: 'Bob never showed up for our scheduled React session on July 19th. I waited for 30 minutes and tried contacting them but received no response.' },
  { id: '2', reporter: 'Diana Prince', reportedUser: 'Charlie Davis', reason: 'Inappropriate behavior', date: '2026-07-10', status: 'Resolved', details: 'Charlie made inappropriate comments during our study session. After a formal warning, Charlie apologized and the issue has been resolved.' },
  { id: '3', reporter: 'Fiona Green', reportedUser: 'Ian Martinez', reason: 'Harassment', date: '2026-07-22', status: 'Pending', details: 'Ian has been sending repeated unwanted messages through the platform after I declined a session request.' },
  { id: '4', reporter: 'Helen Clark', reportedUser: 'Laura Wilson', reason: 'Misrepresentation of skills', date: '2026-07-15', status: 'Resolved', details: 'Laura claimed to be proficient in Statistics but was unable to answer basic questions during our session. After investigation, her profile has been updated to reflect accurate skill levels.' },
  { id: '5', reporter: 'Kevin Brown', reportedUser: 'George Harris', reason: 'Spam', date: '2026-07-25', status: 'Pending', details: 'George has been posting promotional content in the discussion board which violates the platform guidelines.' },
];

export const MOCK_REVIEWS = [
  { id: '1', reviewer: 'Alice Johnson', recipient: 'Diana Prince', rating: 5, comment: 'Diana is an amazing mentor! She explained complex marketing concepts in a very easy-to-understand way.', date: '2026-07-20' },
  { id: '2', reviewer: 'Bob Smith', recipient: 'Evan Wright', rating: 2, comment: 'Was somewhat helpful but arrived late to both sessions.', date: '2026-07-18' },
  { id: '3', reviewer: 'Charlie Davis', recipient: 'Alice Johnson', rating: 4, comment: 'Great session, learned a lot about React hooks and state management.', date: '2026-07-15' },
  { id: '4', reviewer: 'Diana Prince', recipient: 'Fiona Green', rating: 5, comment: 'Fiona is incredibly knowledgeable about Python. Highly recommend her as a tutor!', date: '2026-07-22' },
  { id: '5', reviewer: 'Evan Wright', recipient: 'Charlie Davis', rating: 3, comment: 'Decent session on Statistics but could have prepared better materials.', date: '2026-07-14' },
  { id: '6', reviewer: 'Fiona Green', recipient: 'Helen Clark', rating: 5, comment: 'Helen taught me so much about data visualization with R. Excellent teacher!', date: '2026-07-23' },
  { id: '7', reviewer: 'George Harris', recipient: 'Alice Johnson', rating: 4, comment: 'Very patient and thorough in explaining TypeScript generics.', date: '2026-07-19' },
  { id: '8', reviewer: 'Julia Turner', recipient: 'Kevin Brown', rating: 5, comment: 'Kevin has a gift for explaining complex physics concepts simply. Thank you!', date: '2026-07-25' },
];

export const MOCK_STATS = {
  totalStudents: { value: 14532, trend: { value: '12%', positive: true } },
  totalSessions: { value: 3840, trend: { value: '8%', positive: true } },
  totalReviews: { value: 8920, trend: { value: '5%', positive: true } },
  totalReports: { value: 42, trend: { value: '2%', positive: false } },
};

export const MOCK_SESSION_STATS = {
  total: { value: 3840, label: 'Total Sessions' },
  pending: { value: 245, label: 'Pending' },
  completed: { value: 2890, label: 'Completed' },
  cancelled: { value: 185, label: 'Cancelled' },
};

export const MOCK_REPORT_STATS = {
  pending: { value: 18, label: 'Pending Reports' },
  resolved: { value: 24, label: 'Resolved Reports' },
};
