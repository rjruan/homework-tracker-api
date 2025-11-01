const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['idea','active','completed','archived'], default: 'idea' },
  priority: { type: String, enum: ['low','medium','high'], default: 'medium' },
  startDate: Date,
  dueDate: Date,
  createdAt: { type: Date, default: Date.now },
  tags: [String]
});

module.exports = mongoose.model('Project', projectSchema);