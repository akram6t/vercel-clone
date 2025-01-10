import { z } from 'zod';

// Deployment Schemas
const CreateDeploymentInputSchema = z.object({
    projectId: z.string().uuid({ message: 'projectId must be a valid UUID' }),
    branch: z.string().min(1, { message: 'branch is required' }),
});

const DeploymentResponseSchema = z.object({
    id: z.string().uuid(),
    projectId: z.string().uuid(),
    // branch: z.string(),
    // status: z.enum(['NOT_STARTED', 'QUEUED', 'IN_PROGRESS', 'READY', 'FAIL']),
    // createdAt: z.date(),
    // updatedAt: z.date(),
});

// Project Schemas
const CreateProjectInputSchema = z.object({
    userId: z.string().uuid({ message: 'userId must be a valid UUID' }),
    gitUrl: z.string().regex(
        /^https:\/\/([\w\.\-~]+)(\/[\w\.\-~]+)*(\.git)?(\/)?$/,
        {
            message: 'gitUrl must be a valid Git URL',
        }
    ),
    subDomain: z.string().min(1, { message: 'subDomain is required' }),
    customDomain: z.string().url({ message: 'customDomain must be a valid URL' }).optional(),
});

const UpdateProjectInputSchema = z.object({
    gitUrl: z
        .string({ message: 'please provide git url' })
        .regex(
            /^https:\/\/([\w\.\-~]+)(\/[\w\.\-~]+)*(\.git)?(\/)?$/,
            {
                message: 'gitUrl must be a valid Git URL',
            }
        )
        .optional(),
    subDomain: z.string().min(1, { message: 'subDomain is required' }).optional(),
    customDomain: z
        .string({ message: 'customDomain is required' })
        .url({ message: 'provider valid git url' })
        .optional()
});

const ProjectResponseSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    gitUrl: z.string().url(),
    subDomain: z.string(),
    customDomain: z.string().url().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

// User Schemas
const GithubSignInInputSchema = z.object({
    email: z.string().email({ message: 'email must be a valid email address' }),
    name: z.string().min(1, { message: 'name is required' }),
    avatar: z.string().url({ message: 'avatar must be a valid URL' }).optional(),
    githubId: z.string().min(1, { message: 'githubId is required' }),
    githubUsername: z.string().min(1, { message: 'githubUsername is required' }),
    accessToken: z.string().min(1, { message: 'accessToken is required' }),
});

const UserResponseSchema = z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    name: z.string(),
    avatar: z.string().url().nullable(),
    githubId: z.string(),
    githubUsername: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

// Log Schemas
const AddLogInputSchema = z.object({
    projectId: z.string().uuid({ message: 'projectId must be a valid UUID' }),
    deploymentId: z.string().uuid({ message: 'deploymentId must be a valid UUID' }),
    log: z.string().min(1, { message: 'log is required' }),
});

const LogResponseSchema = z.object({
    projectId: z.string().uuid(),
    deploymentId: z.string().uuid(),
    log: z.string(),
    timestamp: z.date(),
});

// Analytics Schemas
const AnalyticsFilterSchema = z.object({
    state: z.string().optional(),
    country: z.string().optional(),
    device: z.string().optional(),
    browser: z.string().optional(),
    dateRange: z.enum(['24h', 'this_month', 'last_month']).optional(),
});

const AnalyticsResponseSchema = z.object({
    totalVisitors: z.number(),
    uniqueVisitors: z.number(),
    bandwidth: z.number(),
    avgLoadTime: z.number(),
    errorRate: z.number(),
});

// Export all schemas
export const schemas = {
    CreateDeploymentInputSchema,
    DeploymentResponseSchema,
    CreateProjectInputSchema,
    UpdateProjectInputSchema,
    ProjectResponseSchema,
    GithubSignInInputSchema,
    UserResponseSchema,
    AddLogInputSchema,
    LogResponseSchema,
    AnalyticsFilterSchema,
    AnalyticsResponseSchema,
};