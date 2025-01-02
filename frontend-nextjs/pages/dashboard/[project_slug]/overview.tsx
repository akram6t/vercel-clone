import React from 'react';
import { Progress } from "@nextui-org/progress";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Chip } from "@nextui-org/chip";
import { Divider } from "@nextui-org/divider";
import { Link } from "@nextui-org/link";
import {
    Github as GitHubIcon,
    Star,
    GitFork,
    Eye,
    ExternalLink
} from 'lucide-react';
import { format } from 'date-fns'; // Import date-fns
import ProjectTabsLayout from '@/layouts/project-tabs';

const ProjectOverview = () => {
    // Fake project data
    const project = {
        id: "proj_123",
        gitUrl: "https://github.com/username/my-project",
        subDomain: "my-project",
        customDomain: "www.my-project.com",
        deployments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    // Fake GitHub data
    const gitHubData = {
        name: "my-project",
        description: "A modern web application built with Next.js and deployed automatically",
        stars: 123,
        forks: 45,
        watchers: 67,
        defaultBranch: "main",
        language: "TypeScript",
    };

    const getDomainUrl = () => {
        return project.customDomain || `${project.subDomain}.yourdomain.com`;
    };

    // Format dates using date-fns
    const lastUpdated = format(new Date(project.updatedAt), 'MM/dd/yyyy');
    const createdAt = format(new Date(project.createdAt), 'MM/dd/yyyy');

    return (
        <ProjectTabsLayout>
            <Card className="w-full">
                <CardHeader className="flex justify-between items-start">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold">{gitHubData.name}</h2>
                        <p className="text-gray-500 mt-1">{gitHubData.description}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            as={Link}
                            href={`https://${getDomainUrl()}`}
                            target="_blank"
                            variant="flat"
                            startContent={<ExternalLink size={18} />}
                        >
                            Visit Site
                        </Button>
                        <Button
                            as={Link}
                            href={project.gitUrl}
                            target="_blank"
                            variant="bordered"
                            startContent={<GitHubIcon size={18} />}
                        >
                            Repository
                        </Button>
                    </div>
                </CardHeader>

                <Divider />

                <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Repository Info</h3>
                                <div className="flex gap-4">
                                    <Chip
                                        variant="flat"
                                        startContent={<Star size={16} />}
                                    >
                                        {gitHubData.stars} stars
                                    </Chip>
                                    <Chip
                                        variant="flat"
                                        startContent={<GitFork size={16} />}
                                    >
                                        {gitHubData.forks} forks
                                    </Chip>
                                    <Chip
                                        variant="flat"
                                        startContent={<Eye size={16} />}
                                    >
                                        {gitHubData.watchers} watching
                                    </Chip>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-3">Domain Configuration</h3>
                                <div className="space-y-2">
                                    <div>
                                        <span className="text-sm text-gray-500">Primary Domain:</span>
                                        <Chip className="ml-2" variant="flat">{getDomainUrl()}</Chip>
                                    </div>
                                    {project.customDomain && (
                                        <div>
                                            <span className="text-sm text-gray-500">Custom Domain:</span>
                                            <Chip className="ml-2" variant="flat">{project.customDomain}</Chip>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Project Status</h3>
                                <Progress
                                    value={75}
                                    color="success"
                                    className="mb-2"
                                    size="md"
                                />
                                <div className="flex justify-between mt-2">
                                    <span className="text-sm text-gray-500">
                                        Last updated: {lastUpdated}
                                    </span>
                                    <Chip size="sm" variant="flat">{gitHubData.language}</Chip>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
                                <div className="space-y-2">
                                    <div>
                                        <span className="text-sm text-gray-500">Default Branch:</span>
                                        <Chip className="ml-2" size="sm">{gitHubData.defaultBranch}</Chip>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">Created:</span>
                                        <span className="ml-2">
                                            {createdAt}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </ProjectTabsLayout>
    );
};

export default ProjectOverview;