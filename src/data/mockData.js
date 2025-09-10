// src/data/mockData.js
export const mockCourses = [
  { id: 1, title: "Introduction to React", faculty: "Dr. Evelyn Reed", progress: 65, description: "Master the fundamentals of React, including components, hooks, and state management.", modules: 8, students: 120 },
  { id: 2, title: "Advanced CSS with Tailwind", faculty: "Dr. Evelyn Reed", progress: 30, description: "Dive deep into modern CSS techniques and build complex, responsive layouts with Tailwind.", modules: 12, students: 95 },
  { id: 3, title: "Data Structures & Algorithms", faculty: "Prof. Liam Carter", progress: 0, description: "A comprehensive look at fundamental data structures and algorithms for problem-solving.", modules: 15, students: 150 },
  { id: 4, title: "UI/UX Design Principles", faculty: "Prof. Chloe Bennett", progress: 90, description: "Learn the core principles of user interface and user experience design.", modules: 10, students: 80 },
];

export const mockUsers = {
    students: [
        { id: 'S001', name: 'Alex Johnson', email: 'alex.j@example.com', avatar: 'https://placehold.co/100x100/E2E8F0/4A5568?text=AJ' },
        { id: 'S002', name: 'Maria Garcia', email: 'maria.g@example.com', avatar: 'https://placehold.co/100x100/E2E8F0/4A5568?text=MG' },
        { id: 'S003', name: 'Sam Wilson', email: 'sam.w@example.com', avatar: 'https://placehold.co/100x100/E2E8F0/4A5568?text=SW' },
    ],
    faculty: [
        { id: 'F001', name: 'Dr. Evelyn Reed', email: 'evelyn.r@acadamix.edu', avatar: 'https://placehold.co/100x100/E2E8F0/4A5568?text=ER' },
        { id: 'F002', name: 'Prof. Liam Carter', email: 'liam.c@acadamix.edu', avatar: 'https://placehold.co/100x100/E2E8F0/4A5568?text=LC' },
    ]
};

export const mockQuizzes = [
    { id: 1, courseId: 1, title: "React Basics Quiz", questions: 10, timeLimit: 15, dueDate: "2025-08-15" },
    { id: 2, courseId: 2, title: "Tailwind Flexbox Challenge", questions: 5, timeLimit: 10, dueDate: "2025-08-20" },
];

export const mockAssignments = [
    { id: 1, courseId: 1, title: "Build a To-Do App", dueDate: "2025-08-18" },
    { id: 2, courseId: 3, title: "Implement a Linked List", dueDate: "2025-09-01" },
    { id: 3, courseId: 1, title: "Database Design Project", dueDate: "2025-09-15" },
    { id: 4, courseId: 2, title: "Research Paper on AI Ethics", dueDate: "2025-09-20" },
    { id: 5, courseId: 3, title: "Algorithm Analysis", dueDate: "2025-09-25" },
];

// --- NEW SUBMISSIONS DATA ---
export const mockSubmissions = [
    { 
        id: 1, 
        assignmentId: 1, 
        studentId: 'S002', 
        submittedAt: '2025-08-17', 
        content: 'Here is my To-Do App submission.', 
        grade: 'A-',
        feedback: 'Excellent work! Great UI design and clean code structure. Consider adding unit tests.'
    },
    { 
        id: 2, 
        assignmentId: 1, 
        studentId: 'S003', 
        submittedAt: '2025-08-18', 
        content: 'Attached is my project file.', 
        grade: 'B+',
        feedback: 'Good implementation overall. Some optimization opportunities in the algorithm logic.'
    },
    { 
        id: 3, 
        assignmentId: 2, 
        studentId: 'S002', 
        submittedAt: '2025-09-01', 
        content: 'Linked list implementation with all methods.', 
        grade: 'A',
        feedback: 'Perfect implementation! All edge cases handled correctly.'
    },
    { 
        id: 4, 
        assignmentId: 3, 
        studentId: 'S003', 
        submittedAt: '2025-09-16', 
        content: 'Database design with ERD diagrams.', 
        grade: 'B',
        feedback: 'Good design but missing some normalization. Review 3NF principles.'
    },
];
