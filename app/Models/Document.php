<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes; // 1. Import ini

class Document extends Model
{
    use SoftDeletes; // 2. Aktifkan Trait ini

    protected $table = 'uploads'; 
    protected $primaryKey = 'upload_id';
    public $timestamps = false; 

    protected $fillable = [
        'user_id',
        'lokasi_file',
        'nama_file',
        'deleted_by' // 3. Tambahkan ini agar bisa diisi
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}