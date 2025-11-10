const Homework = require('../models/homework');
const bcrypt = require('bcrypt');
const User = require('../models/user');

// GET all
const getAllHomeworks = async (req, res) => {
  try {
    const homeworks = await Homework.find();
    res.status(200).json(homeworks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//GET single
const getHomeworkById = async (req, res) => {
  try {
    const homework = await Homework.findById(req.params.id);
    if (!homework) {
      return res.status(404).json({ message: 'Homework not found' });
    }
    res.status(200).json(homework);
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

// Update homework by ID
const updateHomework = async (req, res, next) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  try {
    const updatedHomework = await Homework.findByIdAndUpdate(
      id,
      { title, completed },
      { new: true }
    );

    if (!updatedHomework) {
      const error = new Error('Homework not found');
      error.status = 404;
      throw error;
    }

    res.json(updatedHomework);
  } catch (err) {
    next(err);
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

async function signup(req, res) {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
  const hash = await bcrypt.hash(password, 10);
  const u = new User({ email, passwordHash: hash, name });
  await u.save();
  res.status(201).json({ id: u._id });
}
module.exports = { signup };

module.exports = {
  getAllHomeworks,
  getHomeworkById,
  createHomework,
  deleteHomework,
  updateHomework
};

