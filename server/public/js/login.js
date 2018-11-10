$(document).ready(function () {
    console.log('login.js working!');

    $('#loginButton').on('click', login)

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            document.getElementById("user_login").style.display = "block";
            document.getElementById("user_register").style.display = "initial";

        } else {
            // No user is signed in.
            document.getElementById("user_login").style.display = "initial";
            document.getElementById("user_register").style.display = "block";
        }
    });


    function login() {

        console.log('in login');

        userEmail = document.getElementById("inputEmail").value;
        userPassword = document.getElementById("inputPassword").value;

        console.log('userEmail', userEmail);



    }
});