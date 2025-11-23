<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // STATIC routes first
    Route::get('/projects', [ProjectController::class, 'index'])->name('projects.index');
    Route::get('/projects/create', [ProjectController::class, 'create'])->name('projects.create');

    // THEN dynamic routes
    Route::get('/projects/{project}', [ProjectController::class, 'show'])->name('projects.show');

    Route::post('/projects', [ProjectController::class, 'store'])->name('projects.store');

    Route::put('/projects/{project}', [ProjectController::class, 'update'])->name('projects.update');
});

Route::middleware(['auth','verified'])->group(function(){
    Route::post('tasks',[TaskController::class,'store'])->name('tasks.store');
    Route::put('tasks/{task}',[TaskController::class,'update'])->name('tasks.update');
    Route::delete('tasks/{task}',[TaskController::class,'destroy'])->name('tasks.destroy');
});

require __DIR__.'/settings.php';
