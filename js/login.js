function handleCredentialResponse(response) {
    const responsePayload = decodeJwtResponse(response.credential);
    console.log("ID: " + responsePayload.sub);
    console.log('Full Name: ' + responsePayload.name);
    console.log('Given Name: ' + responsePayload.given_name);
    console.log('Family Name: ' + responsePayload.family_name);
    console.log("Image URL: " + responsePayload.picture);
    console.log("Email: " + responsePayload.email)
    // Store email
    localStorage.clear()
    localStorage.setItem('logged_in_email', responsePayload.email);
    // Redirect
    window.location.href = "child_add.html";
}

function decodeJwtResponse (token)
{
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}


function checkLoginState() {
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
}

// function signOut() {
//     var auth2 = gapi.auth2.getAuthInstance();
//     auth2.signOut().then(function () {
//         console.log('User signed out.');
//     });
// }

// Function to perform logout/sign out
function signOut() {
    // Clear session data and perform cleanup tasks as needed// ...
    // Redirect the user to the logout page or homepage
    window.location.href = "login.html";
}

// Set the inactivity timeout duration in milliseconds (e.g., 10 minutes)
const inactivityTimeoutDuration = 1 * 60 * 1000;
let inactivityTimeoutId;
// Function to reset the inactivity timer
function resetInactivityTimer() {
    // Clear the existing timeout, if any
    clearTimeout(inactivityTimeoutId);
    // Start a new timeout
    inactivityTimeoutId = setTimeout(signOut, inactivityTimeoutDuration);
}
// Attach event listeners to document events to reset the inactivity timer
document.addEventListener("mousemove", resetInactivityTimer);
document.addEventListener("keydown", resetInactivityTimer);
document.addEventListener("click", resetInactivityTimer);
// Start the inactivity timer on page load
document.addEventListener("DOMContentLoaded", resetInactivityTimer);
