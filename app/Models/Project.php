<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    protected $fillable = [
        'leader_id',
        'name',
        'description',
        'price',
        'completed_tasks',
        'start_date',
        'end_date',
    ];

    // leader (owner)
    public function leader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'leader_id');
    }

    // members (many-to-many)
    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'project_user')->withTimestamps();
    }

    // tasks (one-to-many)
    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }
}
