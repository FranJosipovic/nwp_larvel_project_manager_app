import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Separator } from '@radix-ui/react-separator';
import {
    ArrowLeft,
    Calendar,
    CheckCircle2,
    Circle,
    Clock,
    DollarSign,
    ListTodo,
    Plus,
    SquarePen,
    Trash2,
    User,
    Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ProjectEditDialog } from './components/project-edit-dialog';

interface Task {
    id: number;
    title: string;
    description: string;
    status: 'created' | 'completed';
    created_at: string;
    user_id: number;
    user?: {
        id: number;
        name: string;
        email: string;
    };
}

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
    tasks?: Task[];
    created_at: string;
}

interface ShowProps {
    project: Project;
    currentUserId: number;
    availableUsers?: {
        id: number;
        name: string;
        email: string;
    }[];
}

interface PageProps {
    [key: string]: any;
}

export default function Show({
    project,
    currentUserId,
    availableUsers = [],
}: ShowProps) {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

    const { flash } = usePage<PageProps>().props;

    useEffect(() => {
        if (flash.success) toast.success(flash.success);
        if (flash.error) toast.error(flash.error);
    }, [flash]);

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

    const taskForm = useForm({
        title: '',
        description: '',
        project_id: project.id,
        status: 'created',
        user_id: currentUserId,
    });

    const handleAddTask = () => {
        taskForm.post(`/tasks`, {
            onSuccess: () => {
                setIsAddTaskOpen(false);
                taskForm.reset();
            },
        });
    };

    const handleToggleTaskStatus = (task: Task) => {
        const newStatus = task.status === 'created' ? 'completed' : 'created';

        taskForm.data.description = task.description;
        taskForm.data.status = newStatus;
        taskForm.data.title = task.title;

        taskForm.put(`/tasks/${task.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                taskForm.setData({
                    title: '',
                    description: '',
                    status: 'created',
                });
            },
        });
    };

    const form = useForm({});

    const handleDeleteTask = (taskId: number) => {
        form.delete(`/tasks/${taskId}`, {
            preserveScroll: true,
        });
    };

    const isLeader = currentUserId === project.leader.id;
    const isMember =
        project.members.some((m) => m.id === currentUserId) || isLeader;

    return (
        <AppLayout>
            <Head title={project.name} />

            <div className="min-h-screen bg-background">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="mb-4 flex items-center gap-2">
                            <Link
                                href="/projects"
                                className="inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to projects
                            </Link>

                            {isLeader && (
                                <ProjectEditDialog
                                    project={project}
                                    availableUsers={availableUsers}
                                    open={isEditDialogOpen}
                                    onOpenChange={setIsEditDialogOpen}
                                    trigger={
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="ml-auto gap-2"
                                        >
                                            <SquarePen className="h-4 w-4" />
                                            Edit Project
                                        </Button>
                                    }
                                />
                            )}
                        </div>

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
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="flex items-center gap-2">
                                                <ListTodo className="h-5 w-5" />
                                                Project Tasks
                                            </CardTitle>
                                            <CardDescription>
                                                {project.tasks?.length || 0}{' '}
                                                task
                                                {project.tasks?.length !== 1
                                                    ? 's'
                                                    : ''}{' '}
                                                created
                                            </CardDescription>
                                        </div>
                                        {isMember && (
                                            <Dialog
                                                open={isAddTaskOpen}
                                                onOpenChange={setIsAddTaskOpen}
                                            >
                                                <DialogTrigger asChild>
                                                    <Button
                                                        size="sm"
                                                        className="gap-2"
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                        Add Task
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>
                                                            Add New Task
                                                        </DialogTitle>
                                                        <DialogDescription>
                                                            Create a new task
                                                            for this project
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="space-y-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="task-title">
                                                                Task Title
                                                            </Label>
                                                            <Input
                                                                id="task-title"
                                                                placeholder="Enter task title..."
                                                                value={
                                                                    taskForm
                                                                        .data
                                                                        .title
                                                                }
                                                                onChange={(e) =>
                                                                    taskForm.setData(
                                                                        'title',
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="task-description">
                                                                Description
                                                            </Label>
                                                            <Textarea
                                                                id="task-description"
                                                                placeholder="Enter task description..."
                                                                rows={4}
                                                                value={
                                                                    taskForm
                                                                        .data
                                                                        .description
                                                                }
                                                                onChange={(e) =>
                                                                    taskForm.setData(
                                                                        'description',
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-end gap-2 pt-4">
                                                        <Button
                                                            variant="outline"
                                                            onClick={() =>
                                                                setIsAddTaskOpen(
                                                                    false,
                                                                )
                                                            }
                                                        >
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            onClick={
                                                                handleAddTask
                                                            }
                                                            disabled={
                                                                taskForm.processing ||
                                                                !taskForm.data
                                                                    .title
                                                            }
                                                        >
                                                            Create Task
                                                        </Button>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {project.tasks &&
                                        project.tasks.length > 0 ? (
                                            project.tasks.map((task) => (
                                                <Card
                                                    key={task.id}
                                                    className={`transition-colors ${task.status === 'completed' ? 'bg-muted/50' : ''}`}
                                                >
                                                    <CardContent className="p-4">
                                                        <div className="flex items-start gap-3">
                                                            {/* Task status toggle */}
                                                            {isMember && (
                                                                <button
                                                                    onClick={() =>
                                                                        handleToggleTaskStatus(
                                                                            task,
                                                                        )
                                                                    }
                                                                    className="mt-1 transition-colors hover:text-primary"
                                                                >
                                                                    {task.status ===
                                                                    'completed' ? (
                                                                        <CheckCircle2 className="h-5 w-5 text-primary" />
                                                                    ) : (
                                                                        <Circle className="h-5 w-5 text-muted-foreground" />
                                                                    )}
                                                                </button>
                                                            )}

                                                            <div className="flex-1 space-y-2">
                                                                <div className="flex items-start justify-between gap-2">
                                                                    <h4
                                                                        className={`leading-tight font-semibold ${task.status === 'completed' ? 'text-muted-foreground line-through' : ''}`}
                                                                    >
                                                                        {
                                                                            task.title
                                                                        }
                                                                    </h4>
                                                                    <Badge
                                                                        variant={
                                                                            task.status ===
                                                                            'completed'
                                                                                ? 'secondary'
                                                                                : 'default'
                                                                        }
                                                                        className="shrink-0"
                                                                    >
                                                                        {
                                                                            task.status
                                                                        }
                                                                    </Badge>
                                                                </div>

                                                                <p
                                                                    className={`text-sm leading-relaxed ${task.status === 'completed' ? 'text-muted-foreground' : 'text-muted-foreground'}`}
                                                                >
                                                                    {
                                                                        task.description
                                                                    }
                                                                </p>

                                                                <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
                                                                    <div className="flex items-center gap-1">
                                                                        <User className="h-3 w-3" />
                                                                        <span>
                                                                            {task
                                                                                .user
                                                                                ?.name ||
                                                                                'Unknown'}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-1">
                                                                        <Clock className="h-3 w-3" />
                                                                        <span>
                                                                            {formatDate(
                                                                                task.created_at,
                                                                            )}
                                                                        </span>
                                                                    </div>

                                                                    {isMember && (
                                                                        <div className="flex items-center gap-2">
                                                                            <Button
                                                                                size="sm"
                                                                                variant={
                                                                                    task.status ===
                                                                                    'completed'
                                                                                        ? 'outline'
                                                                                        : 'default'
                                                                                }
                                                                                onClick={() =>
                                                                                    handleToggleTaskStatus(
                                                                                        task,
                                                                                    )
                                                                                }
                                                                                className="gap-2"
                                                                            >
                                                                                {task.status ===
                                                                                'completed' ? (
                                                                                    <>
                                                                                        <CheckCircle2 className="h-4 w-4" />
                                                                                        Completed
                                                                                    </>
                                                                                ) : (
                                                                                    <>
                                                                                        <Circle className="h-4 w-4" />
                                                                                        Mark
                                                                                        Complete
                                                                                    </>
                                                                                )}
                                                                            </Button>
                                                                            <Button
                                                                                size="sm"
                                                                                variant="destructive"
                                                                                onClick={() =>
                                                                                    handleDeleteTask(
                                                                                        task.id,
                                                                                    )
                                                                                }
                                                                                className="gap-2"
                                                                            >
                                                                                <Trash2 className="h-4 w-4" />
                                                                                Delete
                                                                            </Button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))
                                        ) : (
                                            <div className="flex items-center justify-center rounded-lg border-2 border-dashed p-12">
                                                <div className="text-center">
                                                    <ListTodo className="mx-auto h-12 w-12 text-muted-foreground" />
                                                    <p className="mt-4 text-sm text-muted-foreground">
                                                        No tasks created yet
                                                    </p>
                                                    {isMember && (
                                                        <p className="mt-1 text-xs text-muted-foreground">
                                                            Click "Add Task" to
                                                            create your first
                                                            task
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
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
