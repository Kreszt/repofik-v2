<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LoginController;

// route to show the login form (already done by your welcome.blade.php)
// this is typically the root route '/' or a dedicated '/login' route
Route::get('/', function () {
    return view('welcome');
    // return view('dashboard');
});

// Route to handle the login attempt (POST request)
Route::post('/login', [LoginController::class, 'authenticate'])->name('login.authenticate');

// Route for the dashboard (protected later by middleware)
Route::get('/dashboard', function () {
    return view('dashboard');
})->name('dashboard');
use Illuminate\Support\Facades\DB;

// ... your other routes ...

Route::get('/test-db-connection', function () {
    try {
        DB::connection()->getPdo();
        return "Database **repofiknew** connected successfully! 🎉";
    } catch (\Exception $e) {
        return "Could not connect to the database. Check your configuration. Error: " . $e->getMessage();
    }
});