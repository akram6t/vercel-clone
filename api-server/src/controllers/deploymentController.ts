import type { Context } from 'hono';
import { prisma } from '../services/index.js';
import { handleError } from '../utils/errorHandler.js';
import { schemas } from '../schemas/index.js'; // Import Zod schemas
import { z } from 'zod'; // Import Zod for error handling

export const createDeployment = async (c: Context) => {
    try {
        // Validate the request body
        const body = await c.req.json();
        const validatedBody = schemas.CreateDeploymentInputSchema.parse(body);

        // Check if the project exists
        const project = await prisma.project.findUnique({
            where: { id: validatedBody.projectId },
        });

        if (!project) {
            return handleError(c, { message: 'Project not found' }, 404);
        }

        // Create the deployment
        const deployment = await prisma.deployment.create({
            data: {
                projectId: validatedBody.projectId,
                branch: validatedBody.branch,
            },
        });

        return c.json({ data: deployment ?? {} }, 201);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return handleError(c, { message: 'Validation failed', errors: error.errors }, 400);
        }
        return handleError(c, error);
    }
};

export const getDeploymentsByProjectId = async (c: Context) => {
    try {
        // Validate the query parameters using the Zod schema
        const projectId = c.req.param('projectid');
        const validateProjectId = z.string().uuid().parse(projectId);
        // const validatedQuery = schemas.DeploymentResponseSchema.parse(projectid);

        // Fetch deployments based on the validated query
        const deployments = await prisma.deployment.findMany({
            where: {
                projectId: validateProjectId
            },
            include:{
                project: true
            }
        });

        return c.json({ data: deployments });
    } catch (error) {
        // Handle Zod validation errors
        if (error instanceof z.ZodError) {
            return handleError(c, { message: 'Validation failed', errors: error.errors }, 400);
        }
        // Handle other errors
        return handleError(c, error);
    }
};