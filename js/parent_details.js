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

async function emailSend(parent_email) {
    try {
       
        $.ajax({
            url: `Environment: https://7jpl4gpmpg.execute-api.ap-south-1.amazonaws.com/dev/parent_invite_mail/resend/${parent_email}`,
            type: "GET",
            success: function (response) {
                $(".success-msg").show();
            },
            error: function (xhr, status, error) {
                $(".error-msg").show();
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

