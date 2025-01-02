import React from 'react';
import { Card } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Switch } from "@nextui-org/switch";
import ProjectTabsLayout from '@/layouts/project-tabs';

const ProjectSettings = () => (
    <ProjectTabsLayout>
        <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Project Settings</h2>
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold mb-4">General</h3>
                    <div className="space-y-4">
                        <Input
                            label="Project Name"
                            placeholder="Enter project name"
                            defaultValue="My Awesome Project"
                        />
                        <Input
                            label="Project URL"
                            placeholder="Enter project URL"
                            defaultValue="https://example.vercel.app"
                        />
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-4">Build & Development</h3>
                    <div className="space-y-4">
                        <Input
                            label="Build Command"
                            placeholder="npm run build"
                            defaultValue="npm run build"
                        />
                        <Input
                            label="Development Command"
                            placeholder="npm run dev"
                            defaultValue="npm run dev"
                        />
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-4">Advanced Settings</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-medium">Production Environment</p>
                                <p className="text-sm text-gray-600">Enable production mode</p>
                            </div>
                            <Switch defaultSelected />
                        </div>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-medium">Auto Deploy</p>
                                <p className="text-sm text-gray-600">Deploy automatically on push</p>
                            </div>
                            <Switch defaultSelected />
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    </ProjectTabsLayout>
);

export default ProjectSettings;