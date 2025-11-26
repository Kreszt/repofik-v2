/**
 * DEVELOPMENT LOG
 * Date: 2025-11-25
 * Task: FINAL DASHBOARD PRODUCTION (Preview Safe Version)
 * Author: Sunday & Sir Karim
 */

import { useState, useEffect } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Dashboard(props) {
    // [SETUP] Data Simulasi (Fallback jika props kosong di preview)
    const auth = props.auth || { user: { name: 'Sir Karim', role_id: 10, picture_directory: 'https://ui-avatars.com/api/?name=Sir+Karim&background=064e3b&color=ffedd5' } };
    const documents = props.documents || { data: [], links: [] };
    const filters = props.filters || { search: '', trash: false };
    const flash = props.flash || { success: null, error: null };

    // [LOGIC USER]
    const user = auth.user;
    const roleId = user.role_id; 
    const isTrashMode = filters.trash === '1' || filters.trash === true;

    // [KAMUS ROLE]
    const ROLE_NAMES = {
        1: 'Dosen', 2: 'Mahasiswa', 3: 'BUMN', 4: 'Persuratan', 
        5: 'Kemahasiswaan', 6: 'Akademik', 7: 'Keuangan', 
        8: 'Prodi', 9: 'Lab', 10: 'Superadmin'
    };
    const currentRoleName = ROLE_NAMES[roleId] || 'Umum';

    // [STATE]
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');
    const [darkMode, setDarkMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]); 

    // [FORM UPLOAD]
    const { data, setData, post, processing, errors, reset } = useForm({
        uploads: [], 
    });

    // Efek Dark Mode
    useEffect(() => {
        if (darkMode) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    }, [darkMode]);

    // [TRICK] DOWNLOAD BULK (ZIP) VIA NATIVE FORM
    const submitNativeForm = (url, ids = []) => {
        // Cek ketersediaan document (aman untuk SSR/Preview)
        if (typeof document === 'undefined') return;

        const form = document.createElement('form');
        form.method = 'POST';
        form.action = url;
        
        // Ambil CSRF Token
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if(csrfToken) {
            const hiddenToken = document.createElement('input');
            hiddenToken.type = 'hidden'; hiddenToken.name = '_token'; hiddenToken.value = csrfToken;
            form.appendChild(hiddenToken);
        }

        // Masukkan ID file
        ids.forEach(id => {
            const input = document.createElement('input');
            input.type = 'hidden'; input.name = 'ids[]'; input.value = id;
            form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit(); 
        document.body.removeChild(form);
    };

    // [HANDLER] Filter Otomatis
    const handleFilter = (key, value) => {
        if(key === 'search') setSearchQuery(value);
        if(key === 'start_date') setStartDate(value);
        if(key === 'end_date') setEndDate(value);

        router.get(route('dashboard'), { 
            search: key === 'search' ? value : searchQuery,
            start_date: key === 'start_date' ? value : startDate,
            end_date: key === 'end_date' ? value : endDate,
            trash: isTrashMode 
        }, { preserveState: true, replace: true });
    };

    // [UPLOAD] Handle pilih file
    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        const newUploads = files.map(file => ({
            file: file,
            title: file.name.replace(/\.[^/.]+$/, ""), 
            date: '' 
        }));
        setData('uploads', [...data.uploads, ...newUploads]);
    };

    const updateItem = (index, field, value) => {
        const newUploads = [...data.uploads];
        newUploads[index][field] = value;
        setData('uploads', newUploads);
    };

    const removeItem = (index) => {
        const newUploads = data.uploads.filter((_, i) => i !== index);
        setData('uploads', newUploads);
    };

    const submitUpload = (e) => {
        e.preventDefault();
        post(route('document.store'), {
            forceFormData: true,
            onSuccess: () => {
                setIsUploadModalOpen(false);
                reset();
            },
            onError: () => alert("Gagal Upload! Cek isian yang berwarna merah.")
        });
    };

    // [SELEKSI] Logic Ctrl + Klik
    const handleCardClick = (e, doc) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            if (selectedIds.includes(doc.upload_id)) {
                setSelectedIds(selectedIds.filter(id => id !== doc.upload_id));
            } else {
                setSelectedIds([...selectedIds, doc.upload_id]);
            }
        } else {
            if (selectedIds.length > 0) {
                if (selectedIds.includes(doc.upload_id)) {
                    setSelectedIds(selectedIds.filter(id => id !== doc.upload_id));
                } else {
                    setSelectedIds([...selectedIds, doc.upload_id]);
                }
            } else {
                setSelectedFile(doc);
            }
        }
    };

    // [AKSI HANDLERS]
    const handleSingleDownload = (id) => {
        if (typeof window !== 'undefined') {
            window.location.href = route('document.download.single', id);
        }
    };

    const handleBulkDownload = () => {
        submitNativeForm(route('document.download.bulk'), selectedIds);
        setSelectedIds([]);
    };

    const handleRestore = (ids) => {
        if(!confirm(`Kembalikan ${ids.length} file ini ke folder aktif?`)) return;
        router.post(route('document.restore'), { ids: ids }, {
            onSuccess: () => { setSelectedIds([]); setSelectedFile(null); }
        });
    };

    const handleDelete = (ids) => {
        if (isTrashMode) {
            if(!confirm(`⚠️ PERINGATAN: ${ids.length} file akan DIHAPUS PERMANEN. Yakin?`)) return;
            router.post(route('document.force-delete'), { ids: ids }, {
                onSuccess: () => { setSelectedIds([]); setSelectedFile(null); }
            });
        } else {
            if(!confirm(`Pindahkan ${ids.length} file ke Tong Sampah?`)) return;
            router.post(route('document.delete'), { ids: ids }, {
                onSuccess: () => { setSelectedIds([]); setSelectedFile(null); }
            });
        }
    };

    return (
        <div className={`min-h-screen font-sans transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
            <Head title={isTrashMode ? "Sampah" : "Dashboard"} />

            {/* --- NAVBAR --- */}
            <nav className={`fixed w-full z-30 top-0 border-b transition-colors duration-300 ${darkMode ? 'bg-emerald-900 border-emerald-800' : 'bg-emerald-800 border-emerald-700'}`}>
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div className="text-orange-100 bg-white/10 p-2 rounded-lg">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                            </div>
                            <span className="font-bold text-xl tracking-wider text-orange-50">REPOFIK+</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full text-orange-100 hover:bg-white/10" title="Ganti Mode Gelap/Terang">
                                {darkMode ? '☀️' : '🌙'}
                            </button>
                            <div className="flex items-center gap-2 text-orange-50 bg-white/10 px-3 py-1.5 rounded-lg">
                                <img src={user.picture_directory || 'https://ui-avatars.com/api/?name=User'} alt="User" className="w-8 h-8 rounded-full border border-orange-200"/>
                                <div className="text-sm text-left hidden md:block leading-tight">
                                    <div className="font-bold">{user.username || user.name}</div>
                                    <div className="text-xs opacity-75">{currentRoleName}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex pt-16 h-screen overflow-hidden">
                
                {/* SIDEBAR KIRI */}
                <aside className={`w-64 hidden md:flex flex-col border-r shadow-sm transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <ul className="flex-1 py-6 space-y-1">
                        <li className="px-6 text-xs text-gray-400 uppercase font-bold tracking-wider mb-2">Menu Utama</li>
                        
                        {/* FOLDER UTAMA */}
                        <li>
                            <Link href={route('dashboard')} className="block">
                                <div className={`w-full text-left px-6 py-3 text-sm font-medium transition-all duration-200 flex items-center gap-3 ${!isTrashMode ? 'bg-orange-100 text-emerald-900 border-r-4 border-emerald-600 dark:bg-emerald-900/30 dark:text-orange-200 dark:border-orange-400' : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400'}`}>
                                    <span>📂</span> 
                                    {roleId === 10 ? 'Semua Dokumen' : `Folder ${currentRoleName}`}
                                </div>
                            </Link>
                        </li>

                        {/* FOLDER SAMPAH */}
                        <li>
                            <Link href={route('dashboard', { trash: 1 })} className="block">
                                <div className={`w-full text-left px-6 py-3 text-sm font-medium transition-all duration-200 flex items-center gap-3 ${isTrashMode ? 'bg-red-100 text-red-900 border-r-4 border-red-600 dark:bg-red-900/30 dark:text-red-200' : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400'}`}>
                                    <span>🗑️</span> Tong Sampah
                                </div>
                            </Link>
                        </li>

                        {/* TOMBOL LOGOUT */}
                        <li className="mt-auto border-t dark:border-gray-700 pt-2">
                            <Link href={route('logout')} method="post" as="button" className="w-full text-left px-6 py-3 text-sm text-red-500 hover:bg-red-50 transition block">
                                🚪 Logout
                            </Link>
                        </li>
                    </ul>
                </aside>

                {/* KONTEN TENGAH */}
                <main className="flex-1 flex flex-col overflow-hidden relative">
                    {/* Pesan Notifikasi */}
                    {flash.success && (
                        <div className="bg-emerald-100 border-l-4 border-emerald-500 text-emerald-700 p-4 mx-8 mt-6 rounded shadow-sm animate-fade-in-down">
                            <p className="font-bold">Sukses</p>
                            <p>{flash.success}</p>
                        </div>
                    )}
                    {flash.error && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mx-8 mt-6 rounded shadow-sm animate-pulse">
                            <p className="font-bold">Error</p>
                            <p>{flash.error}</p>
                        </div>
                    )}

                    <div className="px-8 py-6">
                        <h1 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-orange-100' : 'text-emerald-900'}`}>
                            {isTrashMode ? `Sampah (${currentRoleName})` : `Repository ${currentRoleName}`}
                        </h1>
                        
                        <div className="flex flex-col xl:flex-row justify-between gap-4 items-end xl:items-center">
                            
                            {/* Kiri: Tombol Upload */}
                            {!isTrashMode ? (
                                <button onClick={() => setIsUploadModalOpen(true)} className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transition flex items-center gap-2 group whitespace-nowrap font-semibold">
                                    <span className="bg-white/20 p-1 rounded group-hover:bg-white/30 transition">+</span> 
                                    Upload File
                                </button>
                            ) : (
                                <div className="text-red-400 text-sm italic px-4 py-2 bg-red-50 rounded border border-red-100 dark:border-red-800">
                                    ⚠️ File di sini akan dihapus permanen otomatis dalam 30 hari.
                                </div>
                            )}
                            
                            {/* Kanan: Filters */}
                            <div className="flex flex-col md:flex-row gap-2 w-full xl:w-auto">
                                {/* Filter Tanggal */}
                                <div className="flex gap-2 items-center bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm">
                                    <input type="date" value={startDate} onChange={(e) => handleFilter('start_date', e.target.value)} className="text-sm border-none focus:ring-0 bg-transparent text-gray-600 dark:text-gray-300 p-1 cursor-pointer" title="Dari Tanggal" />
                                    <span className="text-gray-400 font-bold">-</span>
                                    <input type="date" value={endDate} onChange={(e) => handleFilter('end_date', e.target.value)} className="text-sm border-none focus:ring-0 bg-transparent text-gray-600 dark:text-gray-300 p-1 cursor-pointer" title="Sampai Tanggal" />
                                </div>

                                {/* Search Bar */}
                                <div className="relative w-full md:w-64">
                                    <input type="text" value={searchQuery} onChange={(e) => handleFilter('search', e.target.value)} placeholder="Cari dokumen..." className={`w-full pl-10 pr-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-orange-300 outline-none transition ${darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}`} />
                                    <span className="absolute left-3 top-3 text-gray-400">🔍</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ACTION BAR MELAYANG (Muncul pas pilih file) */}
                    {selectedIds.length > 0 && (
                        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-6 animate-bounce-in border border-gray-700">
                            <span className="font-bold text-sm text-orange-300">{selectedIds.length} Dipilih</span>
                            <div className="h-4 w-px bg-gray-600"></div>
                            
                            {!isTrashMode && (
                                <button onClick={handleBulkDownload} className="hover:text-emerald-400 transition flex items-center gap-2 text-sm font-medium">
                                    <span>⬇️</span> Download
                                </button>
                            )}
                            
                            {isTrashMode ? (
                                <>
                                    <button onClick={() => handleRestore(selectedIds)} className="hover:text-blue-400 transition flex items-center gap-2 text-sm font-medium text-blue-200">
                                        <span>♻️</span> Restore
                                    </button>
                                    <button onClick={() => handleDelete(selectedIds)} className="hover:text-red-400 transition flex items-center gap-2 text-sm font-medium text-red-300">
                                        <span>🔥</span> Hapus Permanen
                                    </button>
                                </>
                            ) : (
                                <button onClick={() => handleDelete(selectedIds)} className="hover:text-red-400 transition flex items-center gap-2 text-sm font-medium">
                                    <span>🗑️</span> Hapus
                                </button>
                            )}
                            
                            <button onClick={() => setSelectedIds([])} className="ml-4 text-xs bg-gray-700 rounded-full p-1.5 hover:bg-gray-600 transition">✖</button>
                        </div>
                    )}

                    {/* GRID DOKUMEN */}
                    <div className="flex-1 overflow-y-auto px-8 pb-10">
                        {documents.data.length === 0 ? (
                            <div className="text-center text-gray-400 mt-20 flex flex-col items-center">
                                <div className="text-6xl mb-4 opacity-50">{isTrashMode ? '🗑️' : '📭'}</div>
                                <p className="text-lg font-medium">{isTrashMode ? 'Tong sampah bersih.' : 'Belum ada dokumen.'}</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                {documents.data.map((doc) => (
                                    <div 
                                        key={doc.upload_id} 
                                        onClick={(e) => handleCardClick(e, doc)} 
                                        className={`group p-4 rounded-xl border cursor-pointer transition-all duration-200 relative flex flex-col items-center text-center select-none
                                            ${selectedIds.includes(doc.upload_id) 
                                                ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500 shadow-lg transform scale-105 z-10' 
                                                : (darkMode ? 'bg-gray-800 border-gray-700 hover:border-orange-500' : 'bg-white border-gray-200 hover:border-emerald-400 hover:-translate-y-1 hover:shadow-md')
                                            } 
                                            ${isTrashMode && !selectedIds.includes(doc.upload_id) ? 'opacity-75 hover:opacity-100 grayscale hover:grayscale-0' : ''}
                                        `}
                                    >
                                        {selectedIds.includes(doc.upload_id) && (
                                            <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm shadow-sm animate-bounce-in">✓</div>
                                        )}
                                        
                                        <div className={`mb-3 p-4 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-orange-50 group-hover:bg-orange-100'} transition-colors`}>
                                            <span className="text-3xl">📄</span>
                                        </div>
                                        
                                        <div className={`text-sm font-bold w-full mb-1 line-clamp-2 leading-tight ${darkMode ? 'text-gray-200' : 'text-gray-700'}`} title={doc.nama_file}>
                                            {doc.nama_file}
                                        </div>
                                        <div className="text-xs text-gray-400 mt-auto pt-2 w-full border-t border-gray-100 dark:border-gray-700">
                                            {doc.last_updated}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* --- MODAL UPLOAD (BULK) --- */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsUploadModalOpen(false)}>
                    <div className={`w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`} onClick={e => e.stopPropagation()}>
                        <div className={`px-6 py-4 border-b flex justify-between items-center ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                            <h3 className="text-lg font-bold flex items-center gap-2">📤 Upload Dokumen Massal</h3>
                            <button onClick={() => setIsUploadModalOpen(false)} className="text-gray-400 hover:text-red-500 transition">✖</button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto flex-1">
                            {/* Area Drag & Drop */}
                            <div className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition relative group mb-6 ${darkMode ? 'border-gray-600 hover:border-orange-400 hover:bg-gray-700' : 'border-gray-300 hover:border-emerald-500 hover:bg-emerald-50'}`}>
                                <input type="file" multiple onChange={handleFileSelect} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                <div className="space-y-2">
                                    <div className="text-4xl group-hover:scale-110 transition-transform">📎</div>
                                    <div className="text-sm font-medium">Klik atau Drag & Drop file di sini</div>
                                    <div className="text-xs opacity-60">Bisa pilih banyak file sekaligus (PDF/DOC)</div>
                                </div>
                            </div>

                            {/* List Antrian Upload */}
                            {data.uploads.length > 0 && (
                                <div className="space-y-3">
                                    <div className="flex justify-between items-end border-b pb-2 mb-2 opacity-70">
                                        <h4 className="text-xs font-bold uppercase tracking-wider">Antrian Upload ({data.uploads.length})</h4>
                                        <button onClick={() => setData('uploads', [])} className="text-xs text-red-400 hover:underline">Hapus Semua</button>
                                    </div>
                                    
                                    {data.uploads.map((item, index) => (
                                        <div key={index} className={`flex flex-col gap-3 p-4 rounded-lg border transition ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200 hover:shadow-sm'}`}>
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-2 overflow-hidden">
                                                    <span className="text-xl">📄</span>
                                                    <div className="flex flex-col overflow-hidden">
                                                        <span className="text-xs opacity-60 truncate max-w-[250px]" title={item.file.name}>{item.file.name}</span>
                                                        <span className="text-[10px] font-mono opacity-40">{(item.file.size / 1024 / 1024).toFixed(2)} MB</span>
                                                    </div>
                                                </div>
                                                <button onClick={() => removeItem(index)} className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/30 transition">🗑️</button>
                                            </div>

                                            {errors[`uploads.${index}.file`] && <div className="text-red-500 text-xs font-bold bg-red-50 p-1 rounded">{errors[`uploads.${index}.file`]}</div>}

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-[10px] font-bold mb-1 opacity-70 uppercase">Judul Dokumen</label>
                                                    <input 
                                                        type="text" 
                                                        value={item.title} 
                                                        onChange={(e) => updateItem(index, 'title', e.target.value)} 
                                                        className={`w-full px-3 py-1.5 text-sm rounded border outline-none transition ${errors[`uploads.${index}.title`] ? 'border-red-500 ring-1 ring-red-500' : (darkMode ? 'bg-gray-800 border-gray-600 focus:border-orange-400' : 'bg-white border-gray-300 focus:border-emerald-500')}`} 
                                                        placeholder="Nama file..."
                                                    />
                                                    {errors[`uploads.${index}.title`] && <div className="text-red-500 text-xs mt-1">{errors[`uploads.${index}.title`]}</div>}
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-bold mb-1 opacity-70 uppercase">Tgl Validasi / TTD</label>
                                                    <input 
                                                        type="date" 
                                                        value={item.date} 
                                                        onChange={(e) => updateItem(index, 'date', e.target.value)} 
                                                        className={`w-full px-3 py-1.5 text-sm rounded border outline-none transition ${errors[`uploads.${index}.date`] ? 'border-red-500 ring-1 ring-red-500' : (darkMode ? 'bg-gray-800 border-gray-600 focus:border-orange-400' : 'bg-white border-gray-300 focus:border-emerald-500')}`} 
                                                    />
                                                    <div className="text-[10px] opacity-40 mt-1 text-right">Kosong = Hari Ini</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className={`px-6 py-4 border-t ${darkMode ? 'bg-gray-700/50 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
                            {/* Progress Bar - Hanya Mock di Preview */}
                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => {setIsUploadModalOpen(false); setData('uploads', [])}} className="px-4 py-2 rounded-lg text-gray-500 hover:bg-gray-200 transition font-medium" disabled={processing}>Batal</button>
                                <button onClick={submitUpload} disabled={processing || data.uploads.length === 0} className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 font-medium shadow-lg transition">Upload {data.uploads.length} File</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- MODAL DETAIL (SINGLE) --- */}
            {selectedFile && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedFile(null)}>
                    <div className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-6 text-center ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`} onClick={e => e.stopPropagation()}>
                        <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${darkMode ? 'bg-gray-700' : 'bg-orange-50'}`}>
                            <span className="text-4xl">📄</span>
                        </div>
                        
                        <h3 className="text-xl font-bold mb-1 break-words leading-tight">{selectedFile.nama_file}</h3>
                        
                        {/* Info File Fisik (Path) */}
                        <div className={`text-xs font-mono mt-2 mb-6 px-3 py-2 rounded break-all ${darkMode ? 'bg-gray-900 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                            📂 {selectedFile.lokasi_file}
                        </div>

                        <div className="flex gap-3">
                            {!isTrashMode && (
                                <button onClick={() => handleSingleDownload(selectedFile.upload_id)} className="flex-1 py-2.5 rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg transition">
                                    Download
                                </button>
                            )}
                            
                            {isTrashMode ? (
                                <>
                                    <button onClick={() => handleRestore([selectedFile.upload_id])} className="flex-1 py-2.5 rounded-xl font-semibold bg-blue-600 hover:bg-blue-700 text-white transition">
                                        Restore
                                    </button>
                                    <button onClick={() => handleDelete([selectedFile.upload_id])} className="flex-1 py-2.5 rounded-xl font-semibold border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition">
                                        Hapus
                                    </button>
                                </>
                            ) : (
                                <button onClick={() => handleDelete([selectedFile.upload_id])} className="flex-1 py-2.5 rounded-xl font-semibold border border-red-200 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition">
                                    Hapus
                                </button>
                            )}
                        </div>
                        <button onClick={() => setSelectedFile(null)} className="mt-4 text-gray-400 text-sm hover:text-gray-600 py-2 w-full">Tutup</button>
                    </div>
                </div>
            )}
        </div>
    );
}