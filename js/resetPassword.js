function validatePassword() {
    // Retrieve password input values
    var password1 = document.getElementById('reset_pswd').value;
    var password2 = document.getElementById('password').value;

    // Check if passwords match
    if (password1 === password2) {
        document.getElementById('reset_password_span').style.display = "none";
        return true; // Allow form submission
    } else {
        document.getElementById('reset_password_span').style.display = "block";
        // Display an error message
        // alert("Passwords do not match!");
        return false; // Prevent form submission
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

