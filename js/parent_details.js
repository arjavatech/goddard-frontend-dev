'use strict';

let title, globalBase64;
let obj = {
    "from": "noreply.goddard@gmail.com",
    "to": "noreply.goddard@gmail.com",
    "subject": "subject",
    "body": "You are invited",
    "attachmentName": "AttachmentForm",
    "attachmentKey": "attachment"
}

async function emailSend(child_full_name,parent_name,
    parent_email) {
    try {
        const obj = {};
        obj.child_full_name = child_full_name;
        obj.parent_name = parent_name;
        obj.parent_email = parent_email;
        obj.from = "noreply.goddard@gmail.com";
        obj.to = parent_email;
        obj.subject = 'Invite parents';
        obj.body = "";
        const json =JSON.stringify(obj);
        console.log(json);

        $.ajax({
            url: "https://jvirbzj4p1.execute-api.us-west-2.amazonaws.com/goddard_test/email/resend",
            type: "POST",
            contentType: "application/json",
            data: json,
            success: function (response) {
                $(".success-msg").show();
                setTimeout(function(){ 
                    $(".success-msg").hide(); 
                    window.location.reload();
                }, 3000);
                // alert("Email Sent Successfully");
                // window.location.reload();
            },
            error: function (xhr, status, error) {
                $(".error-msg").show();
                setTimeout(function(){ 
                    $(".error-msg").hide(); 
                }, 3000);
                // console.log(xhr);
                // console.log(status);
                // console.log(error);
                // alert("Email sending failed")
            }
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

function applicationStatusYear(val) {
    localStorage.setItem('form_year_value', val);
    let applicationStatusYear = document.getElementById("applicationStatusYear");
    applicationStatusYear.textContent = val;
}

document.addEventListener("DOMContentLoaded", function () {
    document.body.style.visibility = 'visible';
    let defaultdate = new Date().getFullYear();
    // parentDashBoardDetails(defaultdate);
    applicationStatusYear(defaultdate);
    // applicationStatusAllYear();
});

