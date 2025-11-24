///dashboard.blade.php

<?php
$userData = session('user_data');
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <title>Dashboard</title>
</head>



<body>
    <h1>Welcome to the Dashboard, {{ $userData['username'] ?? 'User' }}!</h1>

    <p>Your Role ID: {{ $userData['role_id'] ?? 'N/A' }}</p>
    <p>Your Email: {{ $userData['email'] ?? 'N/A' }}</p>
    @if (!empty($userData['picture_directory']))
        <img src="{{ asset($userData['picture_directory']) }}" alt="Profile Picture">
        <p>Your Picture Directory: {{ $userData['picture_directory'] ?? 'N/A' }}</p>
    @endif
    {{-- <p>{{ $userData ?? 'N/A' }}</p> --}}
    <div id="user-data-div"></div>
</body>

<script>
    const userDataJs = {!! json_encode($userData) !!};
    const userDataDiv = document.getElementById("user-data-div");
    console.log(userDataJs);
    userDataDiv.innerHTML = userDataJs.username;
    // 1. json encode $userData variable
    // 2. display it using javascript in dashboard-tobe
</script>

</html>
