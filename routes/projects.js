const ensureAuth = require('../middleware/auth');
const express = require('express');
const { body, param, validationResult } = require('express-validator');
const ctrl = require('../controllers/projectController');
const router = express.Router();

router.get('/', ctrl.getAllProjects);

router.get('/:id',
  param('id').isMongoId().withMessage('Invalid id'),
  (req,res,next)=>{ const e=validationResult(req); if(!e.isEmpty()) return res.status(400).json({errors:e.array()}); next(); },
  ctrl.getProjectById);

router.post('/',
  body('title').notEmpty().withMessage('title required'),
  body('ownerId').notEmpty().isMongoId().withMessage('ownerId required'),
  (req,res,next)=>{ const e=validationResult(req); if(!e.isEmpty()) return res.status(400).json({errors:e.array()}); next(); },
  ctrl.createProject);

router.put('/:id',
  param('id').isMongoId().withMessage('Invalid id'),
  (req,res,next)=>{ const e=validationResult(req); if(!e.isEmpty()) return res.status(400).json({errors:e.array()}); next(); },
  ctrl.updateProject);

router.delete('/:id',
  param('id').isMongoId().withMessage('Invalid id'),
  (req,res,next)=>{ const e=validationResult(req); if(!e.isEmpty()) return res.status(400).json({errors:e.array()}); next(); },
  ctrl.deleteProject);

router.post('/', ensureAuth, createProject);
router.put('/:id', ensureAuth, updateProject);
router.delete('/:id', ensureAuth, deleteProject);


module.exports = router;