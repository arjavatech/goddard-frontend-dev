function checkGmailLoginState() {
    let value = localStorage.getItem('logged_in_email');
    if (value !== null && value !== undefined) {
        // Key has a valid value in localStorage
        return true;
    } else {
        // Key does not have a valid value in localStorage
        let val = localStorage.getItem('isSignout');
        // Remove the key after getting the value
        localStorage.removeItem('isSignout');
        if (val !== null && val !== undefined) {
            if(val !== 'yes') {
                window.alert("Please login")
            }
        } else {
            window.alert("Please login")
        }
        return false;
    }
}

export function isAuthenticated() {
    return checkGmailLoginState();
}


function clearCookie(cookieName) {
    document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

function clearAllCookies() {
    const cookies = document.cookie.split("; ");
    for (let i = 0; i < cookies.length; i++) {
        const cookieParts = cookies[i].split("=");
        const cookieName = cookieParts[0];
        clearCookie(cookieName);
    }
}

// Function to perform logout/sign out
export function signOut() {
    // Clear session data and perform cleanup tasks as needed
    localStorage.clear()
    localStorage.setItem('isSignout', 'yes')
    // Check if session is present
    if (sessionStorage.length > 0) {
        // Clear the session
        sessionStorage.clear();
        console.log('Session cleared.');
    } else {
        console.log('No session found.');
    }
    // Clear cookies
    clearAllCookies();
    // Reload the page to ensure cache is cleared and the user is redirected
    window.location.reload();
}