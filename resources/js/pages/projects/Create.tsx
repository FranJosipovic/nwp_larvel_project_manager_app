import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Calendar, CheckCircle2, DollarSign, Users } from 'lucide-react';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface CreateProps {
    users: User[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Projects create',
        href: 'projects/create',
    },
];

export default function Create({ users }: CreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        price: '',
        start_date: '',
        end_date: '',
        members: [] as number[],
    });

    const [selectedMembers, setSelectedMembers] = useState<number[]>([]);

    const handleMemberToggle = (userId: number) => {
        const newMembers = selectedMembers.includes(userId)
            ? selectedMembers.filter((id) => id !== userId)
            : [...selectedMembers, userId];

        setSelectedMembers(newMembers);
        setData('members', newMembers);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/projects');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="min-h-screen bg-muted/30">
                <Head title="Create New Project" />

                <div className="container mx-auto max-w-4xl px-4 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        {/* <Link href="/projects">
                            <Button variant="ghost" size="sm" className="mb-4">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to projects
                            </Button>
                        </Link> */}
                        <h1 className="text-4xl font-bold tracking-tight">
                            Create New Project
                        </h1>
                        <p className="mt-2 text-muted-foreground">
                            Fill in the details below to create a new project.
                            You will be assigned as the project manager.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                                <CardDescription>
                                    Enter the main details about your project
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Project Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-base">
                                        Project Name{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        placeholder="Enter project name"
                                        className={cn(
                                            errors.name &&
                                                'border-destructive focus-visible:ring-destructive',
                                        )}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-destructive">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="description"
                                        className="text-base"
                                    >
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Describe your project goals, scope, and deliverables..."
                                        rows={5}
                                        className={cn(
                                            errors.description &&
                                                'border-destructive focus-visible:ring-destructive',
                                        )}
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-destructive">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>

                                {/* Price */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="price"
                                        className="flex items-center gap-2 text-base"
                                    >
                                        <DollarSign className="h-4 w-4" />
                                        Project Budget
                                    </Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        value={data.price}
                                        onChange={(e) =>
                                            setData('price', e.target.value)
                                        }
                                        placeholder="0.00"
                                        className={cn(
                                            errors.price &&
                                                'border-destructive focus-visible:ring-destructive',
                                        )}
                                    />
                                    {errors.price && (
                                        <p className="text-sm text-destructive">
                                            {errors.price}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Timeline Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Project Timeline
                                </CardTitle>
                                <CardDescription>
                                    Set the start and end dates for your project
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {/* Start Date */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="start_date"
                                            className="text-base"
                                        >
                                            Start Date
                                        </Label>
                                        <Input
                                            id="start_date"
                                            type="date"
                                            value={data.start_date}
                                            onChange={(e) =>
                                                setData(
                                                    'start_date',
                                                    e.target.value,
                                                )
                                            }
                                            className={cn(
                                                errors.start_date &&
                                                    'border-destructive focus-visible:ring-destructive',
                                            )}
                                        />
                                        {errors.start_date && (
                                            <p className="text-sm text-destructive">
                                                {errors.start_date}
                                            </p>
                                        )}
                                    </div>

                                    {/* End Date */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="end_date"
                                            className="text-base"
                                        >
                                            End Date
                                        </Label>
                                        <Input
                                            id="end_date"
                                            type="date"
                                            value={data.end_date}
                                            onChange={(e) =>
                                                setData(
                                                    'end_date',
                                                    e.target.value,
                                                )
                                            }
                                            className={cn(
                                                errors.end_date &&
                                                    'border-destructive focus-visible:ring-destructive',
                                            )}
                                        />
                                        {errors.end_date && (
                                            <p className="text-sm text-destructive">
                                                {errors.end_date}
                                            </p>
                                        )}
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
                                    Select team members from registered users.
                                    Click to add or remove members.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {users.length === 0 ? (
                                        <p className="py-8 text-center text-sm text-muted-foreground">
                                            No registered users available
                                        </p>
                                    ) : (
                                        <div className="grid max-h-96 grid-cols-1 gap-3 overflow-y-auto pr-2">
                                            {users.map((user) => {
                                                const isSelected =
                                                    selectedMembers.includes(
                                                        user.id,
                                                    );
                                                return (
                                                    <button
                                                        key={user.id}
                                                        type="button"
                                                        onClick={() =>
                                                            handleMemberToggle(
                                                                user.id,
                                                            )
                                                        }
                                                        className={cn(
                                                            'flex items-center justify-between rounded-lg border-2 p-4 transition-all hover:shadow-md',
                                                            isSelected
                                                                ? 'border-primary bg-primary/5'
                                                                : 'border-border hover:border-primary/50',
                                                        )}
                                                    >
                                                        <div className="flex items-center gap-3 text-left">
                                                            <div
                                                                className={cn(
                                                                    'flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold',
                                                                    isSelected
                                                                        ? 'bg-primary text-primary-foreground'
                                                                        : 'bg-muted text-muted-foreground',
                                                                )}
                                                            >
                                                                {user.name
                                                                    .charAt(0)
                                                                    .toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium">
                                                                    {user.name}
                                                                </p>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {user.email}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        {isSelected && (
                                                            <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                    {selectedMembers.length > 0 && (
                                        <div className="flex items-center gap-2 pt-2">
                                            <Badge variant="secondary">
                                                {selectedMembers.length} member
                                                {selectedMembers.length !== 1
                                                    ? 's'
                                                    : ''}{' '}
                                                selected
                                            </Badge>
                                        </div>
                                    )}
                                    {errors.members && (
                                        <p className="text-sm text-destructive">
                                            {errors.members}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Submit Button */}
                        <div className="flex justify-end gap-4 pt-4">
                            <Link href="/projects">
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={processing}
                                >
                                    Cancel
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                disabled={processing}
                                size="lg"
                            >
                                {processing ? 'Creating...' : 'Create Project'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
