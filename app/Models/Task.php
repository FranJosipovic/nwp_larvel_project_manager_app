<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends Model
{
    // Allow mass assignment for these fields
    protected $fillable = [
        'title',
        'description',
        'project_id',
        'user_id',
        'status',
    ];

    // Task belongs to a project
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class,'project_id');
    }

    // Task belongs to a user (assignee/creator)
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
