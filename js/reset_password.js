
function validatePassword() {
    var password1 = document.getElementById('reset_pswd').value;
    var password2 = document.getElementById('password').value;
    // Retrieve password input values
    if (password1 !== password2) {
        $(".error-msg-mismatch").show();
        setTimeout(function(){ 
            $(".error-msg-mismatch").hide(); 
        }, 3000);
    }
}


//email validation with particular format
function emailValidation(inputtxtID,errorSpanID) {
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (reg.test(inputtxtID.value) == true) {
        document.getElementById(errorSpanID).style.display = "none";
    } else if(inputtxtID.value == ''){
        document.getElementById(errorSpanID).style.display = "none";
    } else {
        document.getElementById(errorSpanID).style.display = "block";
        inputtxtID.focus();
    }
}

function signupFunction(){
    let email_id = document.getElementById('email_id').value;
    var password1 = document.getElementById('reset_pswd').value;
    var password2 = document.getElementById('password').value;

    if (email_id != '' && password1 !='' && password2 !=''){
        // Check if passwords match
        if (password1 === password2) {
            // Hash the password
            let signupInvite = window.location.search.slice(11);
            const hashedPassword = CryptoJS.SHA256(password2).toString(CryptoJS.enc.Hex);
            const obj = {};
            obj.email = email_id;
            obj.password = hashedPassword;
            obj.signup_url = `https://arjavatech.github.io/reset_password.html?invite_id=${signupInvite}`;
            // console.log(obj);
            // return false;
            $.ajax({
                url: "https://7jpl4gpmpg.execute-api.ap-south-1.amazonaws.com/dev/parent_info/update_password",
                type: "PUT",
                contentType: "application/json",
                data: JSON.stringify(obj),
                success: function (response) {
                    // console.log(response)
                    // console.log(JSON.stringify(obj))
                    // return false 
                    if(response.error == `Parent info with email_id ${email_id} not found or Signup url is invalid`){
                        $(".error-msg-notfound").show();
                    }else if(response.message == `Parent Info with email_id ${email_id} password updated successfully`){
                        $(".success-msg-reset").show();
                    } else if(response.error == "Forget password url was expired!!!"){
                        $(".error-msg").show();
                    } else {
                        $(".error-msg-notfound").show();
                    }
                },
                error: function() {
                    // Handle AJAX errors
                    $(".error-msg-notfound").show();
                }
            });
        } else {
            $(".error-msg-mismatch").show();
        }
    }else{
        $(".error-msg-empty").show();
    }

}
// Send Email
function resendmailFunction(){
    let email_id = document.getElementById('email_id').value;
    if (email_id != ''){
        $.ajax({
            url: `https://7jpl4gpmpg.execute-api.ap-south-1.amazonaws.com/dev/forget_password_mail_trigger/${email_id}`,
            type: "GET",
            dataType: 'json',
            success: function (response) {
                console.log(response)
                if(response.message == "Password reset email sent successfully!"){
                    $(".forget-success-msg").show();
                }else if(response.error == `SignUpInfo with email_id ${email_id} not found`){
                    $(".error-msg-notfound").show();
                } else if(response.error == "We have already sent the password reset page URL to your email. Please check your inbox."){
                    $(".error-msg-alreadyexists").show();
                }else{
                    $(".error-msg-notfound").show();
                }
            },
            error: function() {
                // Handle AJAX errors
                $(".error-msg-notfound").show();
            }
        });
    
    }else{
        $(".error-msg-empty").show();
    }

}


$(document).ready(function () {
    $("#resetButton").on("click", function (e) {
        e.preventDefault(); // Prevent the default form submission
        signupFunction();
    });

    $("#mailsendButton").on("click", function (e) {
        e.preventDefault(); // Prevent the default form submission
        resendmailFunction();
    });
});

