const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Course = require('../models/Course');

dotenv.config();

// Connect to database with proper options
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB Connection Failed:', error.message);
        process.exit(1);
    }
};

const seedDatabase = async () => {
    try {
        await connectDB();

        // Clear existing data
        console.log('🗑️ Clearing existing data...');
        await User.deleteMany({});
        await Course.deleteMany({});
        console.log('✅ Cleared existing data');

        // Seed courses
        console.log('📚 Seeding courses...');
        const courses = await Course.insertMany([
            {
                title: 'JavaScript Fundamentals',
                description: 'Master the basics of JavaScript programming',
                category: 'programming',
                level: 'Beginner',
                duration: '4 weeks',
                points: 500,
                icon: 'fa-js',
                color: 'linear-gradient(135deg, #3b82f6, #1e40af)',
                lessons: [
                    {
                        lessonNumber: 1,
                        title: 'Variables and Data Types',
                        duration: '1 hour',
                        icon: 'fa-book',
                        content: 'Learn about var, let, const and different data types',
                        quiz: [
                            {
                                question: 'What is the correct syntax to declare a variable?',
                                options: ['var x = 5;', 'variable x = 5;', 'v x = 5;', 'x := 5;'],
                                correctAnswer: 0
                            }
                        ]
                    },
                    {
                        lessonNumber: 2,
                        title: 'Functions and Scope',
                        duration: '1.5 hours',
                        icon: 'fa-cog',
                        content: 'Understand functions, parameters, and scope',
                        quiz: [
                            {
                                question: 'What does the return keyword do?',
                                options: ['Exits a loop', 'Stops execution and returns a value', 'Creates a new function', 'Declares a variable'],
                                correctAnswer: 1
                            }
                        ]
                    },
                    {
                        lessonNumber: 3,
                        title: 'Arrays and Objects',
                        duration: '2 hours',
                        icon: 'fa-database',
                        content: 'Work with arrays and objects',
                        quiz: [
                            {
                                question: 'Which method adds an element to the end of an array?',
                                options: ['push()', 'pop()', 'shift()', 'unshift()'],
                                correctAnswer: 0
                            }
                        ]
                    },
                    {
                        lessonNumber: 4,
                        title: 'DOM Manipulation',
                        duration: '2 hours',
                        icon: 'fa-code',
                        content: 'Interact with the DOM',
                        quiz: [
                            {
                                question: 'How do you select an element by ID?',
                                options: ['getElementByID', 'getElementById', 'getById', 'selectById'],
                                correctAnswer: 1
                            }
                        ]
                    },
                    {
                        lessonNumber: 5,
                        title: 'Async/Await',
                        duration: '2 hours',
                        icon: 'fa-sync',
                        content: 'Handle asynchronous code',
                        quiz: [
                            {
                                question: 'What does async/await help with?',
                                options: ['Synchronous code', 'Asynchronous operations', 'Variable declaration', 'Function creation'],
                                correctAnswer: 1
                            }
                        ]
                    }
                ],
                objectives: [
                    'Understand variables and data types',
                    'Master functions and scope',
                    'Work with arrays and objects',
                    'Manipulate the DOM',
                    'Handle asynchronous code'
                ],
                enrolledCount: 0,
                isPublished: true
            },
            {
                title: 'React for Beginners',
                description: 'Build modern web applications with React',
                category: 'programming',
                level: 'Intermediate',
                duration: '6 weeks',
                points: 750,
                icon: 'fa-react',
                color: 'linear-gradient(135deg, #3b82f6, #0ea5e9)',
                lessons: [
                    {
                        lessonNumber: 1,
                        title: 'React Basics',
                        duration: '1 hour',
                        icon: 'fa-puzzle-piece',
                        content: 'Learn React concepts part 1',
                        quiz: [
                            {
                                question: 'What is React?',
                                options: ['A database', 'A JavaScript library', 'A server', 'A CSS framework'],
                                correctAnswer: 1
                            }
                        ]
                    },
                    {
                        lessonNumber: 2,
                        title: 'Components and Props',
                        duration: '1.5 hours',
                        icon: 'fa-puzzle-piece',
                        content: 'Learn React concepts part 2',
                        quiz: [
                            {
                                question: 'What are props?',
                                options: ['Properties passed to components', 'Component state', 'Hooks', 'CSS styles'],
                                correctAnswer: 0
                            }
                        ]
                    },
                    {
                        lessonNumber: 3,
                        title: 'State and Lifecycle',
                        duration: '2 hours',
                        icon: 'fa-sync',
                        content: 'Learn React concepts part 3',
                        quiz: [
                            {
                                question: 'What is state in React?',
                                options: ['Data that props hold', 'Data that changes over time', 'JSX syntax', 'Virtual DOM'],
                                correctAnswer: 1
                            }
                        ]
                    },
                    {
                        lessonNumber: 4,
                        title: 'Hooks in Depth',
                        duration: '2 hours',
                        icon: 'fa-link',
                        content: 'Learn React concepts part 4',
                        quiz: [
                            {
                                question: 'What is useState?',
                                options: ['A component', 'A hook for state management', 'A lifecycle method', 'A prop'],
                                correctAnswer: 1
                            }
                        ]
                    },
                    {
                        lessonNumber: 5,
                        title: 'Advanced Patterns',
                        duration: '2 hours',
                        icon: 'fa-star',
                        content: 'Learn React concepts part 5',
                        quiz: [
                            {
                                question: 'What is context API used for?',
                                options: ['Styling', 'Global state management', 'Routing', 'API calls'],
                                correctAnswer: 1
                            }
                        ]
                    }
                ],
                objectives: [
                    'Understand React components and props',
                    'Master state management with hooks',
                    'Build reusable UI components',
                    'Create full-stack applications',
                    'Advanced React patterns'
                ],
                enrolledCount: 0,
                isPublished: true
            },
            {
                title: 'Python Programming',
                description: 'Learn Python from basics to advanced',
                category: 'programming',
                level: 'Beginner',
                duration: '8 weeks',
                points: 800,
                icon: 'fa-python',
                color: 'linear-gradient(135deg, #3b82f6, #10b981)',
                lessons: [
                    {
                        lessonNumber: 1,
                        title: 'Python Basics',
                        duration: '1 hour',
                        icon: 'fa-play-circle',
                        content: 'Learn Python basics part 1',
                        quiz: [
                            {
                                question: 'What is Python?',
                                options: ['A snake', 'A programming language', 'A framework', 'A library'],
                                correctAnswer: 1
                            }
                        ]
                    },
                    {
                        lessonNumber: 2,
                        title: 'Data Structures',
                        duration: '2 hours',
                        icon: 'fa-database',
                        content: 'Learn Python basics part 2',
                        quiz: [
                            {
                                question: 'What is a list in Python?',
                                options: ['Immutable collection', 'Mutable collection', 'A function', 'A class'],
                                correctAnswer: 1
                            }
                        ]
                    },
                    {
                        lessonNumber: 3,
                        title: 'OOP Concepts',
                        duration: '2.5 hours',
                        icon: 'fa-object-group',
                        content: 'Learn Python basics part 3',
                        quiz: [
                            {
                                question: 'What is a class?',
                                options: ['A function', 'A blueprint for objects', 'A variable', 'A module'],
                                correctAnswer: 1
                            }
                        ]
                    },
                    {
                        lessonNumber: 4,
                        title: 'File Handling',
                        duration: '1.5 hours',
                        icon: 'fa-file',
                        content: 'Learn Python basics part 4',
                        quiz: [
                            {
                                question: 'How do you open a file in Python?',
                                options: ['file.open()', 'open(file)', 'read(file)', 'access(file)'],
                                correctAnswer: 1
                            }
                        ]
                    },
                    {
                        lessonNumber: 5,
                        title: 'Advanced Topics',
                        duration: '3 hours',
                        icon: 'fa-rocket',
                        content: 'Learn Python basics part 5',
                        quiz: [
                            {
                                question: 'What is a decorator?',
                                options: ['A class', 'A function that modifies another function', 'A variable', 'An import'],
                                correctAnswer: 1
                            }
                        ]
                    }
                ],
                objectives: [
                    'Python syntax and basics',
                    'Data structures',
                    'Object-oriented programming',
                    'File handling and databases',
                    'Advanced Python topics'
                ],
                enrolledCount: 0,
                isPublished: true
            }
        ]);

        console.log(`✅ Seeded ${courses.length} courses`);

        // Seed sample users
        console.log('👥 Seeding users...');
        const users = await User.insertMany([
            {
                username: 'alex_thunder',
                email: 'alex@example.com',
                password: 'password123',
                points: 0,
                level: 1,
                streak: 0,
                avatar: 'AT'
            },
            {
                username: 'sarah_chen',
                email: 'sarah@example.com',
                password: 'password123',
                points: 0,
                level: 1,
                streak: 0,
                avatar: 'SC'
            },
            {
                username: 'marcus_steel',
                email: 'marcus@example.com',
                password: 'password123',
                points: 0,
                level: 1,
                streak: 0,
                avatar: 'MS'
            },
            {
                username: 'emma_watson',
                email: 'emma@example.com',
                password: 'password123',
                points: 0,
                level: 1,
                streak: 0,
                avatar: 'EW'
            },
            {
                username: 'david_kim',
                email: 'david@example.com',
                password: 'password123',
                points: 0,
                level: 1,
                streak: 0,
                avatar: 'DK'
            }
        ]);

        console.log(`✅ Seeded ${users.length} users`);

        // Enroll first user in a course
        console.log('📝 Setting up enrollments...');
        const firstUser = users[0];
        firstUser.enrolledCourses.push({
            courseId: courses[0]._id,
            progress: 0,
            completedLessons: []
        });
        await firstUser.save();

        console.log('✅ Seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error.message);
        process.exit(1);
    }
};

seedDatabase();