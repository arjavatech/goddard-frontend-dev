
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
let admission_form = document.getElementById('admission_form');
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
        let parent_email = $('#parent_one_email').val();
        obj.to =parent_email;
        let messageData = $('#messageData').val();
        obj.body = messageData;
        console.log(obj);
        const json =JSON.stringify(obj);
        console.log(json);


        const form = document.getElementById("admission_form");
        console.log(form);
        const formData = new FormData(form);
        console.log(formData);
        // const inviteParentData = new FormData(formData);
        const inviteParentData = Object.fromEntries(formData);
        console.log(inviteParentData);
        const json1 = JSON.stringify(inviteParentData);
        console.log(json1);

        $.ajax({
               url: "https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/email/send",
               type: "Options",
               contentType: "application/json",
               data: json,
               success: function (response) {
                   alert("Email Sent Successfully")
                   $.ajax({
                    url: "https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/invite_info/add",
                    type: "POST",
                    contentType: "application/json",
                    data: json1,
                    success: function (response1) {
                        alert("data submitted successfully");
                        window.location.href = "admin_dashboard.html";
                    },
                    error: function (xhr, status, error) {
                        alert("form submit failed");
                    }
                });
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