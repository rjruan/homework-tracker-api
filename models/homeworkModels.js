const mongoose = require('mongoose');

const homeworkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  dueDate: Date,
});

module.exports = mongoose.model('Homework', homeworkSchema);
