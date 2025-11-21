import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Separator } from '@radix-ui/react-separator';
import {
    ArrowLeft,
    Calendar,
    CheckCircle2,
    Clock,
    DollarSign,
    User,
    Users,
} from 'lucide-react';

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

interface ShowProps {
    project: Project;
}

export default function Show({ project }: ShowProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const completionPercentage =
        project.total_tasks > 0
            ? (project.completed_tasks / project.total_tasks) * 100
            : 0;

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <AppLayout>
            <Head title={project.name} />

            <div className="min-h-screen bg-background">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <Link
                            href="/projects"
                            className="mb-4 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to projects
                        </Link>

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <h1 className="text-4xl font-bold tracking-tight text-balance">
                                    {project.name}
                                </h1>
                                <p className="mt-2 text-muted-foreground">
                                    Created on {formatDate(project.created_at)}
                                </p>
                            </div>
                            <Badge
                                variant="secondary"
                                className="w-fit text-lg"
                            >
                                {formatCurrency(project.price)}
                            </Badge>
                        </div>
                    </div>

                    {/* Main Grid */}
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Left Column - Main Info */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Description Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Project Description</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="leading-relaxed text-muted-foreground">
                                        {project.description ||
                                            'No description provided.'}
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Timeline Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5" />
                                        Project Timeline
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Clock className="h-4 w-4" />
                                                    Start Date
                                                </div>
                                                <p className="text-lg font-semibold">
                                                    {formatDate(
                                                        project.start_date,
                                                    )}
                                                </p>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Clock className="h-4 w-4" />
                                                    End Date
                                                </div>
                                                <p className="text-lg font-semibold">
                                                    {formatDate(
                                                        project.end_date,
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <Separator />

                                        {/* Progress Section */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium">
                                                    Task Completion
                                                </span>
                                                <span className="text-sm text-muted-foreground">
                                                    {project.completed_tasks} of{' '}
                                                    {project.total_tasks} tasks
                                                </span>
                                            </div>
                                            <Progress
                                                value={completionPercentage}
                                                className="h-2"
                                            />
                                            <p className="text-right text-xs text-muted-foreground">
                                                {completionPercentage.toFixed(
                                                    1,
                                                )}
                                                % Complete
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Completed Tasks Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CheckCircle2 className="h-5 w-5" />
                                        Completed Tasks
                                    </CardTitle>
                                    <CardDescription>
                                        {project.completed_tasks} tasks have
                                        been completed
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-center rounded-lg border-2 border-dashed p-12">
                                        <div className="text-center">
                                            <CheckCircle2 className="mx-auto h-12 w-12 text-muted-foreground" />
                                            <p className="mt-4 text-sm text-muted-foreground">
                                                Task details would be displayed
                                                here
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column - Team Info */}
                        <div className="space-y-6">
                            {/* Project Leader Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        Project Leader
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-14 w-14">
                                            <AvatarImage
                                                src="/placeholder-user.jpg"
                                                alt={project.leader.name}
                                            />
                                            <AvatarFallback className="text-lg">
                                                {getInitials(
                                                    project.leader.name,
                                                )}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <p className="font-semibold">
                                                {project.leader.name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {project.leader.email}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Team Members Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="h-5 w-5" />
                                        Team Members
                                    </CardTitle>
                                    <CardDescription>
                                        {project.members.length} member
                                        {project.members.length !== 1
                                            ? 's'
                                            : ''}{' '}
                                        assigned
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {project.members.length > 0 ? (
                                            project.members.map((member) => (
                                                <div
                                                    key={member.id}
                                                    className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                                                >
                                                    <Avatar>
                                                        <AvatarImage
                                                            src="/placeholder-user.jpg"
                                                            alt={member.name}
                                                        />
                                                        <AvatarFallback>
                                                            {getInitials(
                                                                member.name,
                                                            )}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 overflow-hidden">
                                                        <p className="truncate font-medium">
                                                            {member.name}
                                                        </p>
                                                        <p className="truncate text-sm text-muted-foreground">
                                                            {member.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="rounded-lg border-2 border-dashed p-8 text-center">
                                                <Users className="mx-auto h-8 w-8 text-muted-foreground" />
                                                <p className="mt-2 text-sm text-muted-foreground">
                                                    No team members assigned yet
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Budget Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <DollarSign className="h-5 w-5" />
                                        Project Budget
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center">
                                        <p className="text-4xl font-bold tracking-tight">
                                            {formatCurrency(project.price)}
                                        </p>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            Total project value
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
