import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { router, useForm } from '@inertiajs/react';
import { Calendar, DollarSign, Save } from 'lucide-react';
import type React from 'react';

interface ProjectEditDialogProps {
    project: {
        id: number;
        name: string;
        description: string;
        price: number;
        end_date: string;
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
    };
    availableUsers: {
        id: number;
        name: string;
        email: string;
    }[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
    trigger?: React.ReactNode;
}

export function ProjectEditDialog({
    project,
    availableUsers,
    open,
    onOpenChange,
    trigger,
}: ProjectEditDialogProps) {
    const editForm = useForm({
        name: project.name,
        description: project.description || '',
        price: project.price,
        end_date: project.end_date,
        member_ids: project.members.map((m) => m.id),
    });

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const currentMembers = availableUsers
        .concat(project.members)
        .filter((user) => editForm.data.member_ids.includes(user.id));

    const availableToAdd = availableUsers
        .concat(project.members)
        .filter((user) => !editForm.data.member_ids.includes(user.id));

    const removeMember = (userId: number) => {
        if (userId === project.leader.id) return; // Cannot remove leader
        editForm.setData(
            'member_ids',
            editForm.data.member_ids.filter((id) => id !== userId),
        );
    };

    const addMember = (userId: number) => {
        editForm.setData('member_ids', [...editForm.data.member_ids, userId]);
    };

    const handleSaveProject = () => {
        editForm.put(`/projects/${project.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                onOpenChange(false);
                router.reload({ only: ['project', 'availableUsers'] });
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

            <DialogContent className="sm:right-0 sm:bottom-auto sm:left-auto sm:mr-6 sm:h-14/15 sm:max-w-[450px] sm:translate-x-0">
                <DialogHeader>
                    <DialogTitle>Edit Project</DialogTitle>
                    <DialogDescription>
                        Update project details and team members
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 space-y-6 overflow-y-auto pr-2">
                    {/* Project Name */}
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                            Project Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={editForm.data.name}
                            onChange={(e) =>
                                editForm.setData('name', e.target.value)
                            }
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Enter project name"
                        />
                    </div>

                    {/* Project Description */}
                    <div className="space-y-2">
                        <label
                            htmlFor="description"
                            className="text-sm font-medium"
                        >
                            Description
                        </label>
                        <Textarea
                            id="description"
                            value={editForm.data.description}
                            onChange={(e) =>
                                editForm.setData('description', e.target.value)
                            }
                            rows={4}
                            placeholder="Enter project description..."
                            className="resize-none"
                        />
                    </div>

                    {/* Budget */}
                    <div className="space-y-2">
                        <label htmlFor="price" className="text-sm font-medium">
                            Budget
                        </label>
                        <div className="relative">
                            <DollarSign className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                id="price"
                                type="number"
                                value={editForm.data.price}
                                onChange={(e) =>
                                    editForm.setData(
                                        'price',
                                        Number.parseFloat(e.target.value),
                                    )
                                }
                                className="flex h-10 w-full rounded-md border border-input bg-background py-2 pr-3 pl-9 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="0.00"
                                step="0.01"
                            />
                        </div>
                    </div>

                    {/* End Date */}
                    <div className="space-y-2">
                        <label
                            htmlFor="end_date"
                            className="text-sm font-medium"
                        >
                            End Date
                        </label>
                        <div className="relative">
                            <Calendar className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                id="end_date"
                                type="date"
                                value={editForm.data.end_date}
                                onChange={(e) =>
                                    editForm.setData('end_date', e.target.value)
                                }
                                className="flex h-10 w-full rounded-md border border-input bg-background py-2 pr-3 pl-9 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Current Members */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Current Team Members ({currentMembers.length})
                            </label>
                            <div className="max-h-[200px] space-y-2 overflow-y-auto rounded-md border p-3">
                                {currentMembers.length === 0 ? (
                                    <p className="py-4 text-center text-sm text-muted-foreground">
                                        No members yet
                                    </p>
                                ) : (
                                    currentMembers.map((user) => {
                                        const isCurrentLeader =
                                            user.id === project.leader.id;

                                        return (
                                            <div
                                                key={user.id}
                                                className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3"
                                            >
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage
                                                        src="/placeholder-user.jpg"
                                                        alt={user.name}
                                                    />
                                                    <AvatarFallback className="text-xs">
                                                        {getInitials(user.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 overflow-hidden">
                                                    <p className="truncate text-sm font-medium">
                                                        {user.name}
                                                    </p>
                                                    <p className="truncate text-xs text-muted-foreground">
                                                        {user.email}
                                                    </p>
                                                </div>
                                                {isCurrentLeader ? (
                                                    <Badge variant="secondary">
                                                        Leader
                                                    </Badge>
                                                ) : (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            removeMember(
                                                                user.id,
                                                            )
                                                        }
                                                        className="h-7 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                    >
                                                        Remove
                                                    </Button>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {/* Available Users to Add */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Available Users ({availableToAdd.length})
                            </label>
                            <div className="max-h-[200px] space-y-2 overflow-y-auto rounded-md border p-3">
                                {availableToAdd.length === 0 ? (
                                    <p className="py-4 text-center text-sm text-muted-foreground">
                                        All users are already members
                                    </p>
                                ) : (
                                    availableToAdd.map((user) => (
                                        <div
                                            key={user.id}
                                            className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                                        >
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage
                                                    src="/placeholder-user.jpg"
                                                    alt={user.name}
                                                />
                                                <AvatarFallback className="text-xs">
                                                    {getInitials(user.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 overflow-hidden">
                                                <p className="truncate text-sm font-medium">
                                                    {user.name}
                                                </p>
                                                <p className="truncate text-xs text-muted-foreground">
                                                    {user.email}
                                                </p>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    addMember(user.id)
                                                }
                                                className="h-7 text-xs"
                                            >
                                                Add
                                            </Button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-2 border-t pt-4">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSaveProject}
                        disabled={editForm.processing}
                        className="gap-2"
                    >
                        <Save className="h-4 w-4" />
                        Save Changes
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
