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
        window.location.href = "parent_dashboard.html";
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

// Email and password validation with particular format
function loginFunction() {
    const email_id = document.getElementById('login_email').value;
    const password = document.getElementById('login_pswd').value;
    if(email_id != '' && password !=''){
        const hashedUserPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
        $.ajax({
        url: `https://jvirbzj4p1.execute-api.us-west-2.amazonaws.com/goddard_test/sign_up/is_admin/${email_id}?password=${hashedUserPassword}`,
        type: "GET",
        success: function (response) {
            console.log(response);
            let isAuthenticated = false;
            if(response.admin === true ){
                $(".success-msg").show();
                    setTimeout(function(){
                   $(".success-msg").hide(); 
                    // isAuthenticated = true;
                    localStorage.setItem('is_admin',response.admin)
                    localStorage.setItem('logged_in_email', email_id);
                    window.location.href = "./admin_dashboard.html"; 
                }, 3000);
                
            }else if (response.admin === false ) {
                $(".success-msg").show();
                setTimeout(function(){
                 $(".success-msg").hide(); 
                    // isAuthenticated = true;
                    // localStorage.setItem('is_admin',response.admin)
                    localStorage.setItem('logged_in_email', email_id);
                    window.location.href = "./parent_dashboard.html";
                }, 3000);
               
            }else{
                $(".error-msg").show();
                setTimeout(function(){ 
                    $(".error-msg").hide(); 
                }, 3000);
            }

            // if (!isAuthenticated) {
            //     // Authentication failed
            //     $(".error-msg").show();
            //         setTimeout(function(){
            //         $(".error-msg").hide(); 
            //     }, 3000);
            //     // let spanMsg = document.getElementById("errorMessage");
            //     // let spanMsgDiv = document.getElementById("errorMessageDiv");
            //     // spanMsgDiv.style.display = "block";
            //     // spanMsg.style.display = "block";
            // }
        },
        error: function (xhr, status, error) {
            $(".error-msg").show();
            setTimeout(function(){ 
            $(".error-msg").hide(); 
            }, 3000);
            // console.log(error);
            // let spanMsg = document.getElementById("errorMessage");
            // let spanMsgDiv = document.getElementById("errorMessageDiv");
            // spanMsgDiv.style.display = "block";
            // spanMsg.style.display = "block";
        }
    });
    }else{
        // alert('fill the form');
        $(".error-msg-empty").show();
            setTimeout(function(){
            $(".error-msg-empty").hide(); 
        }, 3000);
    }
}

$(document).ready(function () {
    $("#loginButton").on("click", function (e) {
        e.preventDefault(); // Prevent the default form submission
        loginFunction();
    });
});
