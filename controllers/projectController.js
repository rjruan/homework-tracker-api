const Project = require('../models/project');

/**
 * GET /projects
 */
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (err) {
    console.error('getAllProjects error:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /projects/:id
 */
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.status(200).json(project);
  } catch (err) {
    console.error('getProjectById error:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * POST /projects
 */
const createProject = async (req, res) => {
  try {
    const p = new Project(req.body);
    const saved = await p.save();
    res.status(201).json({ id: saved._id });
  } catch (err) {
    console.error('createProject error:', err);
    res.status(400).json({ message: err.message });
  }
};

/**
 * PUT /projects/:id
 */
const updateProject = async (req, res) => {
  try {
    const result = await Project.updateOne({ _id: req.params.id }, { $set: req.body });
    if (result.matchedCount === 0) return res.status(404).json({ message: 'Not found' });
    res.status(204).send();
  } catch (err) {
    console.error('updateProject error:', err);
    res.status(400).json({ message: err.message });
  }
};

/**
 * DELETE /projects/:id
 */
const deleteProject = async (req, res) => {
  try {
    const result = await Project.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Not found' });
    res.status(200).json({ message: 'Deleted' });
  } catch (err) {
    console.error('deleteProject error:', err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
};