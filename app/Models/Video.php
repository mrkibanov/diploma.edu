<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class Video extends Model
{
    protected $fillable = ['description', 'discipline_id', 'title'];

    protected $table = 'videos';

    /**
     * Get the user that owns the video.
     */
    public function user()
    {
        return $this->belongsTo('App\User');
    }

    /**
     * Get the discipline that owns the video.
     */
    public function discipline()
    {
        return $this->belongsTo('App\Models\Discipline');
    }
}