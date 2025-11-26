import { useState, useEffect } from 'react';

// ==========================================
// PANDUAN COPY-PASTE KE LARAVEL ANDA
// ==========================================
// 1. Uncomment import asli di bawah ini:
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    // Gunakan useForm (Mock atau Asli)
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        // route('login') sekarang aman karena ada mock function di atas
        post(route('login'));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Head title="Log in" />

            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform transition-all hover:scale-[1.01]">
                
                {/* Header Logo */}
                <div className="bg-emerald-900 p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-4 shadow-lg">
                        <svg className="w-8 h-8 text-emerald-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    </div>
                    <h2 className="text-2xl font-bold text-orange-50 tracking-widest">REPOFIK+</h2>
                    <p className="text-emerald-200 text-xs uppercase tracking-wider mt-1">Sistem Repository Akademik</p>
                </div>

                {/* Form Area */}
                <div className="p-8">
                    {status && <div className="mb-4 font-medium text-sm text-green-600 text-center">{status}</div>}

                    <form onSubmit={submit} className="space-y-6">
                        
                        {/* Email Input */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Email Address</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                </span>
                                <input 
                                    type="email" 
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition bg-gray-50 focus:bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="nama@kampus.ac.id"
                                    autoComplete="username"
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Password</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                </span>
                                <input 
                                    type="password" 
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition bg-gray-50 focus:bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                />
                            </div>
                            {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>}
                        </div>

                        {/* Remember & Forgot */}
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-gray-300 text-emerald-600 shadow-sm focus:ring-emerald-500" 
                                />
                                <span className="ml-2 text-gray-600 dark:text-gray-400">Ingat Saya</span>
                            </label>
                            {canResetPassword && (
                                <Link href={route('password.request')} className="text-emerald-600 hover:text-emerald-800 font-medium hover:underline">
                                    Lupa Password?
                                </Link>
                            )}
                        </div>

                        {/* Button */}
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                        >
                            {processing && (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            )}
                            {processing ? 'Memproses...' : 'MASUK'}
                        </button>
                    </form>
                </div>
                
                {/* Footer */}
                <div className="bg-gray-50 dark:bg-gray-700/50 px-8 py-4 text-center border-t border-gray-100 dark:border-gray-700">
                    <p className="text-sm text-gray-500">Belum punya akun? <Link href={route('register')} className="text-emerald-600 font-bold hover:underline">Daftar</Link></p>
                </div>
            </div>
        </div>
    );
}