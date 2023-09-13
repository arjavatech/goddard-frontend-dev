
let title, globalBase64;
AWS.config.update({
                      accessKeyId: 'AKIATNZ4QAI6MX5LH34Q',
                      secretAccessKey: '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',
                      region: 'us-west-2'
                  });

const s3 = new AWS.S3();

var parent_email;
let email = $('#parent_email').val();
console.log(email);
let obj = {
    "from": "noreply.goddard@gmail.com",
    "to": `${email}`,
    "subject": "subject",
    "body": "message data",
}
console.log(obj);

async function emailSend() {
    try {
        obj.subject = 'invite parent';
        let parent_email = $('#parent_email').val();
        console.log(parent_email);
        obj.to =parent_email;
        let messageData = $('#messageData').val();
        console.log(messageData);
        obj.body = messageData;
        console.log(obj);
        $.ajax({
               url: "https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/email/send",
               type: "OPTIONS",
               contentType: "application/json",
               data: JSON.stringify(obj),
               success: function (response) {
                   alert("Email Sent Successfully")
                   window.location.href = "admin_dashboard.html";
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
        emailSend();
        // Clear the text area
        $('#staticBackdrop').on('show.bs.modal', function() {
            $('#messageData').val('');
        });
    });
})