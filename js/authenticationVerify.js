function checkGmailLoginState() {
    let value = localStorage.getItem('logged_in_email');
    if (value !== null && value !== undefined) {
        // Key has a valid value in localStorage
        console.log(value)
        console.log('Authenticated')
        return true;
    } else {
        // Key does not have a valid value in localStorage
        window.alert("Please login")
        return false;
    }
}

export function isAuthenticated() {
    return checkGmailLoginState();
}