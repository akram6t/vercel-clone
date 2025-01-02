import { Card } from '@nextui-org/card';
import { Button } from '@nextui-org/button';
import { Link } from '@nextui-org/link';
import { GithubIcon } from '@/components/icons';
import DefaultLayout from '@/layouts/default';

export default function DashboardPage() {
    const projects = [
        {
            id: "1",
            name: "E-Commerce Dashboard",
            slug: "ecommerce-dashboard",
            description: "A modern dashboard for managing online stores",
            demoUrl: "https://demo-ecommerce.example.com",
            githubUrl: "https://github.com/username/ecommerce-dashboard",
            technologies: ["React", "NextJS", "TailwindCSS"]
        },
        {
            id: "2",
            name: "Blog Platform",
            slug: "blog-platform",
            description: "A full-featured blogging platform with markdown support",
            demoUrl: "https://demo-blog.example.com",
            githubUrl: "https://github.com/username/blog-platform",
            technologies: ["NextJS", "PostgreSQL", "Prisma"]
        },
        {
            id: "3",
            name: "Task Manager",
            slug: "task-manager",
            description: "Collaborative task management application",
            demoUrl: "https://demo-tasks.example.com",
            githubUrl: "https://github.com/username/task-manager",
            technologies: ["React", "Firebase", "Material UI"]
        }
    ];

    return (
        <DefaultLayout>
            <div className="max-w-5xl mx-auto px-6 py-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold">Projects</h1>
                    <Button color="primary" size="lg">
                        Create New Project
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <Card
                            key={project.id}
                            className="p-6 hover:shadow-lg transition-all duration-300"
                        >
                            <div className="flex flex-col h-full">
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-xl font-semibold">{project.name}</h2>
                                    <Link
                                        isExternal
                                        href={project.githubUrl}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <GithubIcon size={24} />
                                    </Link>
                                </div>

                                <p className="text-gray-600 mb-4 flex-grow">
                                    {project.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.technologies.map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-600"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex gap-3 mt-auto">
                                    <Link
                                        href={`/dashboard/${project.slug}/overview`}
                                        className="flex-1"
                                    >
                                        <Button
                                            color="primary"
                                            variant="flat"
                                            className="w-full"
                                        >
                                            View Details
                                        </Button>
                                    </Link>
                                    <Link
                                        isExternal
                                        href={project.demoUrl}
                                        className="flex-1"
                                    >
                                        <Button
                                            color="secondary"
                                            variant="flat"
                                            className="w-full"
                                        >
                                            Live Demo
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </DefaultLayout>
    );
}