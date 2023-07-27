import {signOut} from "./authenticationVerify.js"

// Signout button event listener
document.getElementById('btn-signout').addEventListener('click', signOut);

// Set the inactivity timeout duration in milliseconds (e.g., 10 minutes)
const inactivityTimeoutDuration = 10 * 60 * 1000;
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
