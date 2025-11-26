<?php

/**
 * DEVELOPMENT LOG
 * Date: 2025-11-25
 * Task: Sync Model with new 'seed_10_roles.sql' structure
 * Changes: 
 * - Primary Key: 'user_id' -> 'id' (Standard Laravel)
 * - Timestamps: Enabled (Standard Laravel)
 * - Columns: 'username' -> 'name', 'picture_directory' -> 'picture'
 * Author: Sunday & Sir Karim
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    // --- KONFIGURASI STANDARD LARAVEL (SESUAI DB BARU) ---
    protected $table = 'users';
    
    // HAPUS/KOMENTARI BARIS INI:
    protected $primaryKey = 'user_id'; // Kita sudah pakai default 'id'
    // public $timestamps = false;        // Kita sudah punya created_at & updated_at

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'username',    
        'email',
        'password',
        'role_id',
        'picture_directory',  // Dulu: picture_directory (Lebih singkat)
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}