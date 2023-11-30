import {fetchEnrollmentFormTitle, fetchEnrollmentFormBody} from './enrollmentForm.js'

let title, globalBase64;

let obj = {
    "from": "noreply.goddard@gmail.com",
    "to": "noreply.goddard@gmail.com",
    "subject": "subject",
    "body": "message data",
    "attachmentName": "AttachmentForm",
    "attachmentKey": "attachments/Test.pdf"
}

async function emailSend() {
    try {
        let messageData = $('#messageData').val();
        obj.body = messageData;
        $.ajax({
               url: " https://6flxkkqvr4.execute-api.us-west-2.amazonaws.com/dev/email/send",
               type: "POST",
               contentType: "application/json",
               data: JSON.stringify(obj),
               success: function (response) {
                   alert("Email Sent Successfully")
                   let modal = document.querySelector('.modal');
                   let bootstrapModal = bootstrap.Modal.getInstance(modal);
                   bootstrapModal.hide();
               },
               error: function (xhr, status, error) {  
                   alert("Email sending failed")
               }
           });  
    } catch (error) {
        console.error('Error:', error);
    }
}

$(document).ready(function () {
    $('#sendButton').click(function () {
        console.log('xfvdfvds');
        fetchEnrollmentFormTitle(function () {
            fetchEnrollmentFormBody(function () {
                emailSend();
                // Clear the text area
                $('#staticBackdrop').on('show.bs.modal', function() {
                    $('#messageData').val('');
                });
            });
        });
    });
})