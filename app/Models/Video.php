<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class Video extends Model
{
    protected $table = 'videos';

    public function rules()
    {
        return [
            'name'        => 'required',
            //'sku'         => 'required|unique:products,sku,' . $this->get('id'),
            'image'       => 'required|mimes:video'
        ];
    }

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