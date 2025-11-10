/* eslint-env node */
const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');

const ensureAuth = require('../middleware/auth');
const {
  getAllHomeworks,
  getHomeworkById,
  createHomework,
  updateHomework,
  deleteHomework
} = require('../controllers/homeworkControllers');

router.post('/', ensureAuth, validateHomework, createHomework);
router.put('/:id', ensureAuth, validateId, validateHomework, updateHomework);
router.delete('/:id', ensureAuth, validateId, deleteHomework);


// Validation middlewares (no auth here)
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
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  }
];

/**
 * @swagger
 * components:
 *   schemas:
 *     Homework:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         dueDate:
 *           type: string
 *           format: date
 *         completed:
 *           type: boolean
 *       example:
 *         _id: 68fd25fececac2833e5e83d8
 *         title: Finish assignment
 *         description: Do the exercises
 *         dueDate: 2025-10-25
 *         completed: false
 */

/**
 * @swagger
 * /homework:
 *   get:
 *     summary: Get all homeworks
 *     tags:
 *       - Homework
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
 *     summary: Create a new homework (requires auth)
 *     tags:
 *       - Homework
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date
 *             required:
 *               - title
 *     responses:
 *       201:
 *         description: Created - returns object with id
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */

// Public GET
router.get('/', getAllHomeworks);

// Protected POST: auth first, then validation
router.post('/', ensureAuth, validateHomework, async (req, res, next) => {
  try {
    // controller handles creation; controller should return the inserted id or object
    const created = await createHomework(req, res);
    // If controller already sent response, just return
    if (res.headersSent) return;
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /homework/{id}:
 *   get:
 *     summary: Get homework by ID
 *     tags:
 *       - Homework
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
 *     summary: Update homework by ID (requires auth)
 *     tags:
 *       - Homework
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               dueDate: { type: string, format: date }
 *               completed: { type: boolean }
 *     responses:
 *       200:
 *         description: Homework updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Homework not found
 *   delete:
 *     summary: Delete homework by ID (requires auth)
 *     tags:
 *       - Homework
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Homework deleted successfully
 *       400:
 *         description: Invalid ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Homework not found
 */

// Get by id (public)
router.get('/:id', validateId, getHomeworkById);

// PUT (protected) - ensureAuth first, then id validation, then body validation
router.put('/:id', ensureAuth, validateId, validateHomework, async (req, res, next) => {
  try {
    await updateHomework(req, res);
    if (!res.headersSent) res.status(200).json({ message: 'Homework updated' });
  } catch (err) {
    next(err);
  }
});

// DELETE (protected)
router.delete('/:id', ensureAuth, validateId, async (req, res, next) => {
  try {
    await deleteHomework(req, res);
    if (!res.headersSent) res.status(200).json({ message: 'Homework deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
