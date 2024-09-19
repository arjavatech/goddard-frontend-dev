
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
    let email_id = document.getAnimations('email_id').value;
    var password1 = document.getElementById('reset_pswd').value;
    var password2 = document.getElementById('password').value;

    if (email_id != '' && password1 !='' && password2 !=''){
        // Check if passwords match
        if (password1 === password2) {
            const form = document.getElementById("reset_password");
            const formData = new FormData(form);
            const password = formData.get("password");
            // Hash the password
            const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
            
            // Replace the original password with the hashed password in the form data
            formData.set("password", hashedPassword);
            const obj = Object.fromEntries(formData);
            $.ajax({
                url: "https://ijz2b76zn8.execute-api.ap-south-1.amazonaws.com/test/sign_up/password_reset",
                type: "POST",
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
$(document).ready(function () {
    $("#resetButton").on("click", function (e) {
        e.preventDefault(); // Prevent the default form submission
        signupFunction();
    });
});

