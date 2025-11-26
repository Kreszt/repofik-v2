<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use ZipArchive;

class DashboardController extends Controller
{
    /**
     * Menampilkan Halaman Dashboard
     */
    public function index(Request $request)
    {
        $user = Auth::user(); 

        // [2] FILTER DATA
        $search = $request->input('search');
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $isTrash = $request->boolean('trash');
        $directory = $request->input('directory'); // Filter direktori

        // [3] QUERY BUILDER
        $query = Document::query()->with('user'); // Eager load data uploader

        // Mode Sampah vs Mode Aktif
        if ($isTrash) {
            $query->onlyTrashed(); 
        }

        // Filter Pencarian
        $query->when($search, function ($q, $search) {
            $q->where('nama_file', 'like', "%{$search}%");
        });

        // Filter Tanggal
        if ($startDate && $endDate) {
            $query->whereBetween('last_updated', [$startDate, $endDate]);
        }

        // [4] ISOLASI DATA (DATA SECURITY)
        // Superadmin (Role 10) -> Bisa lihat semua.
        // User Lain -> Hanya bisa lihat file milik sendiri (user_id).
        if ($user->role_id == 10) {
            // Superadmin (Role 10) -> Bisa lihat semua, filter per direktori jika ada
            $query->when($directory, function ($q, $directory) {
                $q->where('lokasi_file', 'like', "documents/{$directory}/%");
            });
        } else {
            // User Lain -> Hanya bisa lihat file milik sendiri (user_id).
            $query->where('user_id', $user->user_id);
        }


        // Eksekusi Query
        $documents = $query->orderBy('last_updated', 'desc')
            ->paginate(12)
            ->withQueryString();

        // Data untuk Sidebar
        $roleFolders = [
            1 => 'dosen', 2 => 'mahasiswa', 3 => 'bumn', 4 => 'persuratan',
            5 => 'kemahasiswaan', 6 => 'akademik', 7 => 'keuangan',
            8 => 'prodi', 9 => 'lab'
        ];

        return Inertia::render('Dashboard', [
            'documents' => $documents,
            'filters' => $request->only(['search', 'trash', 'start_date', 'end_date', 'directory']),
            'auth' => ['user' => $user], // Mengirim data user asli ke React
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
            'allRoles' => $roleFolders, 
        ]);
    }

    /**
     * Menyimpan File Upload (Create)
     */
    public function store(Request $request)
    {
        $request->validate([
            'uploads' => 'required|array',
            'uploads.*.file' => 'required|file|mimes:pdf,doc,docx|max:10240',
        ]);

        // [PENTING] Ambil user dari Auth, bukan hardcode.
        // Ini menjamin file masuk ke folder milik user yang sedang login.
        $user = Auth::user(); 
        
        // Mapping Folder
        $roleFolders = [
            1 => 'dosen', 2 => 'mahasiswa', 3 => 'bumn', 4 => 'persuratan',
            5 => 'kemahasiswaan', 6 => 'akademik', 7 => 'keuangan',
            8 => 'prodi', 9 => 'lab', 10 => 'superadmin'
        ];
        
        $folderName = $roleFolders[$user->role_id] ?? 'umum';
        $successCount = 0;

        foreach ($request->uploads as $item) {
            $file = $item['file'];
            
            // Penamaan File
            $judul = !empty($item['title']) ? $item['title'] : pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $cleanTitle = preg_replace('/[^A-Za-z0-9 \-\.]/', '', $judul); 
            
            $tglInput = !empty($item['date']) ? $item['date'] : now();
            $tglFormat = Carbon::parse($tglInput)->format('d-m-Y');

            $ext = $file->getClientOriginalExtension();
            $finalName = "{$cleanTitle}_" . strtoupper($ext) . "_{$tglFormat}_" . uniqid() . ".{$ext}";
            
            // Simpan Fisik (Storage)
            $path = $file->storeAs("documents/{$folderName}", $finalName, 'public');
            
            if ($path) {
                // Simpan Database
                Document::create([
                    'user_id' => $user->user_id, // Pakai ID user session
                    'nama_file' => $cleanTitle,
                    'lokasi_file' => $path
                ]);
                $successCount++;
            }
        }

        return redirect()->back()->with('success', "Berhasil simpan {$successCount} file di folder: {$folderName}.");
    }

    // --- BULK DOWNLOAD ---
    public function downloadBulk(Request $request)
    {
        $ids = $request->input('ids');
        if (!$ids) return redirect()->back();

        $zipName = 'Arsip_' . date('Ymd_His') . '.zip';
        $zipPath = storage_path('app/public/' . $zipName);

        $zip = new ZipArchive;
        if ($zip->open($zipPath, ZipArchive::CREATE) === TRUE) {
            // Ambil dokumen, tapi pastikan user punya hak akses (kecuali superadmin)
            $query = Document::whereIn('upload_id', $ids);
            if(Auth::user()->role_id != 10) {
                $query->where('user_id', Auth::user()->user_id);
            }
            $documents = $query->get();
            
            foreach ($documents as $doc) {
                $realPath = storage_path('app/public/' . $doc->lokasi_file);
                if (file_exists($realPath)) {
                    $zip->addFile($realPath, basename($doc->lokasi_file));
                }
            }
            $zip->close();
        }

        return response()->download($zipPath)->deleteFileAfterSend(true);
    }

    // --- SINGLE DOWNLOAD ---
    public function downloadSingle($id)
    {
        $doc = Document::findOrFail($id);
        
        // Security Check: Jangan kasih download kalau bukan punya dia (kecuali Superadmin)
        if(Auth::user()->role_id != 10 && $doc->user_id != Auth::user()->user_id) {
            abort(403, 'Akses Ditolak. Ini bukan dokumen Anda.');
        }

        if (!Storage::disk('public')->exists($doc->lokasi_file)) {
            abort(404, 'File fisik tidak ditemukan.');
        }
        return Storage::disk('public')->download($doc->lokasi_file);
    }

    // --- DELETE & RESTORE ---
    public function destroy(Request $request) { 
        // Hanya hapus jika milik user sendiri (atau superadmin)
        $query = Document::whereIn('upload_id', $request->ids);
        if(Auth::user()->role_id != 10) $query->where('user_id', Auth::user()->user_id);
        $query->delete(); 
        return redirect()->back()->with('success', 'File dipindah ke sampah.'); 
    }
    
    public function restore(Request $request) { 
        $query = Document::onlyTrashed()->whereIn('upload_id', $request->ids);
        if(Auth::user()->role_id != 10) $query->where('user_id', Auth::user()->user_id);
        $query->restore();
        return redirect()->back()->with('success', 'File dikembalikan.'); 
    }
    
    public function forceDelete(Request $request) { 
        $query = Document::onlyTrashed()->whereIn('upload_id', $request->ids);
        if(Auth::user()->role_id != 10) $query->where('user_id', Auth::user()->user_id);
        $docs = $query->get();

        foreach($docs as $doc) {
            if(Storage::disk('public')->exists($doc->lokasi_file)) {
                Storage::disk('public')->delete($doc->lokasi_file);
            }
            $doc->forceDelete();
        }
        return redirect()->back()->with('success', 'File dimusnahkan selamanya.'); 
    }
}