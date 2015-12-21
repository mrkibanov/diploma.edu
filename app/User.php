<?php

namespace App;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Foundation\Auth\Access\Authorizable;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Illuminate\Support\Facades\Hash;

class User extends Model implements AuthenticatableContract,
                                    AuthorizableContract,
                                    CanResetPasswordContract
{
    use Authenticatable, Authorizable, CanResetPassword;

    const ROLE_ADMIN = 0;
    const ROLE_PROFESSOR = 1;

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'users';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name', 'email', 'password', 'surname', 'patronymic'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = ['password', 'remember_token', 'role'];

    /**
     * Passwords must always be hashed
     *
     * @param $password
     */
    public function setPasswordAttribute($password)
    {
        $this->attributes['password'] = Hash::make($password);
    }

    /**
     * @return boolean
     */
    public function getIsProfessor()
    {
        return $this->getAttribute('role') == self::ROLE_PROFESSOR;
    }

    /**
     * @return boolean
     */
    public function getIsAdmin()
    {
        return $this->getAttribute('role') == self::ROLE_ADMIN;
    }

    /**
     * Scope a query to only include users with role professor.
     *
     * @param $query \Illuminate\Database\Eloquent\Builder
     *
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeProfessor($query)
    {
        return $query->where('role', '=', self::ROLE_PROFESSOR);
    }

    /**
     * Get the disciplines for the professor user.
     */
    public function disciplines()
    {
        return $this->hasMany('App\Models\Discipline', 'professor_id');
    }

    /**
     * Get all videos for the professor user.
     */
    public function videos()
    {
        return $this->hasMany('App\Models\Video');
    }
}
