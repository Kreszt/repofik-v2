<?php
$userData = session('user_data');
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="{{ asset('./css/components.css') }}">
    <title>REPOFIK+ | Dashboard </title>
</head>

<body>
    <div class="navbar">
        <div class="logo">
            <img src="./assets/bars-white.svg" alt="bars">
            REPOFIK+
        </div>
        <button id="button-dropdown" class="button-dropdown">
            <img id="user-circle" class="user-circle" src="./assets/user-circle-down-white.svg" alt="user photo">
            <p id="button-dropdown-username">Username</p>
            <img class="chevron" src="./assets/chevron-down-white.svg" alt="chevron down">
        </button>

    </div> <!-- navbar end -->

    <div class="container container-content"><!--new one. focus on this one container in specific-->
        <div class="sidebar">
            <ul id="sidebar-list" class="sidebar-list">
                <!-- this is where i want to add the active element -->
                <!-- <li class="active">Active List Item</li>
                <li>Regular List Item</li>
                <li>Another List Item</li> -->
            </ul>
        </div>

        <div class="wrapper">
            <div class="wrapper-content">

                <h1 id="wrapper-content-category">Active Menu Item</h1>

                <div class="wrapper-content-top">
                    <button class="button-primary" id="upload-file">
                        <img src="{{ asset('./assets/file-upload-white.svg') }}" alt="" class="">
                        Upload File</button>
                    <div class="input-search">
                        <img src="{{ asset('./assets/search-gray.svg') }}" alt="">
                        <input id="input-search" type="text" placeholder="Cari disini..." autocomplete="off">
                        <img src="./assets/sliders-lines-gray.svg" alt="" class="">
                    </div>
                </div>
                <div class="wrapper-content-bottom">
                    <!-- this is where if i put more grid items that it makes the upload active menu item, upload file button, and the search bar get pushed upwards -->
                    <!-- what i want to do is that wrapper-content-top and active menu item to stay in place and maintains current look, and the wrapper-content-bottom to fill the rest of wrapper-content, whereas the rest of the overflow gets hiddem but can be scrolled to. How do i do that?-->
                    <div id="grid-container" class="grid-container">
                        <!-- <div class="grid-item">
                            <img src="./assets/file-line-black.svg" alt="File Icon" class="file-icon">
                            <div class="file-name">Long_file_name_that_will_be_truncated.txt</div>
                        </div> -->
                    </div>
                </div>
            </div>
        </div>
    </div> <!--end of container-->
    <div id="overlay-modal">
        <div class="modal-white">
            <div class="modal-white-topbar">

                <div class="text">
                    <img src="./assets/cloud-upload-gray.svg" alt="cloud">Upload Berkas
                </div>
                <div class="circles-wrapper">
                    <div class="dead-circle"></div>
                    <div class="minimize-circle"></div>
                    <div id="close-circle" class="close-circle"></div>
                </div>

            </div>
            <form class="modal-form" enctype="multipart/form-data">
                <div class="modal-form-item">
                    <label for="upload-berkas">Upload Berkas</label>
                    <div class="custom-file-input-wrapper">
                        <label for="upload-berkas" class="custom-file-label">Klik disini untuk memilih berkas</label>
                        <span id="file-name"></span>
                        <input type="file" class="hidden-input" name="upload-berkas" id="upload-berkas">
                    </div>
                </div>
                <div class="modal-form-item">
                    <label for="kategori">Kategori</label>
                    <div class="input">
                        <select name="kategori" class="select-invisible" id="kategori">
                            <!-- <option value="">Pilih Kategori File</option>
                            <option value="">1</option>
                            <option value="">2</option>
                            <option value="">3</option> -->
                        </select>
                    </div>
                </div>
                <div class="modal-form-item">
                    <label for="jenis-berkas">Jenis Berkas</label>
                    <input type="text" class="input" name="jenis-berkas" id="jenis-berkas">
                </div>
                <div class="modal-form-item">
                    <label for="tanggal-berkas">Tanggal Berkas</label>
                    <input type="date" class="input" name="tanggal-berkas" id="tanggal-berkas">
                </div>
                <div class="modal-form-item">
                    <label for="judul-berkas">Judul Berkas</label>
                    <input type="text" class="input" name="judul-berkas" id="judul-berkas">
                </div>
                <div class="modal-form-buttons">
                    <button id="button-batal" class="button-secondary">Batal</button>
                    <button class="button-primary"><img src="./assets/cloud-upload-white.svg"
                            alt="">Upload</button>
                </div>
        </div>
    </div>
    <div id="overlay-dropdown">
        <div class="button-dropdown-menu">
            <a href="edit-profil.html" class="button-secondary" id="button-edit-profil">Edit
                Profil</a>
            <a href="welcome.blade.php" class="button-primary" id="button-log-out">Log Out</a>
        </div>
    </div>
    <div id="overlay-file-click" class="overlay-file-click">
        <div class="modal-white">

            <div class="modal-white-topbar">
                <div class="text">
                    <img src="./assets/cloud-upload-gray.svg" alt="cloud">Informasi Berkas
                </div>
                <div class="circles-wrapper">
                    <div class="dead-circle"></div>
                    <div class="minimize-circle"></div>
                    <div id="close-circle-click" class="close-circle"></div>
                </div>

            </div>
            <div class="modal-form">
                <div class="modal-form-item">
                    <button class="button-primary">Buka</button>
                    <button class="button-secondary">Download</button>
                    <button class="button-secondary">Hapus</button>
                </div>
                <div class="modal-form-item">
                    <label for="upload-berkas">Ganti Berkas</label>
                    <div class="custom-file-input-wrapper">
                        <label for="upload-berkas" class="custom-file-label">Klik disini untuk mengganti
                            berkas</label>
                        <span id="file-name"></span>
                        <input type="file" class="hidden-input" name="upload-berkas" id="upload-berkas">
                    </div>
                </div>
                <div class="modal-form-item">
                    <label for="jenis-berkas">Jenis Berkas</label>
                    <input type="text" class="input" name="jenis-berkas" id="jenis-berkas-file-click"
                        autocomplete="off">
                </div>
                <div class="modal-form-item">
                    <label for="tanggal-berkas">Tanggal Berkas</label>
                    <input type="date" class="input" name="tanggal-berkas" id="tanggal-berkas-file-click"
                        autocomplete="off">
                </div>
                <div class="modal-form-item">
                    <label for="judul-berkas">Judul Berkas</label>
                    <input type="text" class="input" name="judul-berkas" id="judul-berkas-file-click"
                        autocomplete="off">
                </div>
                <div class="modal-form-buttons">
                    <button id="button-batal" class="button-secondary">Batal</button>
                    <button class="button-primary"><img src="./assets/cloud-upload-white.svg" alt="">Simpan
                        Perubahan</button>
                </div>

            </div>
        </div>
    </div>
