let title, globalBase64;
AWS.config.update({
        accessKeyId: 'AKIATNZ4QAI6MX5LH34Q',
        secretAccessKey: '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',
        region: 'us-west-2'
    });

const s3 = new AWS.S3();

let obj = {
    "from": "goddard01arjava@gmail.com",
    "to": "aarthi.arjav@gmail.com",
    "subject": "subject",
    "body": "message data",
    // "attachmentName": "AttachmentForm",
    // "attachmentKey": "attachments/Test.pdf"
}

function emailSend() {
    try {
        // const base64Data = await getPDFBase64Data();
        // obj.attachmentName = "AttachmentForm";
        let parent_email = $('#parent_one_email').val();
        console.log(parent_email);
        obj.to =parent_email;
        obj.subject = 'Invite parents';
        let messageData = $('#messageData').val();;
        obj.body = messageData;

        // const attachmentKey = await uploadBase64PDFToS3(base64Data, title + ' CHILD_ID');
        // obj.attachmentKey = attachmentKey;
        const json =JSON.stringify(obj);
        console.log(json);
        $.ajax({
               url: "https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/email/send",
               type: "POST",
               contentType: "application/json",
               data: json,
               success: function (response) {
                   alert("Email Sent Successfully")
                //    let modal = document.querySelector('.modal');
                //    $('#mailbox').modal('hide');
                //    let bootstrapModal = bootstrap.Modal.getInstance(modal);
                //    bootstrapModal.hide();
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
        // fetchEnrollmentFormTitle(function () {
        //     fetchEnrollmentFormBody(function () {
                emailSend();
                // Clear the text area
        //         $('#staticBackdrop').on('show.bs.modal', function() {
        //             $('#messageData').val('');
        //         });
        //     });
        // });
    });
})