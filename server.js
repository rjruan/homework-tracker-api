// Load environment variables
const dotenv = require('dotenv');
dotenv.config();

// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const setupSwagger = require('./swagger'); // import the swagger setup

// Initialize express app
const app = express();

const projectRoutes = require('./routes/projects');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/projects', projectRoutes);

const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
require('./config/passport')(passport);

app.use(session({
  secret: process.env.SESSION_SECRET || 'devsecret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

app.use(passport.initialize());
app.use(passport.session());

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
const homeworkRoutes = require('./routes/homework');
app.use('/homework', homeworkRoutes); 

// Swagger docs
setupSwagger(app); 

// Base route
app.get('/', (req, res) => {
  res.send('Homework Tracker API is running 📝');
});

// Error handling middleware (final)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
