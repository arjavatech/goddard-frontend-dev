import {fetchEnrollmentFormTitle, fetchEnrollmentFormBody} from './enrollmentForm.js'

let title, globalBase64;



AWS.config.update({
                      accessKeyId: 'AKIATNZ4QAI6MX5LH34Q',
                      secretAccessKey: '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',
                      region: 'us-west-2'
                  });

const s3 = new AWS.S3();

let obj = {
    "from": "raghuls.official@gmail.com",
    "to": "raghul1998@gmail.com",
    "subject": "qwerty",
    "body": "message data",
    "attachmentName": "AttachmentForm",
    "attachmentKey": "attachments/Test.pdf"
}

async function uploadBase64PDFToS3(base64String, fileName) {
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    const params = {
        Bucket: 'goddard-form',
        Key: 'attachments/' + fileName,
        Body: blob,
        ContentType: 'application/pdf'
    };

    try {
        const data = await s3.upload(params).promise();
        return data.Key;
    } catch (error) {
        throw new Error('Error uploading attachment: ' + error.message);
    }
}

async function getPDFBase64Data() {
    console.log("Base64");
    const {jsPDF} = window.jspdf;
    const doc = new jsPDF('p', 'mm', [1500, 1400]);
    let formContent = document.querySelector('#formContent');
    formContent.style.display = 'block';

    const headingElement = document.querySelector('#heading');
    title = headingElement.textContent;

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
        obj.subject = 'Query on ' + title;
        let messageData = $('#messageData').val();
        console.log(messageData);
        obj.body = messageData;

        const attachmentKey = await uploadBase64PDFToS3(base64Data, title + ' CHILD_ID');
        obj.attachmentKey = attachmentKey;
        console.log(obj);
        $.ajax({
               url: "https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/email/send",
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

// function emailSend() {
//     getPDFBase64Data()
//         .then((base64Data) => {
//             // Use the base64Data as needed
//             obj.attachmentBase64 = base64Data;
//         })
//         .catch((error) => {
//             console.error('Error:', error);
//         });
//
//
//     obj.attachmentName = title;
//     obj.subject = "Query on " + title;
//     let messageData = $("#messageData").val();
//     console.log(messageData)
//     obj.body = messageData;
//
//     console.log(obj);
//
//     $.ajax({
//                url: "https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/email/send",
//                type: "POST",
//                contentType: "application/json",
//                data: JSON.stringify(obj),
//                success: function (response) {
//                    alert("Email Sent Successfully")
//                    let modal = document.querySelector('.modal');
//                    let bootstrapModal = bootstrap.Modal.getInstance(modal);
//                    bootstrapModal.hide();
//                },
//                error: function (xhr, status, error) {
//                    alert("Email sending failed")
//                }
//            });
// }


// function emailSend() {
//     console.log(obj)
//     $.ajax({
//                url: "https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/email/send",
//                type: "POST",
//                contentType: "application/json",
//                data: JSON.stringify(obj),
//                success: function (response) {
//                    alert("Email Sent Successfully")
//                    let modal = document.querySelector('.modal');
//                    let bootstrapModal = bootstrap.Modal.getInstance(modal);
//                    bootstrapModal.hide();
//                },
//                error: function (xhr, status, error) {
//                    alert("Email sending failed")
//                }
//            });
// }

$(document).ready(function () {
    $('#sendButton').click(function () {
        console.log("Email controller")
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