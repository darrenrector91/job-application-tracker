$(document).ready(function () {
    console.log('login.js working!');

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAfMqR3ATYE6jg3TPH_0OOLoph83S9IMxk",
        authDomain: "blue-62.firebaseapp.com",
        databaseURL: "https://blue-62.firebaseio.com",
        projectId: "blue-62",
        storageBucket: "blue-62.appspot.com",
        messagingSenderId: "524336894022"
    };
    firebase.initializeApp(config);



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