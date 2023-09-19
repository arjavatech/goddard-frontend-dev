import {signOut,isAuthenticated} from "./authenticationVerify.js";

// Signout button event listener
document.getElementById('btn-signout').addEventListener('click', signOut);

// Function to submit the form data
function submitForm() {
    const form = document.getElementById("admission_form");
    const formData = new FormData(form);
    const obj = Object.fromEntries(formData);
    const enformData = new FormData(form);
  
    // const json=  JSON.stringify(obj);
    // $.ajax({
    //     url: "https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/admission/add",
    //     type: "POST",
    //     contentType: "application/json",
    //     data: JSON.stringify(obj),
    //     success: function (response) {
    //         window.location.href = "admin_dashboard.html";
    //     },
    //     error: function (xhr, status, error) {
    //         alert("form submit failed");
    //     }
    // });
}

$(document).ready(function () {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
    } else {
        document.body.style.visibility = 'visible';
        // $("#submit_button").on("click", function (e) {
        //     e.preventDefault(); // Prevent the default form submission
        //     submitForm();
        // });
    }
});

