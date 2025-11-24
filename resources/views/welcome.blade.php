<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>REPOFIK+ | Login</title>
    <link rel="stylesheet" href="{{asset('./css/components.css')}} ">
    <link rel="stylesheet" href="{{asset('./css/login.css')}}">
</head>

<body>
<form method="POST" action="{{ route('login.authenticate') }}" autocomplete="off">
    @csrf <div class="container container-form">
        <h1>REPOFIK+</h1>
        <div class="input-with-icon login-input">
            <img src="./assets/user-solid-gray.svg" alt="">
            <input type="text" name="email" placeholder="Email...">
        </div>
        <div class="input-with-icon login-input">
            <img src="./assets/lock-solid-gray.svg" alt="">
            <input type="password" name="password" placeholder="Password...">
        </div>
        <br>
        <input type="submit" value="Login" class="button-primary">
        <button class="button-tertiary">Daftar</button>
        <a href="#">Lupa Password</a>
    </div>

</form>
</body>

</html>