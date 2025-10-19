const express = require('express');
const router = express.Router();
const Homework = require('../models/homework');

// GET all homework
router.get('/', async (req, res) => {
  try {
    const homeworkList = await Homework.find();
    res.json(homeworkList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new homework
router.post('/', async (req, res) => {
  const homework = new Homework({
    title: req.body.title,
    description: req.body.description,
    dueDate: req.body.dueDate,
  });

  try {
    const newHomework = await homework.save();
    res.status(201).json(newHomework);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
