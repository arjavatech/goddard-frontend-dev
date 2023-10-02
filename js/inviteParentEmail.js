let title, globalBase64;
AWS.config.update({
        accessKeyId: 'AKIATNZ4QAI6MX5LH34Q',
        secretAccessKey: '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',
        region: 'us-west-2'
    });

const s3 = new AWS.S3();

let obj = {
    "from": "noreply.goddard@gmail.com",
    "to": "noreply.goddard@gmail.com",
    "subject": "subject",
    "body": "You are invited",
    "attachmentName": "AttachmentForm",
    "attachmentKey": "attachment"
}


async function emailSend() {
    try {
        // const base64Data = await getPDFBase64Data();
        // obj.attachmentName = "AttachmentForm";
        // obj.from = "goddard01arjava@gmail.com";
        let email_to =  $('#parent_email').val();
        obj.to = email_to;
        console.log(obj.to);
        obj.subject = 'Invite parents';
        let messageData = $('#messageData').val();
        obj.body = messageData;
        console.log(obj.body);
        console.log(obj);
        const json =JSON.stringify(obj);
        console.log(json);

        // const attachmentKey = await uploadBase64PDFToS3( title + ' CHILD_ID');
        // obj.attachmentKey = attachmentKey;
        $.ajax({
            url: "https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/email/send",
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
                alert("Email sending failed")
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