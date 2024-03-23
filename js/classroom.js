import {isAuthenticated} from "./authenticationVerify.js";


// Function to submit the form data
function submitForm() {
    const form = document.getElementById("childInfoAdmission");
    const formData = new FormData(form);
    const obj = Object.fromEntries(formData);
    const json = JSON.stringify(obj);
    console.log(json);
    $.ajax({
        url: "http://localhost:8080/admission_child_personal/modify",
        type: "PUT",
        contentType: "application/json",
        data: json,
        success: function (response) {
            alert(response.message)
            $(".success-msg-save").show();
                setTimeout(function(){
                $(".success-msg-save").hide();
                 window.location.reload();
                // window.location.href = 'child_add.html';
            }, 3000);  
        },
        error: function (xhr, status, error) {
            alert("failed to save admission form");
        }
    });
}

$(document).ready(function () {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
    } else {
        document.body.style.visibility = 'visible';
        $(document).on("click", ".submit-btn", function(e) {
            e.preventDefault();
            submitForm(editChildID);
        });
    }
});




