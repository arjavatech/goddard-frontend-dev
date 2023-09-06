import {signOut} from "./authenticationVerify.js"

// Signout button event listener
document.getElementById('btn-signout').addEventListener('click', signOut);




$(document).ready(function () {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
    } else { 
        document.body.style.visibility = 'visible';
        
    }
});