import type { Context } from 'hono';
import { prisma } from '../services/index.js';
import { handleError } from '../utils/errorHandler.js';
import {
    schemas
} from '../schemas/index.js'; // Import Zod schemas
import { z } from 'zod'; // Import Zod for error handling

export const createProject = async (c: Context) => {
    try {
        // Validate the request body
        const body = await c.req.json();
        const { userId, gitUrl, subDomain, customDomain } = schemas.CreateProjectInputSchema.parse(body);

        // Create the project
        const project = await prisma.project.create({
            data: {
                userId,
                gitUrl,
                subDomain,
                customDomain
            },
        });

        // Return the validated project response
        return c.json(schemas.ProjectResponseSchema.parse(project), 201);
    } catch (error) {
        // Handle Zod validation errors
        if (error instanceof z.ZodError) {
            return handleError(c, { message: 'Validation failed', errors: error.errors }, 400);
        }
        // Handle other errors
        return handleError(c, error);
    }
};

export const getProjectsByUserId = async (c: Context) => {
    try {
        // Extract and validate the userId parameter (UUID)
        const userId = c.req.param('userid');
        const validatedUserId = z.string().uuid().parse(userId);

        // Fetch all projects for the given userId
        const projects = await prisma.project.findMany({
            where: { userId: validatedUserId },
        });

        // Return the validated projects response
        return c.json({ data: projects });
        // return c.json(schemas.ProjectResponseSchema.array().parse(projects));
    } catch (error) {
        // Handle Zod validation errors
        if (error instanceof z.ZodError) {
            return handleError(c, { message: 'Validation failed', errors: error.errors }, 400);
        }
        // Handle other errors
        return handleError(c, error);
    }
};



export const getProjectById = async (c: Context) => {
    try {
        // Validate the id parameter (UUID)
        const id = c.req.param('id');
        const validatedId = z.string().uuid().parse(id);

        // Fetch the project by id
        const project = await prisma.project.findUnique({
            where: { id: validatedId },
            include: { user: true }
        });

        // Return the validated project response
        return c.json({ data: project ?? {} });
    } catch (error) {
        // Handle Zod validation errors
        if (error instanceof z.ZodError) {
            return handleError(c, { message: 'Validation failed', errors: error.errors }, 400);
        }
        // Handle other errors
        return handleError(c, error);
    }
};

export const updateProject = async (c: Context) => {
    try {
        // Validate the id parameter (UUID)
        const id = c.req.param('id');
        const validatedId = z.string().uuid().parse(id);

        // Validate the request body
        const body = await c.req.json();
        const validatedBody = schemas.UpdateProjectInputSchema.parse(body);


        // Update the project
        const project = await prisma.project.update({
            where: { id: validatedId },
            data: validatedBody,
        });

        // Return the validated project response
        return c.json({ data: project });
    } catch (error) {
        // Handle Zod validation errors
        if (error instanceof z.ZodError) {
            console.log(JSON.stringify(error.errors));

            return handleError(c, { message: 'Validation failed', errors: error.errors }, 400);
        }
        // Handle other errors
        return handleError(c, error);
    }
};

export const deleteProject = async (c: Context) => {
    try {
        // Validate the id parameter (UUID)
        const id = c.req.param('id');
        const validatedId = z.string().uuid().parse(id);

        // Delete the project
        await prisma.project.delete({
            where: { id: validatedId },
        });

        return c.json({ message: 'Project deleted successfully' });
    } catch (error) {
        // Handle Zod validation errors
        if (error instanceof z.ZodError) {
            return handleError(c, { message: 'Validation failed', errors: error.errors }, 400);
        }
        // Handle other errors
        return handleError(c, error);
    }
};