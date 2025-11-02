const express = require('express');
const { body, param, validationResult } = require('express-validator');

const router = express.Router();
const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');

// auth middleware
const ensureAuth = require('../middleware/auth');

/**
 * GET /projects
 */
router.get('/', async (req, res, next) => {
  try {
    return await getAllProjects(req, res, next);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /projects/:id
 */
router.get(
  '/:id',
  param('id').isMongoId().withMessage('Invalid id'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    return getProjectById(req, res, next);
  }
);

/**
 * POST /projects  (protected)
 */
router.post(
  '/',
  ensureAuth,
  body('title').notEmpty().withMessage('title required'),
  body('ownerId').notEmpty().isMongoId().withMessage('ownerId required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    return createProject(req, res, next);
  }
);

/**
 * PUT /projects/:id  (protected)
 */
router.put(
  '/:id',
  ensureAuth,
  param('id').isMongoId().withMessage('Invalid id'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    return updateProject(req, res, next);
  }
);

/**
 * DELETE /projects/:id (protected)
 */
router.delete(
  '/:id',
  ensureAuth,
  param('id').isMongoId().withMessage('Invalid id'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    return deleteProject(req, res, next);
  }
);

module.exports = router;