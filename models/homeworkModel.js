const mongoose = require('mongoose');

const homeworkSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: Date,
  completed: Boolean
});

module.exports = mongoose.model('Homework', homeworkSchema);
