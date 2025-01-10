import type { Context } from 'hono';
import { prisma } from '../services/index.js';
import { handleError } from '../utils/errorHandler.js';
import { schemas } from '../schemas/index.js'; // Import the Zod schema
import { z } from 'zod'; // Import Zod for error handling

// CreateUser if not exist
export const createUser = async (c: Context) => {
  try {
    // Validate the request body using the Zod schema
    const body = await c.req.json();
    const validatedBody = schemas.GithubSignInInputSchema.parse(body);

    // Destructure validated fields
    const { email, name, avatar, githubId, githubUsername, accessToken } = validatedBody;

    // Check if the user already exists by email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    let user;

    if (existingUser) {
      // If the user exists, return the existing user data
      user = existingUser;
    } else {
      // If the user does not exist, create a new user
      user = await prisma.user.create({
        data: {
          email,
          name,
          avatar,
          githubId,
          githubUsername,
          accessToken,
        },
      });
    }

    // Return the user data in both cases
    return c.json({data: user ?? {}}, 201);
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return handleError(c, { message: 'Validation failed', errors: error.errors }, 400);
    }
    // Handle other errors
    return handleError(c, error);
  }
};


// Get user by id
export const getUserById = async (c: Context) => {
  try {
    // Validate the id parameter (UUID)
    const id = c.req.param('id');
    const validatedId = z.string().uuid().parse(id);

    // Fetch the user from the database
    const user = await prisma.user.findUnique({
      where: { id: validatedId },
    });

    // If the user does not exist, return a 404 error
    if (!user) {
      return handleError(c, { message: 'User not found' }, 404);
    }

    // Return the user data
    return c.json({ data: user ?? {} });
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return handleError(c, { message: 'Validation failed', errors: error.errors }, 400);
    }
    // Handle other errors
    return handleError(c, error);
  }
};