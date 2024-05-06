function handleCredentialResponse(response) {
    const responsePayload = decodeJwtResponse(response.credential);
    // console.log("ID: " + responsePayload.sub);
    // console.log('Full Name: ' + responsePayload.name);
    // console.log('Given Name: ' + responsePayload.given_name);
    // console.log('Family Name: ' + responsePayload.family_name);
    // console.log("Image URL: " + responsePayload.picture);
    console.log("Email: " + responsePayload.email);
    // responsePayload.email ="admin1@gmail.com";
    // Store email
    localStorage.clear()
    localStorage.setItem('logged_in_email', responsePayload.email);
    if(responsePayload.email == "goddard01arjava@gmail.com" || responsePayload.email == "goddard02arjava@gmail.com" || responsePayload.email == 's_kaliappan@hotmail.com'){
        // Redirect
        window.location.href = "admin_dashboard.html";
    }else{
        // Redirect
        window.location.href = "parent_dashborad.html";
    }
    
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

