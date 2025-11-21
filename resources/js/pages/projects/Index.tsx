'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import {
    Briefcase,
    Calendar,
    Clock,
    Crown,
    DollarSign,
    Plus,
    TrendingUp,
    Users,
} from 'lucide-react';
import { useState } from 'react';

interface Project {
    id: number;
    name: string;
    description: string;
    price: number;
    start_date: string;
    end_date: string;
    completed_tasks: number;
    total_tasks: number;
    leader: {
        id: number;
        name: string;
        email: string;
    };
    members: {
        id: number;
        name: string;
        email: string;
    }[];
    created_at: string;
}

interface IndexProps {
    projects: Project[];
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
}

export default function Index({ projects, auth }: IndexProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const calculateProgress = (completed: number, total: number) => {
        if (total === 0) return 0;
        return (completed / total) * 100;
    };

    const calculateDaysRemaining = (endDate: string) => {
        const today = new Date();
        const end = new Date(endDate);
        const diffTime = end.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const filteredProjects = projects.filter((project) =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const leadingProjects = filteredProjects.filter(
        (project) => project.leader.id === auth.user.id,
    );
    const memberProjects = filteredProjects.filter(
        (project) =>
            project.leader.id !== auth.user.id &&
            project.members.some((member) => member.id === auth.user.id),
    );

    const ProjectCard = ({ project }: { project: Project }) => {
        const progress = calculateProgress(
            project.completed_tasks,
            project.total_tasks,
        );
        const daysRemaining = calculateDaysRemaining(project.end_date);
        const isLeader = project.leader.id === auth.user.id;

        return (
            <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="group h-full transition-all hover:border-primary/50 hover:shadow-lg">
                    <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex min-w-0 flex-1 items-center gap-2">
                                {isLeader && (
                                    <Crown className="h-4 w-4 shrink-0 text-primary" />
                                )}
                                <CardTitle className="line-clamp-1 text-xl transition-colors group-hover:text-primary">
                                    {project.name}
                                </CardTitle>
                            </div>
                            <Badge variant="secondary" className="shrink-0">
                                {formatCurrency(project.price)}
                            </Badge>
                        </div>
                        <CardDescription className="line-clamp-2 min-h-[2.5rem]">
                            {project.description || 'No description provided'}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {/* Progress */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                    Progress
                                </span>
                                <span className="font-medium">
                                    {progress.toFixed(0)}%
                                </span>
                            </div>
                            <Progress value={progress} className="h-2" />
                            <p className="text-xs text-muted-foreground">
                                {project.completed_tasks} of{' '}
                                {project.total_tasks} tasks completed
                            </p>
                        </div>

                        {/* Timeline */}
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(project.start_date)}</span>
                            </div>
                            <span className="text-muted-foreground">→</span>
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                <span>{formatDate(project.end_date)}</span>
                            </div>
                        </div>

                        {daysRemaining >= 0 && (
                            <div className="flex items-center gap-1.5 text-sm">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">
                                    {daysRemaining === 0
                                        ? 'Due today'
                                        : daysRemaining === 1
                                          ? '1 day remaining'
                                          : `${daysRemaining} days remaining`}
                                </span>
                            </div>
                        )}

                        {/* Team */}
                        <div className="pt-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">
                                        {project.members.length} member
                                        {project.members.length !== 1
                                            ? 's'
                                            : ''}
                                    </span>
                                </div>
                                <div className="flex -space-x-2">
                                    {project.members
                                        .slice(0, 3)
                                        .map((member) => (
                                            <Avatar
                                                key={member.id}
                                                className="h-8 w-8 border-2 border-background"
                                            >
                                                <AvatarImage
                                                    src="/placeholder-user.jpg"
                                                    alt={member.name}
                                                />
                                                <AvatarFallback className="text-xs">
                                                    {getInitials(member.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                        ))}
                                    {project.members.length > 3 && (
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                                            +{project.members.length - 3}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="text-xs text-muted-foreground">
                        {isLeader
                            ? 'You are leading this project'
                            : `Led by ${project.leader.name}`}
                    </CardFooter>
                </Card>
            </Link>
        );
    };

    return (
        <AppLayout>
            <Head title="Projects" />

            <div className="min-h-screen bg-background">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-4xl font-bold tracking-tight text-balance">
                                    Projects
                                </h1>
                                <p className="mt-2 text-muted-foreground">
                                    Manage and track all your projects in one
                                    place
                                </p>
                            </div>
                            <Link href="/projects/create">
                                <Button size="lg" className="w-full sm:w-auto">
                                    <Plus className="mr-2 h-5 w-5" />
                                    Create Project
                                </Button>
                            </Link>
                        </div>

                        {/* Search Bar */}
                        <div className="mt-6">
                            <Input
                                placeholder="Search projects..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="max-w-md"
                            />
                        </div>
                    </div>

                    {/* Stats Overview */}
                    <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Projects
                                </CardTitle>
                                <Briefcase className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {projects.length}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Budget
                                </CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {formatCurrency(
                                        projects.reduce(
                                            (sum, p) => sum + p.price,
                                            0,
                                        ),
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Team Members
                                </CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {projects.reduce(
                                        (sum, p) => sum + p.members.length,
                                        0,
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Avg. Progress
                                </CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {projects.length > 0
                                        ? Math.round(
                                              projects.reduce(
                                                  (sum, p) =>
                                                      sum +
                                                      calculateProgress(
                                                          p.completed_tasks,
                                                          p.total_tasks,
                                                      ),
                                                  0,
                                              ) / projects.length,
                                          )
                                        : 0}
                                    %
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {filteredProjects.length === 0 ? (
                        <Card className="p-12">
                            <div className="flex flex-col items-center justify-center text-center">
                                <Briefcase className="h-16 w-16 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-semibold">
                                    No projects found
                                </h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    {searchQuery
                                        ? 'Try adjusting your search query'
                                        : 'Get started by creating your first project'}
                                </p>
                                {!searchQuery && (
                                    <Link
                                        href="/projects/create"
                                        className="mt-4"
                                    >
                                        <Button>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Create Project
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </Card>
                    ) : (
                        <div className="space-y-12">
                            {/* Leading Projects Section */}
                            {leadingProjects.length > 0 && (
                                <section>
                                    <div className="mb-6 flex items-center gap-3">
                                        <Crown className="h-6 w-6 text-primary" />
                                        <div>
                                            <h2 className="text-2xl font-bold tracking-tight">
                                                Projects You Lead
                                            </h2>
                                            <p className="text-sm text-muted-foreground">
                                                {leadingProjects.length} project
                                                {leadingProjects.length !== 1
                                                    ? 's'
                                                    : ''}{' '}
                                                where you are the leader
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                        {leadingProjects.map((project) => (
                                            <ProjectCard
                                                key={project.id}
                                                project={project}
                                            />
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Member Projects Section */}
                            {memberProjects.length > 0 && (
                                <section>
                                    <div className="mb-6 flex items-center gap-3">
                                        <Users className="h-6 w-6 text-primary" />
                                        <div>
                                            <h2 className="text-2xl font-bold tracking-tight">
                                                Projects You're Part Of
                                            </h2>
                                            <p className="text-sm text-muted-foreground">
                                                {memberProjects.length} project
                                                {memberProjects.length !== 1
                                                    ? 's'
                                                    : ''}{' '}
                                                where you are a team member
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                        {memberProjects.map((project) => (
                                            <ProjectCard
                                                key={project.id}
                                                project={project}
                                            />
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
