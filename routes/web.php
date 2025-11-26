<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

// 1. Redirect Root ke Dashboard
Route::get('/', function () {
    return redirect()->route('dashboard');
});

// 2. Dashboard & Aksi Dokumen (Harus Login & Verified)
Route::middleware(['auth', 'verified'])->group(function () {
    
    // [VIEW] Halaman Dashboard (GET)
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // [ACTIONS] Aksi yang menggunakan POST
    // Upload Dokumen
    Route::post('/dashboard/upload', [DashboardController::class, 'store'])->name('document.store');
    
    // Delete & Restore
    Route::post('/dashboard/delete', [DashboardController::class, 'destroy'])->name('document.delete');
    Route::post('/dashboard/restore', [DashboardController::class, 'restore'])->name('document.restore');
    Route::post('/dashboard/force-delete', [DashboardController::class, 'forceDelete'])->name('document.force-delete');
    
    // Download Bulk (POST karena kirim array ID)
    Route::post('/dashboard/download-bulk', [DashboardController::class, 'downloadBulk'])->name('document.download.bulk');
    
    // Download Single (GET karena link biasa)
    Route::get('/dashboard/download/{id}', [DashboardController::class, 'downloadSingle'])->name('document.download.single');

});

// 3. Profile Routes (Bawaan Breeze)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// 4. Auth Routes (Login, Register, dll)
require __DIR__.'/auth.php';