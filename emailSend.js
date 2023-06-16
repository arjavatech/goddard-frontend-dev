import {fetchEnrollmentFormTitle, fetchEnrollmentFormBody} from './enrollmentForm.js'

let title, globalBase64;

let obj = {
    "from": "raghuls.official@gmail.com",
    "to": "raghul1998@gmail.com",
    "subject": "",
    "body": "",
    "attachmentName": "",
    "attachmentKey": ""
}

AWS.config.update({
                      accessKeyId: 'AKIA3FPYZADUQ6XJ7K3X',
                      secretAccessKey: '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',
                      region: 'ap-south-1'
                  });

const s3 = new AWS.S3();

async function uploadBase64PDFToS3(base64String, fileName) {
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    const params = {
        Bucket: 'goddard-forms',
        Key: 'attachments/' + fileName,
        Body: blob
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
//                url: "https://f64ff4v9wh.execute-api.ap-south-1.amazonaws.com/godd/email/send",
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
            });
        });
    });
})