</body>
<script src="{{ asset('./js/populate-user-sidebar.js') }}"></script> <!-- for sidebar --> <!-- calls populateElement() -->

<script src="{{ asset('./js/populate-kategori.js') }}"></script><!-- for kategori -->

<script src="{{ asset('./js/dashboard.js') }}"></script>
<script>
// later will me moved to : dashboard.js
// const uploadModal = document.getElementById("upload-modal");

// step 0: json encode the session data
const userDataJs = {!! json_encode($userData)!!};

// 1) overlay and modal start
const uploadButton = document.getElementById("upload-file");
const overlayModal = document.getElementById("overlay-modal");
const buttonBatal = document.getElementById("button-batal");
const closeCircle = document.getElementById("close-circle");
const buttonDropdown = document.getElementById("button-dropdown");
const overlayDropdown = document.getElementById("overlay-dropdown");
const buttonEditProfil = document.getElementById("button-edit-profil");
const buttonLogOut = document.getElementById("button-log-out");

uploadButton.addEventListener("click", () => {
    // window.alert("Upload Button Has Been Clicked")
    overlayModal.style.display = "flex"
});

buttonBatal.addEventListener("click", () => {
    overlayModal.style.display = "none"
});

closeCircle.addEventListener("click", () => {
    overlayModal.style.display = "none"
});
// overlay and modal end

// 2) file upload button  start
document.getElementById('upload-berkas').addEventListener('change', function () {
    var fileName = this.files[0].name;
    document.getElementById('file-name').textContent = fileName;
    document.querySelector('.custom-file-label').textContent = ''; // Optional: Clear the original text
});
// file upload button end

// 3) overlay-dropdown start
const buttonDropdownUsername = document.getElementById("button-dropdown-username");
buttonDropdownUsername.textContent = userDataJs.username;

buttonDropdown.addEventListener("click", () => {
    // window.alert("Upload Button Has Been Clicked")
    overlayDropdown.style.display = "flex"
});



overlayDropdown.addEventListener("click", (event) => {
    // overlayDropdown.style.display = "none"
    if (event.target === overlayDropdown) {
        overlayDropdown.style.display = "none";
    }
});

