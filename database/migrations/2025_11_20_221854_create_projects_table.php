<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            // leader (person who opened the project)
            $table->foreignId('leader_id')->constrained('users')->onDelete('cascade');

            $table->string('name');
            $table->text('description')->nullable();

            // price — decimal is fine for homework; 12,2 supports big amounts
            $table->decimal('price', 12, 2)->default(0);

            // obavljeni poslovi — integer count of completed tasks/items
            $table->integer('completed_tasks')->default(0);

            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
