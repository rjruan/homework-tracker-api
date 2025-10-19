const express = require('express');
const router = express.Router();

// Correct path: go up one level (../) then into controllers/
const { getAllHomeworks, createHomework, deleteHomework } = require('../controllers/homeworkControllers');

// GET all
router.get('/', getAllHomeworks);

// POST new
router.post('/', createHomework);

// DELETE by ID
router.delete('/:id', deleteHomework);

module.exports = router;
