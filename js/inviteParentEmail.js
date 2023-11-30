let title, globalBase64;
let obj = {
    "from": "noreply.goddard@gmail.com",
    "to": "noreply.goddard@gmail.com",
    "subject": "subject",
    "body": "",
    // "attachmentName": "AttachmentForm",
    // "attachmentKey": "attachment"
}


async function emailSend() {
    try {
        // const base64Data = await getPDFBase64Data();
        // obj.attachmentName = "AttachmentForm";
        // obj.from = "goddard01arjava@gmail.com";

        const form = document.getElementById("admission_form");
        const formData = new FormData(form);
        const obj = Object.fromEntries(formData);
        // obj.year = new Date().getFullYear() + '';
        // console.log(obj);

        obj.from = "noreply.goddard@gmail.com";
        let email_to =  $('#parent_email').val();
        obj.to = email_to;
        obj.subject = 'Invite parents';
        // let messageData = $('#messageData').val();
        obj.body = "";
        console.log(obj.body);
        // obj.attachmentName ="AttachmentForm";
        // obj.attachmentKey ="attachment";
        const json =JSON.stringify(obj);
        console.log(json);

        // const attachmentKey = await uploadBase64PDFToS3( title + ' CHILD_ID');
        // obj.attachmentKey = attachmentKey;
        $.ajax({
            url: " https://6flxkkqvr4.execute-api.us-west-2.amazonaws.com/dev/email/send",
            type: "POST",
            contentType: "application/json",
            data: json,
            success: function (response) {
                alert("Email Sent Successfully");
                window.location.reload();
            },
            error: function (xhr, status, error) {
                console.log(xhr);
                console.log(status);
                console.log(error);
                alert("Email sending failed");
            }
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

$(document).ready(function () {
    $('#sendButton').click(function () {
        console.log('checking email send');
        emailSend();
    });
})