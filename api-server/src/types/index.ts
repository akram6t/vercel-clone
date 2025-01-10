import type { DeploymentStatus } from "@prisma/client";


// Deployment Types
// export type CreateDeploymentInput = {
//     projectId: string;
//     branch: string;
// };

// export type DeploymentResponse = {
//     id: string;
//     projectId: string;
//     branch: string;
//     status: DeploymentStatus;
//     createdAt: Date;
//     updatedAt: Date;
// };

// // Project Types
// export type CreateProjectInput = {
//     userId: string;
//     gitUrl: string;
//     subDomain: string;
//     customDomain?: string;
// };

// export type UpdateProjectInput = {
//     gitUrl?: string;
//     subDomain?: string;
//     customDomain?: string;
// };

// export type ProjectResponse = {
//     id: string;
//     userId: string;
//     gitUrl: string;
//     subDomain: string;
//     customDomain: string | null;
//     createdAt: Date;
//     updatedAt: Date;
// };

// User Types
// export type GithubSignInInput = {
//     email: string;
//     name: string;
//     avatar?: string;
//     githubId: string;
//     githubUsername: string;
//     accessToken: string;
// };

// export type UserResponse = {
//     id: string;
//     email: string;
//     name: string;
//     avatar: string | null;
//     githubId: string;
//     githubUsername: string;
//     createdAt: Date;
//     updatedAt: Date;
// };

// Log Types
// export type AddLogInput = {
//     deploymentId: string;
//     log: string;
// };

export type LogResponse = {
    deploymentId: string;
    log: string;
    is_error: number | boolean;
    created_at: Date;
};

// Analytics Types
export type AnalyticsFilter = {
    state?: string;
    country?: string;
    device?: string;
    browser?: string;
    dateRange?: '24h' | 'this_month' | 'last_month';
};

export type AnalyticsResponse = {
    totalVisitors: number;
    uniqueVisitors: number;
    bandwidth: number;
    avgLoadTime: number;
    errorRate: number;
};