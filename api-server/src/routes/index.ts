import { Hono } from 'hono';
import {
  createDeployment,
  getDeploymentsByProjectId,
} from '../controllers/deploymentController.js';
import {
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectsByUserId,
} from '../controllers/projectController.js';
import { createUser, getUserById } from '../controllers/userController.js';
import { addLog, getLogs } from '../controllers/logController.js';

const app = new Hono();

// Deployment Routes
app.post('/deployment', createDeployment);
app.get('/deployments/:projectid', getDeploymentsByProjectId);

// Project Routes
app.post('/project', createProject);
app.get('/projects/:userid', getProjectsByUserId);
app.get('/project/:id', getProjectById);
app.put('/project/:id', updateProject);
app.delete('/project/:id', deleteProject);

// User Routes
app.post('/user', createUser);
app.get('/user/:id', getUserById);

// Log Routes
app.post('/log', addLog);
app.get('/logs', getLogs);

export default app;