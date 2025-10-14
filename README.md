# CORTEXA - Gamified Learning Platform

A professional, modern gamified learning platform built with HTML, CSS, and JavaScript. Features a comprehensive multi-page system with courses, challenges, leaderboards, and user profiles.

## Features

### Core Features
- **Dashboard** - Overview of progress, active courses, and achievements
- **Course Catalog** - Browse and filter courses by category and difficulty
- **Interactive Quizzes** - Take quizzes with instant feedback and point rewards
- **Leaderboard** - Global rankings with podium display for top performers
- **Challenges** - Daily and weekly challenges for bonus points
- **User Profile** - Track achievements, level progress, and activity history
- **Gamification System** - Points, levels, badges, and streak tracking

### Design Features
- Professional dark theme with gradient accents
- Fully responsive design (mobile, tablet, desktop)
- Smooth animations and transitions
- Modern UI with clean typography
- Interactive hover effects and micro-interactions

## Project Structure

```
cortexa/
├── index.html          # Dashboard/Home page
├── courses.html        # Course catalog
├── learn.html          # Quiz/Learning interface
├── challenges.html     # Daily challenges
├── leaderboard.html    # Global leaderboard
├── profile.html        # User profile
├── style.css           # Global styles
├── common.js           # Shared functionality
├── dashboard.js        # Dashboard logic
├── courses.js          # Course page logic
├── learn.js            # Quiz/learning logic
├── challenges.js       # Challenges page logic
├── leaderboard.js      # Leaderboard logic
└── profile.js          # Profile page logic
```

## Setup Instructions

### Quick Start

1. **Download all files** to a single folder
2. **Open `index.html`** in your web browser
3. **Start exploring!** No server or build process required

### File Organization

Ensure all files are in the same directory:
```
your-project-folder/
├── index.html
├── courses.html
├── learn.html
├── challenges.html
├── leaderboard.html
├── profile.html
├── style.css
├── common.js
├── dashboard.js
├── courses.js
├── learn.js
├── challenges.js
├── leaderboard.js
└── profile.js
```

### Dependencies

All dependencies are loaded via CDN (no installation required):
- Bootstrap 5.3.0
- Font Awesome 6.4.0
- Chart.js 4.4.0

## How to Use

### Navigation

- **Dashboard** - Main hub showing progress, active courses, and quick actions
- **Courses** - Browse all available courses, filter by category
- **Challenges** - View and complete daily/weekly challenges
- **Leaderboard** - See global rankings and your position
- **Profile** - View your achievements, courses, and stats

### Taking a Quiz

1. Go to **Courses** page
2. Click on any course card
3. Click **"Start Course"** in the modal
4. Answer questions and click **"Next"**
5. View your results and earned points

### Earning Points

- Complete quiz questions (10 points each)
- Finish courses (50-1000 points based on difficulty)
- Complete challenges (100-500 bonus points)
- Unlock achievements (50-500 points)

### Leveling Up

- Earn 1000 points per level
- Level 1: 0-999 points
- Level 2: 1000-1999 points
- Level 3: 2000-2999 points
- And so on...

### Unlocking Badges

- **Starter** - Complete your first lesson (50 pts)
- **Fast Learner** - Complete 5 lessons in one day (100 pts)
- **Dedicated** - Maintain a 7-day streak (150 pts)
- **Master** - Complete 5 courses (300 pts)
- **Perfectionist** - Score 100% on 10 quizzes (200 pts)
- **Champion** - Reach top of leaderboard (500 pts)

## Customization

### Colors

Edit CSS variables in `style.css`:

```css
:root {
    --bg-primary: #0a0e27;        /* Main background */
    --bg-secondary: #151932;      /* Card backgrounds */
    --accent-blue: #0066ff;       /* Primary accent */
    --accent-cyan: #00d4ff;       /* Secondary accent */
    --accent-orange: #ff6b35;     /* Tertiary accent */
    --accent-purple: #8b5cf6;     /* Alternative accent */
}
```

### Adding New Courses

Edit the `AppState.courses` array in `common.js`:

```javascript
{
    id: 7,
    title: 'Your Course Name',
    category: 'programming', // or 'design', 'business', 'data', 'marketing'
    description: 'Course description',
    duration: '4 weeks',
    level: 'Beginner', // or 'Intermediate', 'Advanced'
    lessons: 24,
    points: 500,
    enrolled: 1000,
    progress: 0,
    status: 'new',
    icon: 'fa-your-icon',
    color: 'linear-gradient(135deg, #color1, #color2)'
}
```

### Adding New Questions

Edit the `quizState.questions` array in `learn.js`:

```javascript
{
    question: "Your question here?",
    options: [
        "Option 1",
        "Option 2",
        "Option 3",
        "Option 4"
    ],
    correct: 0 // Index of correct answer (0-3)
}
```

## Technical Details

### State Management

- All data is stored in-memory using JavaScript objects
- `AppState` object in `common.js` manages global state
- No localStorage or sessionStorage (not supported in artifacts)

### Data Persistence

Currently, data resets on page refresh. To add persistence:

1. **Option A** - Copy files to your local environment and use localStorage
2. **Option B** - Integrate with a backend API
3. **Option C** - Use a database service (Firebase, Supabase, etc.)

### Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Any modern browser with ES6+ support

## Future Enhancements

Potential features to add:

- [ ] User authentication system
- [ ] Backend integration with real database
- [ ] Social features (friends, messaging)
- [ ] More quiz question types (multiple choice, coding challenges)
- [ ] Video lessons integration
- [ ] Mobile app version
- [ ] Certificate generation
- [ ] Analytics dashboard
- [ ] Team/group learning features
- [ ] AI-powered personalized learning paths

## Troubleshooting

### Issue: Styles not loading
- Ensure `style.css` is in the same folder as HTML files
- Check browser console for errors
- Clear browser cache and refresh

### Issue: Scripts not working
- Ensure all `.js` files are in the same folder
- Check that CDN links are accessible
- Open browser console to see error messages

### Issue: Navigation not working
- Verify all HTML files exist in the same directory
- Check that file names match exactly (case-sensitive)

## License

This project is open source and available for educational purposes.

## Contributing

Feel free to customize and extend this project for your needs!

## Support

For questions or issues, refer to the code comments or browser console for debugging information.

---

**Built by using HTML, CSS, and JavaScript**