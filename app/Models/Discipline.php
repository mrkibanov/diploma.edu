<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Discipline extends Model
{
    protected $table = 'disciplines';

    /**
     * Get the professor that owns the discipline.
     */
    public function professor()
    {
        return $this->belongsTo('App\User', 'professor_id');
    }

    /**
     * Get all videos for the professor discipline.
     */
    public function videos()
    {
        return $this->hasMany('App\Models\Video');
    }
}