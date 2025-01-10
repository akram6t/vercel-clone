import React from 'react';
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { Divider } from "@nextui-org/divider";
import { Link } from "@nextui-org/link";
import { ExternalLink, Github, RefreshCcw } from 'lucide-react';
import ProjectTabsLayout from '@/layouts/project-tabs';

const ProjectOverview = () => {
    // Fake project data
    const project = {
        gitUrl: "https://github.com/username/my-project",
        subDomain: "my-project",
        customDomain: "www.my-project.com",
    };

    // Deployment details
    const deployment = {
        url: "next-opensource-projects-ulva-954fdgd4p-akram-khans-projects.vercel.app",
        domains: [
            "next-opensource-projects-ulva.vercel.app",
            "www.my-project.com"
        ],
        status: "Ready",
        created: "26/12/24",
        branch: "main",
    };

    const getDomainUrl = () => {
        return project.customDomain || `${project.subDomain}.yourdomain.com`;
    };

    // Truncate long URLs
    const truncateUrl = (url: string, maxLength: number = 30) => {
        return url.length > maxLength ? `${url.substring(0, maxLength)}...` : url;
    };

    return (
        <ProjectTabsLayout>
            {/* Replace Card with a div */}
            <div className="w-full bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                {/* CardHeader replacement */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">My Project</h2>
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
                            startContent={<Github size={18} />}
                        >
                            Repository
                        </Button>
                        <Button
                            variant="bordered"
                            startContent={<RefreshCcw size={18} />}
                        >
                        </Button>
                    </div>
                </div>

                {/* Divider */}
                <Divider />

                {/* CardBody replacement */}
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                        Deployment Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Deployment URL and Domains */}
                        <div className="space-y-4">
                            <div>
                                <span className="text-sm text-gray-500 dark:text-neutral-400">Deployment URL:</span>
                                <div className="flex items-center gap-2 mt-1">
                                    <Chip variant="flat">
                                        <Link href={`https://${deployment.url}`} target="_blank" className="text-sm text-neutral-900 dark:text-neutral-100">
                                            {truncateUrl(deployment.url)}
                                        </Link>
                                    </Chip>
                                    <Button
                                        as={Link}
                                        href={`https://${deployment.url}`}
                                        target="_blank"
                                        size="sm"
                                        variant="light"
                                        endContent={<ExternalLink size={14} />}
                                    >
                                        Go
                                    </Button>
                                </div>
                            </div>

                            <div>
                                <span className="text-sm text-gray-500 dark:text-neutral-400">Domains:</span>
                                <div className="flex flex-col gap-2 mt-1">
                                    {deployment.domains.map((domain, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <Chip variant="flat">
                                                <Link href={`https://${domain}`} target="_blank" className="text-sm text-neutral-900 dark:text-neutral-100">
                                                    {truncateUrl(domain)}
                                                </Link>
                                            </Chip>
                                            <Button
                                                as={Link}
                                                href={`https://${domain}`}
                                                target="_blank"
                                                size="sm"
                                                variant="light"
                                                endContent={<ExternalLink size={14} />}
                                            >
                                                Go
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Status, Created, and Source */}
                        <div className="space-y-4">
                            <div>
                                <span className="text-sm text-gray-500 dark:text-neutral-400">Status:</span>
                                <Chip className="ml-2" color="success" variant="flat">
                                    {deployment.status}
                                </Chip>
                            </div>

                            <div>
                                <span className="text-sm text-gray-500 dark:text-neutral-400">CreatedAt:</span>
                                <span className="ml-2 text-sm text-neutral-900 dark:text-neutral-100">
                                    {deployment.created}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500 dark:text-neutral-400">Branch:</span>
                                <div className="ml-2">
                                    <Chip variant="flat" className="text-sm text-neutral-900 dark:text-neutral-100">
                                        {deployment.branch}
                                    </Chip>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProjectTabsLayout>
    );
};

export default ProjectOverview;