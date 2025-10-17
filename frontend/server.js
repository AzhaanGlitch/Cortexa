const express = require('express');
const path = require('path');
const app = express();

// Serve static files from current directory
app.use(express.static(path.join(__dirname)));

// Root route - serve login.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Route for login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Route for register page
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});

// Route for index/dashboard
app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route for courses page
app.get('/courses', (req, res) => {
    res.sendFile(path.join(__dirname, 'courses.html'));
});

// Route for leaderboard page
app.get('/leaderboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'leaderboard.html'));
});

// Route for challenges page
app.get('/challenges', (req, res) => {
    res.sendFile(path.join(__dirname, 'challenges.html'));
});

// Route for profile page
app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'profile.html'));
});

// Route for learn page
app.get('/learn', (req, res) => {
    res.sendFile(path.join(__dirname, 'learn.html'));
});

// Catch all other routes - try to serve as HTML file
app.get('*', (req, res) => {
    const requestedPage = req.path.substring(1); // Remove leading slash
    
    if (requestedPage === '') {
        res.sendFile(path.join(__dirname, 'login.html'));
    } else if (requestedPage.endsWith('.html')) {
        res.sendFile(path.join(__dirname, requestedPage), (err) => {
            if (err) {
                res.sendFile(path.join(__dirname, 'login.html'));
            }
        });
    } else {
        res.sendFile(path.join(__dirname, `${requestedPage}.html`), (err) => {
            if (err) {
                res.sendFile(path.join(__dirname, 'login.html'));
            }
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`\n================================`);
    console.log(`Frontend server running`);
    console.log(`================================`);
    console.log(`Main URL: http://localhost:${PORT}`);
    console.log(`Login: http://localhost:${PORT}/login`);
    console.log(`Register: http://localhost:${PORT}/register`);
    console.log(`Dashboard: http://localhost:${PORT}/index`);
    console.log(`================================\n`);
});