<?php
// app/Http/Controllers/LoginController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    /**
     * Handle an authentication attempt.
     */
    public function authenticate(Request $request)
    {
        // 1. Validate the incoming request data
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        // 2. Attempt to log the user in
        // NOTE: Laravel requires the password in the database to be HASHED (bcrypt).
        if (Auth::attempt($credentials)) {

            // Security measure: Regenerate the session ID
            $request->session()->regenerate();

            // --- Part 2: Create a Session (Custom Data) ---

            // Get the authenticated user model instance directly
            $user = Auth::user();

            if ($user) {
                // Store the custom user data in the session
                $request->session()->put('user_data', [
                    // Ensure these property names match your 'users' table columns
                    'user_id'           => $user->user_id,
                    'role_id'           => $user->role_id,
                    'admin_status'      => $user->admin_status,
                    'username'          => $user->username,
                    'email'             => $user->email,
                    'picture_directory' => $user->picture_directory,
                ]);
            }

            // --- Part 1: Redirect on Success ---
            // If Auth::attempt was successful, this redirects to the intended URL or the dashboard route.
            return redirect()->intended(route('dashboard'));
        }

        // 3. If authentication fails, redirect back with an error message
        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }
}
