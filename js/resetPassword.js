
function validatePassword() {
    var password1 = document.getElementById('reset_pswd').value;
    var password2 = document.getElementById('password').value;
    // Retrieve password input values
    if (password1 === password2) {
        document.getElementById("errorMessage").style.display = "none";
        document.getElementById("errorMessageDiv").style.display = "none";
    }else{
        document.getElementById("errorMessage").style.display = "block";
        document.getElementById("errorMessageDiv").style.display = "block";
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
    var password1 = document.getElementById('reset_pswd').value;
    var password2 = document.getElementById('password').value;

    // Check if passwords match
    if (password1 === password2) {
        document.getElementById("errorMessage").style.display = "none";
        document.getElementById("errorMessageDiv").style.display = "none";
        const form = document.getElementById("reset_password");
        const formData = new FormData(form);
        const password = formData.get("password");
        // Hash the password
        const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
        console.log(hashedPassword);
        
        // Replace the original password with the hashed password in the form data
        formData.set("password", hashedPassword);
        const obj = Object.fromEntries(formData);
        console.log(obj);
        $.ajax({
            url: "https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/login/add",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(obj),
            success: function (response) {
                alert("Reseted Your Password successfully ");
                window.location.href = "login.html";
            
            },
            error: function (xhr, status, error) {
                alert("failed to reset");
            }
        });
    } else {
        document.getElementById("errorMessage").style.display = "block";
        document.getElementById("errorMessageDiv").style.display = "block";
        // Display an error message
        // alert("Passwords do not match!");
        
    }

}
$(document).ready(function () {
    $("#resetButton").on("click", function (e) {
        e.preventDefault(); // Prevent the default form submission
        signupFunction();
    });
});

