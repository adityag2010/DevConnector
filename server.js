const express = require('express');
const connectDB = require('./config/db');

const authRoutes = require('./routes/api/auth');
const postsRoutes = require('./routes/api/posts');
const profileRoutes = require('./routes/api/profile');
const usersRoutes = require('./routes/api/users');

const PORT = process.env.PORT || 5000; // for PORT on server environment

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API Running!'));

// Define Routes
app.use('/api/users', usersRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/posts', postsRoutes);

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}!`);
});
