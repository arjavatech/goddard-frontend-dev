console.log('invite parent');
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
    "from": "goddard01arjava@gmail.com",
    "to": "aarthi.arjava@gmail.com",
    "subject": "subject",
    "body": "message data",
    "attachmentName": "AttachmentForm",
    "attachmentKey": "attachments/Test.pdf"
}
console.log(obj);

async function uploadBase64PDFToS3(base64String, fileName) {
    const byteCharacters = atob(base64String);
    console.log(byteCharacters);
    const byteNumbers = new Array(byteCharacters.length);
    console.log(byteNumbers);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    console.log(byteArray);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    console.log(blob);

    const params = {
        Bucket: 'goddard-form',
        Key: 'attachments/' + fileName,
        Body: blob,
        ContentType: 'application/pdf'
    };
    console.log(params);

    try {
        const data = await s3.upload(params).promise();
        return data.Key;
    } catch (error) {
        throw new Error('Error uploading attachment: ' + error.message);
    }
}

async function getPDFBase64Data() {
    // console.log("Base64");
    const {jsPDF} = window.jspdf;
    const doc = new jsPDF('p', 'mm', [1500, 1400]);
    // let formContent = document.querySelector('#formContent');
    // formContent.style.display = 'block';

    const headingElement = document.querySelector('#heading');
    title = headingElement.textContent;
    console.log(title);

    return new Promise((resolve, reject) => {
        doc.html(formContent, {
            callback: function (doc) {
                const pdfData = doc.output('datauristring');
                const base64Data = pdfData.split(',')[1];
                resolve(base64Data);
            },
            x: 12,
            y: 12
        });
    }).finally(() => {
        formContent.style.display = 'none';
    })
}

async function emailSend() {
    try {
        const base64Data = await getPDFBase64Data();
        obj.attachmentName = "AttachmentForm";
        obj.subject = 'invite parent';
        let parent_email = $('#parent_one_email').val();
        obj.to =parent_email;
        let messageData = $('#messageData').val();
        obj.body = messageData;

         const attachmentKey = await uploadBase64PDFToS3( title + ' CHILD_ID');
         obj.attachmentKey = attachmentKey;
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
               type: "POST",
               contentType: "application/json",
               data: json,
               success: function (response) {
                   alert("Email Sent Successfully")
                //    let modal = document.querySelector('.modal');
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
        emailSend();
        // Clear the text area
        $('#staticBackdrop').on('show.bs.modal', function() {
            $('#messageData').val('');
        });
    });
})