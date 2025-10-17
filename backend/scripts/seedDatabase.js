const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Course = require('../models/Course');

dotenv.config();

// Connect to database
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const seedDatabase = async () => {
    try {
        // Clear existing data
        await User.deleteMany({});
        await Course.deleteMany({});
        console.log('✅ Cleared existing data');

        // Seed courses
        const courses = await Course.insertMany([
            {
                title: 'JavaScript Fundamentals',
                description: 'Master the basics of JavaScript programming',
                category: 'programming',
                level: 'Beginner',
                duration: '4 weeks',
                points: 500,
                icon: 'fa-js',
                color: 'linear-gradient(135deg, #f7df1e, #f0db4f)',
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
                            },
                            {
                                question: 'Which of these is NOT a JS data type?',
                                options: ['String', 'Boolean', 'Float', 'Undefined'],
                                correctAnswer: 2
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
                enrolledCount: 2547,
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
                color: 'linear-gradient(135deg, #61dafb, #21a1c4)',
                lessons: Array(5).fill(null).map((_, i) => ({
                    lessonNumber: i + 1,
                    title: `React Lesson ${i + 1}`,
                    duration: `${1 + i * 0.5} hours`,
                    icon: 'fa-puzzle-piece',
                    content: `Learn React concepts part ${i + 1}`,
                    quiz: [
                        {
                            question: `Question for lesson ${i + 1}?`,
                            options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
                            correctAnswer: 0
                        }
                    ]
                })),
                objectives: [
                    'Understand React components',
                    'Master state and props',
                    'Use hooks effectively',
                    'Build real applications'
                ],
                enrolledCount: 1823,
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
                color: 'linear-gradient(135deg, #3776ab, #ffd343)',
                lessons: Array(5).fill(null).map((_, i) => ({
                    lessonNumber: i + 1,
                    title: `Python Lesson ${i + 1}`,
                    duration: `${2 + i * 0.5} hours`,
                    icon: 'fa-code',
                    content: `Learn Python concepts part ${i + 1}`,
                    quiz: [
                        {
                            question: `Python question ${i + 1}?`,
                            options: ['Option A', 'Option B', 'Option C', 'Option D'],
                            correctAnswer: 1
                        }
                    ]
                })),
                objectives: [
                    'Python syntax and basics',
                    'Data structures',
                    'Object-oriented programming',
                    'File handling and databases'
                ],
                enrolledCount: 3421,
                isPublished: true
            },
            {
                title: 'UI/UX Design Principles',
                description: 'Create beautiful and functional user interfaces',
                category: 'design',
                level: 'Beginner',
                duration: '5 weeks',
                points: 600,
                icon: 'fa-pencil-ruler',
                color: 'linear-gradient(135deg, #ff6b6b, #ee5a6f)',
                lessons: Array(5).fill(null).map((_, i) => ({
                    lessonNumber: i + 1,
                    title: `Design Lesson ${i + 1}`,
                    duration: `${1.5 + i * 0.5} hours`,
                    icon: 'fa-palette',
                    content: `Learn design concepts part ${i + 1}`,
                    quiz: [
                        {
                            question: `Design question ${i + 1}?`,
                            options: ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4'],
                            correctAnswer: 2
                        }
                    ]
                })),
                objectives: [
                    'Design principles',
                    'Color theory and typography',
                    'User research',
                    'Prototyping and testing'
                ],
                enrolledCount: 1654,
                isPublished: true
            },
            {
                title: 'Data Science with Python',
                description: 'Analyze data and build machine learning models',
                category: 'data',
                level: 'Advanced',
                duration: '10 weeks',
                points: 1000,
                icon: 'fa-chart-bar',
                color: 'linear-gradient(135deg, #667eea, #764ba2)',
                lessons: Array(5).fill(null).map((_, i) => ({
                    lessonNumber: i + 1,
                    title: `Data Science Lesson ${i + 1}`,
                    duration: `${2 + i * 0.5} hours`,
                    icon: 'fa-brain',
                    content: `Learn data science concepts part ${i + 1}`,
                    quiz: [
                        {
                            question: `Data science question ${i + 1}?`,
                            options: ['Pandas', 'NumPy', 'Scikit-learn', 'All of the above'],
                            correctAnswer: 3
                        }
                    ]
                })),
                objectives: [
                    'Data analysis with pandas',
                    'Data visualization',
                    'Machine learning basics',
                    'Deep learning introduction'
                ],
                enrolledCount: 2134,
                isPublished: true
            },
            {
                title: 'Digital Marketing Strategy',
                description: 'Master online marketing and grow your business',
                category: 'marketing',
                level: 'Intermediate',
                duration: '6 weeks',
                points: 650,
                icon: 'fa-bullhorn',
                color: 'linear-gradient(135deg, #f093fb, #f5576c)',
                lessons: Array(5).fill(null).map((_, i) => ({
                    lessonNumber: i + 1,
                    title: `Marketing Lesson ${i + 1}`,
                    duration: `${1.5 + i * 0.5} hours`,
                    icon: 'fa-chart-line',
                    content: `Learn marketing strategies part ${i + 1}`,
                    quiz: [
                        {
                            question: `Marketing question ${i + 1}?`,
                            options: ['SEO', 'SEM', 'Social Media', 'Email Marketing'],
                            correctAnswer: i % 4
                        }
                    ]
                })),
                objectives: [
                    'Marketing fundamentals',
                    'Social media strategy',
                    'SEO and content marketing',
                    'Analytics and optimization'
                ],
                enrolledCount: 1987,
                isPublished: true
            }
        ]);

        console.log(`✅ Seeded ${courses.length} courses`);

        // Seed sample users
        const users = await User.insertMany([
            {
                username: 'alex_thunder',
                email: 'alex@example.com',
                password: 'password123',
                points: 5240,
                level: 6,
                streak: 12,
                avatar: 'AT'
            },
            {
                username: 'sarah_chen',
                email: 'sarah@example.com',
                password: 'password123',
                points: 4890,
                level: 5,
                streak: 8,
                avatar: 'SC'
            },
            {
                username: 'marcus_steel',
                email: 'marcus@example.com',
                password: 'password123',
                points: 4560,
                level: 5,
                streak: 6,
                avatar: 'MS'
            },
            {
                username: 'emma_watson',
                email: 'emma@example.com',
                password: 'password123',
                points: 3980,
                level: 4,
                streak: 5,
                avatar: 'EW'
            },
            {
                username: 'david_kim',
                email: 'david@example.com',
                password: 'password123',
                points: 3750,
                level: 4,
                streak: 4,
                avatar: 'DK'
            }
        ]);

        console.log(`✅ Seeded ${users.length} users`);

        // Enroll some users in courses
        const firstUser = users[0];
        firstUser.enrolledCourses.push(
            {
                courseId: courses[0]._id,
                progress: 80,
                completedLessons: [1, 2, 3, 4],
                completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            },
            {
                courseId: courses[1]._id,
                progress: 45,
                completedLessons: [1, 2]
            }
        );
        await firstUser.save();

        console.log('✅ Database seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};

seedDatabase();