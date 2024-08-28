import {signOut} from "./authentication_verify.js"

document.getElementById('btn-signout').addEventListener('click', signOut);

// set the inactivity timeout duration in milliseconds.
const inactivityTimeoutDuration = 10 * 60 * 1000;
let inactivityTimeoutId;
// function to reset the inactivity timer
function resetInactivityTimer() {
    // clear the existing timeout, if any
    clearTimeout(inactivityTimeoutId);
    // start a new timeout
    inactivityTimeoutId = setTimeout(signOut, inactivityTimeoutDuration);
}
// attach event listeners to events to reset the inactivity timer
document.addEventListener("mousemove", resetInactivityTimer);
document.addEventListener("keydown", resetInactivityTimer);
document.addEventListener("click", resetInactivityTimer);
// start the inactivity timer on page load
document.addEventListener("DOMContentLoaded", resetInactivityTimer);
