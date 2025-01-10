import React, { useState } from 'react';
import { Button } from "@nextui-org/button";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/table";
import { Chip } from "@nextui-org/chip";
import { Link } from "@nextui-org/link";
import { Rocket, CheckCircle, XCircle, Loader } from 'lucide-react';
import { format } from 'date-fns'; // Import date-fns
import ProjectTabsLayout from '@/layouts/project-tabs';

export enum DeploymentStatus {
    NOT_STARTED = "NOT_STARTED",
    QUEUED = "QUEUED",
    IN_PROGRESS = "IN_PROGRESS",
    READY = "READY",
    FAIL = "FAIL",
}

interface Deployment {
    id: string;
    projectId: string;
    status: DeploymentStatus;
    createdAt: Date;
    updatedAt: Date;
}

interface DeploymentsProps {
    onDeploy: () => void;
}

const ProjectDeployments: React.FC<DeploymentsProps> = () => {
    const [deployments, setDeployments] = useState<Deployment[]>(deployments_data);
    const projectDomain = "my-project.yourdomain.com";

    const getStatusChip = (status: DeploymentStatus) => {
        const statusConfig = {
            [DeploymentStatus.NOT_STARTED]: { color: "default", icon: Loader, animate: true },
            [DeploymentStatus.QUEUED]: { color: "default", icon: Loader, animate: true },
            [DeploymentStatus.IN_PROGRESS]: { color: "warning", icon: Loader, animate: true },
            [DeploymentStatus.READY]: { color: "success", icon: CheckCircle, animate: false },
            [DeploymentStatus.FAIL]: { color: "danger", icon: XCircle, animate: false },
        };

        const config = statusConfig[status];
        const Icon = config.icon;

        return (
            <Chip
                startContent={
                    <Icon
                        size={14}
                        className={config.animate ? "animate-spin" : ""}
                    />
                }
                color={config.color as any}
                variant="flat"
            >
                {status}
            </Chip>
        );
    };

    const calculateDuration = (start: Date, end: Date) => {
        const diff = new Date(end).getTime() - new Date(start).getTime();
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        return `${minutes}m ${seconds}s`;
    };

    return (
        <ProjectTabsLayout>
            {/* Replace Card with a div */}
            <div className="w-full bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                {/* CardHeader replacement */}
                <div className="flex justify-between items-center p-6">
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Deployment History</h2>
                    <Button
                        color="primary"
                        startContent={<Rocket size={18} />}
                        onClick={() => console.log("Deploying...")}
                    >
                        Deploy Now
                    </Button>
                </div>

                {/* CardBody replacement */}
                <div className="p-6">
                    <Table aria-label="Deployments history">
                        <TableHeader>
                            <TableColumn>STATUS</TableColumn>
                            <TableColumn>DEPLOYMENT ID</TableColumn>
                            <TableColumn>DOMAIN</TableColumn>
                            <TableColumn>STARTED</TableColumn>
                            <TableColumn>DURATION</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {deployments.map((deployment) => (
                                <TableRow key={deployment.id}>
                                    <TableCell>{getStatusChip(deployment.status)}</TableCell>
                                    <TableCell>
                                        <span className="font-mono text-neutral-900 dark:text-neutral-100">
                                            {deployment.id.slice(0, 8)}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Link
                                            href={`https://${projectDomain}`}
                                            isExternal
                                            showAnchorIcon
                                            color="primary"
                                        >
                                            {projectDomain}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-neutral-900 dark:text-neutral-100">
                                        {format(new Date(deployment.createdAt), 'MM/dd/yyyy, h:mm:ss a')}
                                    </TableCell>
                                    <TableCell className="text-neutral-900 dark:text-neutral-100">
                                        {calculateDuration(deployment.createdAt, deployment.updatedAt)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </ProjectTabsLayout>
    );
};

export default ProjectDeployments;

const deployments_data = [
    {
        id: "deploy-123456",
        projectId: "project-123",
        status: DeploymentStatus.IN_PROGRESS,
        createdAt: new Date("2025-01-02T18:24:02Z"), // Fixed timestamp
        updatedAt: new Date("2025-01-02T18:24:02Z"), // Fixed timestamp
    },
    {
        id: "deploy-789012",
        projectId: "project-123",
        status: DeploymentStatus.READY,
        createdAt: new Date("2025-01-02T18:24:02Z"), // Fixed timestamp
        updatedAt: new Date("2025-01-02T18:24:02Z"), // Fixed timestamp
    },
    {
        id: "deploy-345678",
        projectId: "project-123",
        status: DeploymentStatus.FAIL,
        createdAt: new Date("2025-01-02T18:24:02Z"), // Fixed timestamp
        updatedAt: new Date("2025-01-02T18:24:02Z"), // Fixed timestamp
    },
];