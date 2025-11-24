function checkRoleId(role_id) {
    switch (role_id) {
        case 1:
            return "Mahasiswa";
            break;
        case 2:
            return "Dosen";
            break;
        case 3:
            return "BMN";
            break;
        case 4:
            return "Persuratan";
            break;
        case 5:
            return "Kemahasiswaan";
            break;
        case 6:
            return "Akademik";
            break;
        case 7:
            return "Keuangan dan Umum";
            break;
        case 8:
            return "Prodi";
            break;
        case 9:
            return "Lab";
            break;
        case 10:
            return "Superadmin";
            break;

        default:
            return "role_id value is not valid";
            break;
    }
}