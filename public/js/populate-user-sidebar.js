function populateUserSidebar(role_id) {
    switch (role_id) {

        case 1:
            return `
        <li>Role: Dosen</li>
        <li>Data Pokok</li>
        <li>Data Penelitian</li>
        `;
            break;

        case 2:
            return `
        <li>Role: Mahasiswa</li>
        <li>Data Pokok</li>
        <li>Data Penelitian</li>
        `;
            break;

        case 3:
            return `
        <li>Role: BMN</li>
        <li>Daftar Barang Ruangan</li>
        <li>Data Pokok</li>

        `;
            break;

        case 4:
            return `
        <li>Role: Persuratan</li>
        <li>Surat Masuk</li>
        <li>Surat Keluar</li>
        <li>Data Pokok</li>

        `;
            break;

        case 5:
            return `
        <li>Role: Kemahasiswaan</li>
        <li>MBKM</li>
        <li>Magang</li>
        <li>Pertukaran</li>
        <li>Data Pokok</li>

        `;
            break;

        case 6:
            return `
        <li>Role: Akademik</li>
        <li>Penelitian</li>
        <li>ABDIMAS</li>
        <li>Data Pokok</li>

        `;
            break;

        case 7:
            return `
        <li>Role: Perencanaan Keuangan dan Umum</li>
        <li>Perencanaan</li>
        <li>Umum</li>
        <li>Magang</li>
        <li>Data Pokok</li>

        `;
            break;

        case 8:
            return `
        <li>Role: Program Studi</li>
        <li>Akreditasi</li>
        <li>Monitoring dan Evaluasi</li>
        <li>Audit Mutu Internal</li>
        <li>Masa Reakreditasi</li>
        <li>Data Pokok</li>

        `;
            break;

        case 9:
            return `
        <li>Role: Lab </li>
        <li>Jadwal Peminjaman Lab</li>
        <li>Peminjaman Lab dalam Perkuliahan</li>
        <li>Peminjaman Lab di luar Perkuliahan</li>
        <li>Peminjaman Alat-Alat Lab</li>
        <li>Laporan Kerusakan</li>
        <li>Peminjaman Alat Lab Khusus</li>
        <li>Maintenance Lab</li>
        <li>Data Pokok</li>

        `;
            break;

        case 10:
            return `
        <li>Role: Superadmin Gojo Satoru</li>
        <li>Data Pokok</li>
        
        `;
            break;

        default:
            return `<li>Unidentified Role Value: ${role_id}</li>`
            break;
    }
}

function populateElement(elementName, role_id) {
    const content = populateUserSidebar(role_id);
    elementName.innerHTML = content;
}


