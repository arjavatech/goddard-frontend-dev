
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
            const hashedPassword = CryptoJS.SHA256(password2).toString(CryptoJS.enc.Hex);
            const obj = {};
            obj.email = email_id;
            obj.password = hashedPassword;
            // console.log(obj);
            // return false;
            $.ajax({
                url: "https://ijz2b76zn8.execute-api.ap-south-1.amazonaws.com/test/parent_info/update_password",
                type: "PUT",
                contentType: "application/json",
                data: JSON.stringify(obj),
                success: function (response) {
                    if(response.message == "User not found"){
                        $(".error-msg-notfound").show();
                        setTimeout(function(){ 
                            $(".error-msg-notfound").hide(); 
                        }, 3000);
                    }else{
                        $(".success-msg-reset").show();
                        setTimeout(function(){ 
                            $(".success-msg-reset").hide(); 
                            window.location.href = "login.html";
                        }, 3000);
                    }
                },
                error: function() {
                    // Handle AJAX errors
                    $(".error-msg-notfound").show();
                    setTimeout(function(){ 
                        $(".error-msg-notfound").hide(); 
                    }, 3000);
                }
            });
        } else {
            $(".error-msg-mismatch").show();
            setTimeout(function(){ 
                $(".error-msg-mismatch").hide(); 
            }, 3000);
        }
    }else{
        $(".error-msg-empty").show();
        setTimeout(function(){ 
            $(".error-msg-empty").hide(); 
        }, 3000);
    }

}
// Send Email
function resendmailFunction(){
    let email_id = document.getElementById('email_id').value;
    if (email_id != ''){
        $.ajax({
            url: `https://ijz2b76zn8.execute-api.ap-south-1.amazonaws.com/test/forget_password_mail_trigger/${email_id}`,
            type: "GET",
            dataType: 'json',
            success: function (response) {
                console.log(response)
                if(response.message == "Password reset email sent successfully!"){
                    $(".forget-success-msg").show();
                    setTimeout(function(){ 
                        $(".forget-success-msg").hide(); 
                        window.location.href = "send_resetmail.html";
                    }, 3000);
                }else if(response.error == "SignUpInfo with email_id dhfjsdh@gmail.com not found"){
                    $(".error-msg-notfound").show();
                    setTimeout(function(){ 
                        $(".error-msg-notfound").hide(); 
                    }, 3000);
                }
            },
            error: function() {
                // Handle AJAX errors
                $(".error-msg-notfound").show();
                setTimeout(function(){ 
                    $(".error-msg-notfound").hide(); 
                }, 3000);
            }
        });
    
    }else{
        $(".error-msg-empty").show();
        setTimeout(function(){ 
            $(".error-msg-empty").hide(); 
        }, 3000);
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

