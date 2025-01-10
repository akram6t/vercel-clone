import type { Context } from 'hono';

export const handleError = (c: Context, error: any, statusCode: 400 | 404 | 500 = 500) => {
    console.error(error);
    // 400 is validation error
    return c.json({ error: error.message }, statusCode);
};