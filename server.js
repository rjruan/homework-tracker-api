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

// Middleware
app.use(cors());
app.use(express.json());

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
