import React from 'react';
import { Input } from "@nextui-org/input";
import { Switch } from "@nextui-org/switch";
import ProjectTabsLayout from '@/layouts/project-tabs';

const ProjectSettings = () => (
    <ProjectTabsLayout>
        {/* Replace Card with a div */}
        <div className="w-full bg-neutral-50 dark:bg-neutral-950 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">Project Settings</h2>
            <div className="space-y-6">
                {/* General Settings */}
                <div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">General</h3>
                    <div className="space-y-4">
                        <Input
                            label="Project Name"
                            placeholder="Enter project name"
                            defaultValue="My Awesome Project"
                            className="text-neutral-900 dark:text-neutral-100"
                        />
                        <Input
                            label="Project URL"
                            placeholder="Enter project URL"
                            defaultValue="https://example.vercel.app"
                            className="text-neutral-900 dark:text-neutral-100"
                        />
                    </div>
                </div>

                {/* Build & Development Settings */}
                <div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Build & Development</h3>
                    <div className="space-y-4">
                        <Input
                            label="Build Command"
                            placeholder="npm run build"
                            defaultValue="npm run build"
                            className="text-neutral-900 dark:text-neutral-100"
                        />
                        <Input
                            label="Development Command"
                            placeholder="npm run dev"
                            defaultValue="npm run dev"
                            className="text-neutral-900 dark:text-neutral-100"
                        />
                    </div>
                </div>

                {/* Advanced Settings */}
                <div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Advanced Settings</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-medium text-neutral-900 dark:text-neutral-100">Production Environment</p>
                                <p className="text-sm text-gray-600 dark:text-neutral-400">Enable production mode</p>
                            </div>
                            <Switch defaultSelected />
                        </div>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-medium text-neutral-900 dark:text-neutral-100">Auto Deploy</p>
                                <p className="text-sm text-gray-600 dark:text-neutral-400">Deploy automatically on push</p>
                            </div>
                            <Switch defaultSelected />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </ProjectTabsLayout>
);

export default ProjectSettings;