import React from 'react';
import DefaultLayout from './default';
import { Tab, Tabs } from '@nextui-org/tabs';
import { useRouter } from 'next/router';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const ProjectTabsLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const router = useRouter();
    const { project_slug } = router.query as { project_slug?: string };

    // Handle tab change
    const handleTabChange = (key: React.Key) => {
        // Navigate to the corresponding route
        router.push(`/dashboard/${project_slug}/${key}`);
    };

    return (
        <DefaultLayout>
            <header className='sticky top-14 z-50 overflow-x-scroll sm:overflow-x-hidden'>
                <Tabs
                    aria-label="Tabs project"
                    color="primary"
                    radius="full"
                    selectedKey={router.pathname.split('/').pop()} // Highlight the current tab
                    onSelectionChange={handleTabChange}
                >
                    <Tab key="overview" title="Overview" />
                    <Tab key="deployments" title="Deployments" />
                    <Tab key="analytics" title="Analytics" />
                    <Tab key="settings" title="Settings" />
                </Tabs>
            </header>
            <main className="mt-5">
                {children}
            </main>
        </DefaultLayout>
    );
};

export default ProjectTabsLayout;