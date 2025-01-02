import React, { useState, useMemo } from 'react';
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/dropdown";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/table";
import { Progress } from "@nextui-org/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronDown, TrendingUp, TrendingDown, Clock, Users, AlertTriangle, Globe, Smartphone, Monitor } from 'lucide-react';
import ProjectTabsLayout from '@/layouts/project-tabs';

interface AnalyticsData {
    visits: number;
    loadTime: number;
    errorRate: number;
    trend: {
        visits: number;
        loadTime: number;
        errorRate: number;
    };
    chartData: {
        name: string;
        visits: number;
        loadTime: number;
        errors: number;
    }[];
}

interface TableData {
    country: string;
    device: string;
    browser: string;
    visits: number;
}

const ProjectAnalytics = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('30d');
    const [selectedTableFilter, setSelectedTableFilter] = useState('country');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // Simulate different data for different time periods
    const getAnalyticsData = (period: string): AnalyticsData => {
        const periods = {
            '24h': {
                visits: 1243,
                loadTime: 0.6,
                errorRate: 0.01,
                trend: { visits: 15.2, loadTime: -0.1, errorRate: -0.02 },
                chartData: Array.from({ length: 24 }, (_, i) => ({
                    name: `${i}:00`,
                    visits: Math.floor(Math.random() * 100) + 30,
                    loadTime: 0.5 + Math.random() * 0.5,
                    errors: Math.floor(Math.random() * 5),
                }))
            },
            '7d': {
                visits: 8456,
                loadTime: 0.7,
                errorRate: 0.015,
                trend: { visits: 12.8, loadTime: -0.15, errorRate: -0.01 },
                chartData: Array.from({ length: 7 }, (_, i) => ({
                    name: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
                    visits: Math.floor(Math.random() * 1500) + 500,
                    loadTime: 0.5 + Math.random() * 0.5,
                    errors: Math.floor(Math.random() * 20),
                }))
            },
            '30d': {
                visits: 12543,
                loadTime: 0.8,
                errorRate: 0.02,
                trend: { visits: 12.5, loadTime: -0.2, errorRate: -0.01 },
                chartData: Array.from({ length: 30 }, (_, i) => ({
                    name: `Day ${i + 1}`,
                    visits: Math.floor(Math.random() * 2000) + 800,
                    loadTime: 0.5 + Math.random() * 0.5,
                    errors: Math.floor(Math.random() * 30),
                }))
            },
            'last_month': {
                visits: 10000,
                loadTime: 0.9,
                errorRate: 0.03,
                trend: { visits: -5.0, loadTime: 0.1, errorRate: 0.01 },
                chartData: Array.from({ length: 30 }, (_, i) => ({
                    name: `Day ${i + 1}`,
                    visits: Math.floor(Math.random() * 1800) + 700,
                    loadTime: 0.6 + Math.random() * 0.4,
                    errors: Math.floor(Math.random() * 25),
                }))
            }
        };
        return periods[period as keyof typeof periods];
    };

    const currentData = useMemo(() => getAnalyticsData(selectedPeriod), [selectedPeriod]);

    const periodLabels = {
        '24h': 'Last 24 Hours',
        '7d': 'Last 7 Days',
        '30d': 'This Month',
        'last_month': 'Last Month'
    };

    // Simulate table data
    const tableData: TableData[] = [
        { country: 'United States', device: 'Mobile', browser: 'Chrome', visits: 1200 },
        { country: 'India', device: 'Desktop', browser: 'Firefox', visits: 800 },
        { country: 'Germany', device: 'Tablet', browser: 'Safari', visits: 600 },
        { country: 'United Kingdom', device: 'Mobile', browser: 'Edge', visits: 500 },
        { country: 'Canada', device: 'Desktop', browser: 'Chrome', visits: 400 },
    ];

    // Get the selected column label and icon
    const tableColumns = [
        {
            key: 'country',
            label: 'Country',
            icon: <Globe size={16} />
        },
        {
            key: 'device',
            label: 'Device',
            icon: <Smartphone size={16} />
        },
        {
            key: 'browser',
            label: 'Browser',
            icon: <Monitor size={16} />
        }
    ];

    const selectedColumn = tableColumns.find((col) => col.key === selectedTableFilter);

    // Sort table data by visits
    const sortedTableData = useMemo(() => {
        return [...tableData].sort((a, b) => {
            if (sortOrder === 'asc') {
                return a.visits - b.visits;
            } else {
                return b.visits - a.visits;
            }
        });
    }, [sortOrder]);

    // Calculate maximum visits for progress bar
    const maxVisits = useMemo(() => {
        return Math.max(...tableData.map((row) => row.visits));
    }, []);

    return (
        <ProjectTabsLayout>
            <Card className="w-full">
                <CardHeader className="flex justify-between items-center px-6 py-4">
                    <h2 className="text-2xl font-semibold">Analytics Dashboard</h2>
                    <Dropdown>
                        <DropdownTrigger>
                            <Button
                                variant="bordered"
                                endContent={<ChevronDown size={16} />}
                                startContent={<Clock size={16} />}
                            >
                                {periodLabels[selectedPeriod as keyof typeof periodLabels]}
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="Time period selection"
                            onAction={(key) => setSelectedPeriod(key as string)}
                        >
                            <DropdownItem key="24h">Last 24 Hours</DropdownItem>
                            <DropdownItem key="7d">Last 7 Days</DropdownItem>
                            <DropdownItem key="30d">This Month</DropdownItem>
                            <DropdownItem key="last_month">Last Month</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </CardHeader>

                <Divider />

                <CardBody className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card shadow="sm">
                            <CardBody className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Users size={20} className="text-primary" />
                                    <h3 className="text-sm text-gray-600">Total Visits</h3>
                                </div>
                                <p className="text-2xl font-bold">{currentData.visits.toLocaleString()}</p>
                                <div className="flex items-center mt-2">
                                    {currentData.trend.visits > 0 ? (
                                        <TrendingUp size={16} className="text-success mr-1" />
                                    ) : (
                                        <TrendingDown size={16} className="text-danger mr-1" />
                                    )}
                                    <span className={`text-sm ${currentData.trend.visits > 0 ? 'text-success' : 'text-danger'}`}>
                                        {Math.abs(currentData.trend.visits)}%
                                    </span>
                                </div>
                            </CardBody>
                        </Card>

                        <Card shadow="sm">
                            <CardBody className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Clock size={20} className="text-primary" />
                                    <h3 className="text-sm text-gray-600">Average Load Time</h3>
                                </div>
                                <p className="text-2xl font-bold">{currentData.loadTime}s</p>
                                <div className="flex items-center mt-2">
                                    {currentData.trend.loadTime < 0 ? (
                                        <TrendingDown size={16} className="text-success mr-1" />
                                    ) : (
                                        <TrendingUp size={16} className="text-danger mr-1" />
                                    )}
                                    <span className={`text-sm ${currentData.trend.loadTime < 0 ? 'text-success' : 'text-danger'}`}>
                                        {Math.abs(currentData.trend.loadTime)}s
                                    </span>
                                </div>
                            </CardBody>
                        </Card>

                        <Card shadow="sm">
                            <CardBody className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <AlertTriangle size={20} className="text-primary" />
                                    <h3 className="text-sm text-gray-600">Error Rate</h3>
                                </div>
                                <p className="text-2xl font-bold">{currentData.errorRate}%</p>
                                <div className="flex items-center mt-2">
                                    {currentData.trend.errorRate < 0 ? (
                                        <TrendingDown size={16} className="text-success mr-1" />
                                    ) : (
                                        <TrendingUp size={16} className="text-danger mr-1" />
                                    )}
                                    <span className={`text-sm ${currentData.trend.errorRate < 0 ? 'text-success' : 'text-danger'}`}>
                                        {Math.abs(currentData.trend.errorRate)}%
                                    </span>
                                </div>
                            </CardBody>
                        </Card>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">Detailed Analytics</h3>
                        <Dropdown>
                            <DropdownTrigger>
                                <Button
                                    variant="bordered"
                                    endContent={<ChevronDown size={16} />}
                                    startContent={selectedColumn?.icon}
                                >
                                    Filter by {selectedTableFilter}
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                aria-label="Table filter selection"
                                onAction={(key) => setSelectedTableFilter(key as string)}
                            >
                                <DropdownItem key="country" startContent={<Globe size={16} />}>Country</DropdownItem>
                                <DropdownItem key="device" startContent={<Smartphone size={16} />}>Device</DropdownItem>
                                <DropdownItem key="browser" startContent={<Monitor size={16} />}>Browser</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>

                    <Table aria-label="Detailed Analytics Table" className="mb-8">
                        <TableHeader>
                            <TableColumn>
                                <div className="flex items-center gap-2">
                                    {selectedColumn?.icon}
                                    {selectedColumn?.label}
                                </div>
                            </TableColumn>
                            <TableColumn>
                                <div className="flex items-center gap-2">
                                    <Users size={16} />
                                    Visits
                                    <Button
                                        size="sm"
                                        variant="light"
                                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                    >
                                        {sortOrder === 'asc' ? '↑' : '↓'}
                                    </Button>
                                </div>
                            </TableColumn>
                        </TableHeader>
                        <TableBody>
                            {sortedTableData.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{row[selectedTableFilter as keyof TableData]}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Progress
                                                value={(row.visits / maxVisits) * 100}
                                                color="primary"
                                                className="w-full"
                                            />
                                            <span>{row.visits}</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <Card className="w-full h-[400px] p-4">
                        <CardHeader>
                            <h3 className="text-lg font-semibold">Traffic Overview</h3>
                        </CardHeader>
                        <CardBody>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={currentData.chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="visits"
                                        stroke="#06b6d4"
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="loadTime"
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="errors"
                                        stroke="#ef4444"
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardBody>
                    </Card>
                </CardBody>
            </Card>
        </ProjectTabsLayout>
    );
};

export default ProjectAnalytics;