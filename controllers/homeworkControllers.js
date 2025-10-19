const Homework = require('../models/homeworkModel');

// GET all
const getAllHomeworks = async (req, res) => {
  try {
    const homeworks = await Homework.find();
    res.status(200).json(homeworks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST new
const createHomework = async (req, res) => {
  try {
    const homework = new Homework(req.body);
    const saved = await homework.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE by ID
const deleteHomework = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Homework.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Homework not found' });
    }

    res.status(200).json({ message: 'Homework deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllHomeworks, createHomework,deleteHomework };
