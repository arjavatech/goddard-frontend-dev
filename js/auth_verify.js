import { signOut, isAuthenticated} from "./authentication_verify.js"

// Signout button event listener
document.getElementById('btn-signout').addEventListener('click', signOut);


$(document).ready(function () {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
    } else { 
        document.body.style.visibility = 'visible';
        
    }
    $(document).on('click', '.close', function() {
        $(this).closest('.alert').fadeOut();
        window.location.reload()
    });
});