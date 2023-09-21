import {signOut,isAuthenticated} from "./authenticationVerify.js";

// Signout button event listener
document.getElementById('btn-signout').addEventListener('click', signOut);

// Function to submit the form data
function saveForm() {

    const form = document.getElementById("admission_form");
    const formData = new FormData(form);
    const obj = Object.fromEntries(formData);
    console.log(obj);
    // const json=  JSON.stringify(obj);
    // console.log(json);
    $.ajax({
        url: "https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/invite_info/add",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(obj),
        success: function (response) {
            console.log(response);
            // window.location.href = "admin_dashboard.html";
            // alert("form submitted successfully");
        },
        error: function (xhr, status, error) {
            console.log(error);
            alert("form submit failed");
        }
    });
}

$(document).ready(function () {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
    } else {
        document.body.style.visibility = 'visible';
        $("#saveButton").on("click", function (e) {
            e.preventDefault(); // Prevent the default form submission
            const emailButton = document.getElementById("emailButtonDiv");
            console.log(emailButton);
            emailButton.style.display ="block";
            saveForm();
        });
    }
});

