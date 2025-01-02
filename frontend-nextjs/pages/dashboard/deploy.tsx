import React, { useState } from 'react';
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/dropdown";
import {
    ChevronDown,
    Github,
    GitBranch,
    FolderOpen,
    Terminal,
    Settings,
    Plus,
    Trash2
} from "lucide-react";
import DefaultLayout from '@/layouts/default';

const DeployPage = () => {
    const [environmentVars, setEnvironmentVars] = useState([
        { key: 'EXAMPLE_NAME', value: 'I9JU23NF394R6HH' }
    ]);

    const addEnvironmentVar = () => {
        setEnvironmentVars([...environmentVars, { key: '', value: '' }]);
    };

    const removeEnvironmentVar = (index: number) => {
        setEnvironmentVars(environmentVars.filter((_, i) => i !== index));
    };

    return (
        <DefaultLayout>
            <div className="p-6">
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <Github size={18} />
                        <span>Importing from GitHub</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Github size={20} />
                        <span className="font-medium">akram6t/vercel-clone</span>
                        <GitBranch size={16} className="ml-2" />
                        <span className="text-sm text-gray-500">main</span>
                    </div>
                </div>

                <Card className="mb-6">
                    <CardHeader>
                        <h2 className="text-lg font-medium">Configure Project</h2>
                    </CardHeader>
                    <CardBody className="space-y-6">
                        <div className="space-y-4">

                            <div>
                                <label className="block text-sm mb-2">Framework Preset</label>
                                <Dropdown>
                                    <DropdownTrigger>
                                        <Button
                                            variant="bordered"
                                            endContent={<ChevronDown size={16} />}
                                            className="w-full justify-between"
                                        >
                                            Other
                                        </Button>
                                    </DropdownTrigger>
                                    <DropdownMenu aria-label="Framework selection">
                                        <DropdownItem key="next">Next.js</DropdownItem>
                                        <DropdownItem key="react">Create React App</DropdownItem>
                                        <DropdownItem key="other">Other</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                                <p className="text-sm text-gray-500 mt-1">
                                    Select the framework preset for your project. This helps optimize the build process.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm mb-2">Root Directory</label>
                                <Input
                                    defaultValue="./"
                                    variant="bordered"
                                    endContent={<Button size="sm">Edit</Button>}
                                    description="The root directory of your project. This is where the build process will start."
                                />
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <Card className="mb-6">
                    <CardHeader className="flex gap-2">
                        <Settings size={18} />
                        <h2 className="text-lg font-medium">Build and Output Settings</h2>
                    </CardHeader>
                    <CardBody className="space-y-6">
                        <div>
                            <label className="block text-sm mb-2">
                                <div className="flex items-center gap-2">
                                    <Terminal size={16} />
                                    Build Command
                                </div>
                            </label>
                            <Input
                                defaultValue="npm run vercel-build or npm run build"
                                variant="bordered"
                                description="The command used to build your project. Leave blank if no build step is required."
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-2">
                                <div className="flex items-center gap-2">
                                    <FolderOpen size={16} />
                                    Output Directory
                                </div>
                            </label>
                            <Input
                                defaultValue="public (if it exists), or ."
                                variant="bordered"
                                description="The directory where the build output will be stored. Defaults to 'public' or the root directory."
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-2">Install Command</label>
                            <Input
                                defaultValue="yarn install, pnpm install, npm install, or bun install"
                                variant="bordered"
                                description="The command used to install dependencies. Defaults to 'npm install'."
                            />
                        </div>
                    </CardBody>
                </Card>

                <Card className="mb-6">
                    <CardHeader>
                        <h2 className="text-lg font-medium">Environment Variables</h2>
                    </CardHeader>
                    <CardBody>
                        <div className="space-y-4">
                            {environmentVars.map((env, index) => (
                                <div key={index} className="flex gap-4">
                                    <Input
                                        label="Key"
                                        placeholder="KEY"
                                        defaultValue={env.key}
                                        variant="bordered"
                                        description="The name of the environment variable (e.g., API_KEY)."
                                    />
                                    <Input
                                        label="Value"
                                        placeholder="VALUE"
                                        defaultValue={env.value}
                                        variant="bordered"
                                        description="The value of the environment variable (e.g., 12345)."
                                    />
                                    <Button
                                        isIconOnly
                                        color="danger"
                                        variant="light"
                                        onClick={() => removeEnvironmentVar(index)}
                                        className="mt-7"
                                    >
                                        <Trash2 size={18} />
                                    </Button>
                                </div>
                            ))}
                            <Button
                                variant="light"
                                startContent={<Plus size={16} />}
                                onClick={addEnvironmentVar}
                            >
                                Add More
                            </Button>
                            <p className="text-sm text-gray-500">
                                Add environment variables required for your project. These will be available during the build and runtime.
                            </p>
                        </div>
                    </CardBody>
                </Card>

                <div className="flex justify-end">
                    <Button color="primary" size="lg">
                        Deploy
                    </Button>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default DeployPage;