buttonEditProfil.addEventListener("click", () => {
    // alert("button-edit-profil has been clicked");
    // window.location.href = 'edit-profil.html';
    window.location.href = "edit-profil.html";
})

buttonLogOut.addEventListener("click", () => {
    alert("button-log-out has been clicked");
})
// overlay-dropdown end



// 4) grid-container populate loop start
const gridContainer = document.getElementById("grid-container");

const nItems = 25;

for (let i = 1; i <= nItems; i++) {
    // creating the grid-item <div>
    const gridItem = document.createElement("div");
    gridItem.classList.add("grid-item");

    // creating the file <img> icon
    const fileIcon = document.createElement("img");
    fileIcon.src = "./assets/file-line-black.svg";
    fileIcon.alt = "File Icon";
    fileIcon.classList.add("file-icon");

    // create the file-name <div>
    const fileName = document.createElement("div");
    fileName.classList.add("file-name");
    fileName.textContent = `File_name_${i}.txt`;

    // append the file icon and the file name to the grid-item
    gridItem.appendChild(fileIcon);
    gridItem.appendChild(fileName);

    // append the complete grid-item to the grid-container div
    gridContainer.appendChild(gridItem);
}

// grid-container populate loop end

// 5) grid-item-click start

const gridItems = document.querySelectorAll(".grid-item");

console.log(gridItems)


const overlayFileClick = document.getElementById("overlay-file-click")
const judulBerkasFileClick = document.getElementById("judul-berkas-file-click");
const tanggalBerkasFileClick = document.getElementById("tanggal-berkas-file-click");
const jenisBerkasFileClick = document.getElementById("jenis-berkas-file-click");

gridItems.forEach(item => {
    item.addEventListener("click", () => {
        // console.log(item.fileName)
        // window.alert("grid-item " + item.textContent + " has been clicked");

        // you need to make the modal appear with the item's current data
        // inside the input fields

        overlayFileClick.style.display = "flex";
        // judulBerkasFileClick.textContent = item.fileName.textContent;


        // get today's date
        const today = new Date();

        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}`;

        // value adalah kunci!
        jenisBerkasFileClick.value = item.textContent;
        tanggalBerkasFileClick.value = formattedDate;
        judulBerkasFileClick.value = item.textContent;
    })
})

const closeCircleClick = document.getElementById("close-circle-click");
closeCircleClick.addEventListener("click", () => {
    overlayFileClick.style.display = "none";
})
// grid-item-click end

// 6) Search Input EventListener Start
const inputSearch = document.getElementById("input-search");
inputSearch.addEventListener("keyup", (event) => {
    if (event.key === 'Enter') {
        window.alert("the user has done a search function : " + inputSearch.value);
    }
});
// Search Input EventListener End

// 7) populate user sidebar start
const sidebarList = document.getElementById("sidebar-list");
const role_id = userDataJs.role_id; // set the role_id from session data
populateElement(sidebarList, role_id); //from populate-user-sidebar.js

// populate user sidebar end


// 8) active-menu-item-start
const listItems = document.querySelectorAll(".sidebar-list li");
const wrapperContentCategory = document.getElementById("wrapper-content-category");


if (listItems.length > 0) {
    // (!) explanation: this loop chooses the first item, adds the acive class, 
    // and changes the wrapper-content-category's content to match your
    // selected class (!)
    const firstItem = listItems[0];
    console.log("first item is : " + firstItem.textContent);
    firstItem.classList.add("active")
    wrapperContentCategory.textContent = firstItem.textContent;
}

listItems.forEach(item => {
    item.addEventListener("click", () => {
        console.log("this sidebar item " + item.textContent + " has been clicked");
        console.log(item.textContent);
        wrapperContentCategory.textContent = item.textContent;


        // remove all the active class from all list items
        listItems.forEach(li => {
            li.classList.remove("active");
        })

        item.classList.add("active");
    });
});
// active-menu-item-end

// 9) populate-kategori-start

const kategori = document.getElementById("kategori");
console.log(kategori.innerHTML);

populateElementKategori(kategori, role_id);
// populate-kategori-end

// 10) set user-circle-image to ./assets/default-user-placeholder

const userCircle = document.getElementById("user-circle");
// userCircle.setAttribute("src", "./assets/default-user-placeholder.png");
userCircle.setAttribute("src", userDataJs.picture_directory);

// set user-image-circle end
</script>


</script>

</html>
