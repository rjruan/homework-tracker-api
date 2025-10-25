const express = require('express');
const router = express.Router();
const {
  getAllHomeworks,
  getHomeworkById,
  createHomework,
  deleteHomework,
  updateHomework,
} = require('../controllers/homeworkControllers');
const { body, param, validationResult } = require('express-validator');

// Validation middlewares
const validateHomework = [
  body('title').notEmpty().withMessage('Title is required'),
  body('completed').isBoolean().withMessage('Completed must be true or false'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateId = [
  param('id').isMongoId().withMessage('Invalid ID'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

/**
 * @swagger
 * components:
 *   schemas:
 *     Homework:
 *       type: object
 *       required:
 *         - title
 *         - completed
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated id
 *         title:
 *           type: string
 *           description: Homework title
 *         completed:
 *           type: boolean
 *           description: Whether the homework is completed
 *       example:
 *         id: 68fd25fececac2833e5e83d8
 *         title: Updated Homework Title
 *         completed: true
 */

/**
 * @swagger
 * /homework:
 *   get:
 *     summary: Get all homeworks
 *     tags: [Homework]
 *     responses:
 *       200:
 *         description: List of homework tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Homework'
 *   post:
 *     summary: Create a new homework
 *     tags: [Homework]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Homework'
 *     responses:
 *       201:
 *         description: Homework created
 */

/**
 * @swagger
 * /homework/{id}:
 *   get:
 *     summary: Get homework by ID
 *     tags: [Homework]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Homework ID
 *     responses:
 *       200:
 *         description: Homework data
 *   put:
 *     summary: Update homework by ID
 *     tags: [Homework]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 68fd25fececac2833e5e83d8
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - completed
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated Homework Title
 *               completed:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Homework updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Homework not found
 *   delete:
 *     summary: Delete homework by ID
 *     tags: [Homework]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 68fd25fececac2833e5e83d8
 *     responses:
 *       200:
 *         description: Homework deleted successfully
 *       400:
 *         description: Invalid ID
 *       404:
 *         description: Homework not found
 */

// Routes with validation applied correctly
router.get('/', getAllHomeworks);
router.get('/:id', validateId, getHomeworkById);
router.post('/', validateHomework, createHomework);
router.put('/:id', validateId, validateHomework, updateHomework);
router.delete('/:id', validateId, deleteHomework);

module.exports = router;
