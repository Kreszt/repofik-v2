function populateKategori(role_id) {
    switch (role_id) {


        case 1:
            return `
        <option value="">Role: Dosen</option>
        <option value="">Data Pokok</option>
        <option value="">Data Penelitian</option>
        `;
            break;

        case 2:
            return `
        <option value="Mahasiswa">Role: Mahasiswa</option>
        <option value="Data Pokok">Data Pokok</option>
        <option value="Data Penelitian">Data Penelitian</option>
        `;
            break;

        case 3:
            return `
        <option value="">Role: BMN</option>
        <option value="">Daftar Barang Ruangan</option>
        <option value="">Data Pokok</option>

        `;
            break;

        case 4:
            return `
        <option value="">Role: Persuratan</option>
        <option value="">Surat Masuk</option>
        <option value="">Surat Keluar</option>
        <option value="">Data Pokok</option>

        `;
            break;

        case 5:
            return `
        <option value="">Role: Kemahasiswaan</option value="">
        <option value="">MBKM</option value="">
        <option value="">Magang</option value="">
        <option value="">Pertukaran</option value="">
        <option value="">Data Pokok</option value="">

        `;
            break;

        case 6:
            return `
        <option value="">Role: Akademik</option value="">
        <option value="">Penelitian</option value="">
        <option value="">ABDIMAS</option value="">
        <option value="">Data Pokok</option value="">

        `;
            break;

        case 7:
            return `
        <option value="">Role: Perencanaan Keuangan dan Umum</option value="">
        <option value="">Perencanaan</option value="">
        <option value="">Umum</option value="">
        <option value="">Magang</option value="">
        <option value="">Data Pokok</option value="">

        `;
            break;

        case 8:
            return `
        <option value="">Role: Program Studi</option value="">
        <option value="">Akreditasi</option>
        <option value="">Monitoring dan Evaluasi</option>
        <option value="">Audit Mutu Internal</option>
        <option value="">Masa Reakreditasi</option>
        <option value="">Data Pokok</option>

        `;
            break;

        case 9:
            return `
        <option value="">Role: Lab </option>
        <option value="">Jadwal Peminjaman Lab</option>
        <option value="">Peminjaman Lab dalam Perkuliahan</option>
        <option value="">Peminjaman Lab di luar Perkuliahan</option>
        <option value="">Peminjaman Alat-Alat Lab</option>
        <option value="">Laporan Kerusakan</option>
        <option value="">Peminjaman Alat Lab Khusus</option>
        <option value="">Maintenance Lab</option>
        <option value="">Data Pokok</option>

        `;
            break;

        case 10:
            return `
        <option value="">Role: Superadmin Gojo Satoru</option>
        <option value="">Data Pokok</option>
        
        `;
            break;

        default:
            return `<option value="">Unidentified Role Value: ${role_id}</option>`
            break;
    }
}

function populateElementKategori(elementName, role_id) {
    const content = populateKategori(role_id);
    elementName.innerHTML = content;
}


