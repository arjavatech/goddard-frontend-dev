import { fetchEnrollmentFormTitle, fetchEnrollmentFormBody, fetchEnrollmentPointEight } from './enrollmentForm.js';
import { authorizationFormDetails } from './authorization_form.js';

console.log('cgvuygkiut');
function getEnrollmentFormStatus(val, callback) {
    $.ajax({
        url: `https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/enrollment_data/form_status/${localStorage.getItem('child_id')}?year=${val}`,
        type: 'get',
        success: function (form_status_resp) {
            callback(form_status_resp);
        }
    });
}
function downloadPDF(id) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', [1500, 1400]);
    let formContent = id;
    console.log(formContent);
    formContent.style.display = 'block';

    doc.html(formContent, {
        callback: function (doc) {
            doc.save("output.pdf");
            formContent.style.display = 'none';
        },
        x: 12,
        y: 12
    });
}

function generatePDFContent(id) {
    return new Promise((resolve) => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', [1500, 1400]);
        let formContent = id;
        formContent.style.display = 'block';

        doc.html(formContent, {
            callback: function () {
                formContent.style.display = 'none';
                resolve(doc);
            },
            x: 12,
            y: 12
        });
    });
}

async function printForm(id) {
    const pdfDoc = await generatePDFContent(id);
    // Create an object URL for the PDF blob
    const pdfUrl = URL.createObjectURL(pdfDoc.output('blob'));
    // Open a new window or tab for printing
    const printWindow = window.open(pdfUrl, '_blank');
    // Wait for the print window to load
    printWindow.onload = function() {
        // Trigger the print dialog
        printWindow.document.body.style.webkitPrintColorAdjust = 'exact';
        printWindow.document.body.style.zoom = '100%';
        printWindow.print();
        // Release the object URL
        URL.revokeObjectURL(pdfUrl);
    };
}

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
    // console.log("Base64");
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

async function emailSend(id) {
    try {
        const base64Data = await getPDFBase64Data();
        obj.attachmentName = "AttachmentForm";
        obj.subject = 'Query on ' + title;
        let messageData = id.val();
        obj.body = messageData;

        const attachmentKey = await uploadBase64PDFToS3(base64Data, title + ' CHILD_ID');
        obj.attachmentKey = attachmentKey;
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

function parentDashBoardDetails(val) {
    localStorage.setItem('form_year_value', val);
    $.ajax({
        url: `https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/dashboard_data/formByYear/${val}`,
        type: 'get',
        success: function (response) {
            console.log(response);
            if (Array.isArray(response) && response.length > 0) {
                getEnrollmentFormStatus(val, function (formStatusResp) {
                    let form_status = formStatusResp.form_status;
                    const tableBody = document.getElementById('tableBody');

                    // Clear the existing table row
                    tableBody.innerHTML = '';

                    response.forEach(data => {
                        const newRow = document.createElement('tr');

                        // Create and append cells for each data point
                        const formNameCell = document.createElement('td');
                        formNameCell.innerText = data.form_name;

                        const formExpiryDateCell = document.createElement('td');
                        formExpiryDateCell.innerText = data.form_expiry_date;

                        const formStatusCell = document.createElement('td');
                        formStatusCell.setAttribute('id','form_status');
                         formStatusCell.innerText = form_status;
                        if (form_status === "Yet To Be Filled") {
                            formStatusCell.innerText = form_status;
                           formStatusCell.style.color =
                                '#0F2D52';
                           formStatusCell.style.fontWeight =
                                'bold';
                            // enableAction();
                        } else if (form_status === "Completed") {
                            formStatusCell.innerText = form_status;
                           formStatusCell.style.color = 'green';
                           formStatusCell.style.fontWeight =
                                'bold';
                            // disableAction();
                        } else if (form_status === "Incomplete") {
                            formStatusCell.innerText = form_status;
                           formStatusCell.style.color = 'red';
                           formStatusCell.style.fontWeight =
                                'bold';
                            // enableAction();
                        } else {
                            formStatusCell.innerText = form_status;
                           formStatusCell.style.color =
                                '#FFCC00';
                           formStatusCell.style.fontWeight =
                                'bold';
                            // enableAction();
                        }

                        // Create a cell for action items
                        const actionCell = document.createElement('td');

                        // Add action buttons to the action cell
                        const editLink = document.createElement('a');
                        editLink.setAttribute('id','pencil_icon_link');
                        editLink.setAttribute('name','pencil_icon_link');
                        editLink.setAttribute('data-dynamic-value','example');
                        editLink.setAttribute('class','fa-stack');
                        var dynamicValue = localStorage.getItem('child_id');
                        if(data.form_name == '2023-2024 Enrollment Agreement'){
                            console.log('enroll');
                            editLink.href = `form.html?id=${dynamicValue}`;
                        }else if(data.form_name == 'ACH Recurring payments form') {
                            console.log('svg');
                            editLink.href = `authorization_form.html?id=${dynamicValue}`;
                        }
                        
                        editLink.setAttribute('data-dynamic-value', 'example');

                        
                        // ... Add other attributes and content for editLink

                        const editIcon = document.createElement('i');
                        editIcon.setAttribute('id','enrollmentForm');
                        editIcon.setAttribute('name','enrollmentForm');
                        editIcon.className = 'fa-sharp fa-solid fa-pen p-1 action-icons';
                        // ... Add other attributes and content for editIcon

                        const downloadIcon = document.createElement('i');
                        downloadIcon.setAttribute('id', 'downloadFormAsPDF');
                        downloadIcon.setAttribute('name', 'downloadForm');
                        downloadIcon.className = 'fa-solid fa-circle-arrow-down p-2 action-icons';
                        // ... Add other attributes and content for downloadIcon
                        downloadIcon.addEventListener('click',function(){
                            if(data.form_name == '2023-2024 Enrollment Agreement'){
                                fetchEnrollmentFormTitle(function() {
                                    fetchEnrollmentFormBody(function() {
                                        fetchEnrollmentPointEight(function(){
                                            let formContent = document.querySelector('#formContent');
                                            downloadPDF(formContent);
                                        }); 
                                    });
                                });
                            }else if(data.form_name == 'ACH Recurring payments form') {
                                authorizationFormDetails(function() {
                                    let avfForm = document.querySelector('#avf_form');
                                    downloadPDF(avfForm);
                                });
                            }

                        });

                        const mailSpan = document.createElement('span');
                        mailSpan.setAttribute('data-bs-toggle', 'modal');
                        mailSpan.setAttribute('data-bs-target', '#staticBackdrop');
                        // ... Add other attributes and content for mailSpan

                        // Create the Mail Icon <i> element
                        const mailIcon = document.createElement('i');
                        mailIcon.className = 'fa-solid fa-envelope p-1 action-icons';
                        mailIcon.id = 'mail_icon';
                        mailIcon.name = 'mail_icon';

                        // Append the Mail Icon to the Mail Icon <span>
                        mailSpan.appendChild(mailIcon);

                        // Create the Mail Popup Modal
                        const modalDiv = document.createElement('div');
                        modalDiv.className = 'modal fade';
                        modalDiv.id = 'staticBackdrop';
                        modalDiv.setAttribute('data-bs-backdrop', 'static');
                        modalDiv.setAttribute('data-bs-keyboard', 'false');
                        modalDiv.tabIndex = '-1';
                        modalDiv.setAttribute('aria-labelledby', 'staticBackdropLabel');
                        modalDiv.setAttribute('aria-hidden', 'true');

                        // Create the Modal Dialog
                        const modalDialogDiv = document.createElement('div');
                        modalDialogDiv.className = 'modal-dialog';

                        // Create the Modal Content
                        const modalContentDiv = document.createElement('div');
                        modalContentDiv.className = 'modal-content';

                        // Create the Modal Header
                        const modalHeaderDiv = document.createElement('div');
                        modalHeaderDiv.className = 'modal-header';

                        // Create the Modal Title
                        const modalTitle = document.createElement('h1');
                        modalTitle.className = 'modal-title fs-5';
                        modalTitle.id = 'staticBackdropLabel';
                        modalTitle.textContent = 'Mail Send to Admin';

                        // Create the Close Button
                        const closeButton = document.createElement('button');
                        closeButton.type = 'button';
                        closeButton.className = 'btn-close';
                        closeButton.setAttribute('data-bs-dismiss', 'modal');
                        closeButton.setAttribute('aria-label', 'Close');

                        // Append the Modal Title and Close Button to the Modal Header
                        modalHeaderDiv.appendChild(modalTitle);
                        modalHeaderDiv.appendChild(closeButton);

                        // Create the Modal Body
                        const modalBodyDiv = document.createElement('div');
                        modalBodyDiv.className = 'modal-body';

                        // Create the Form
                        const form = document.createElement('form');
                        form.role = 'form';
                        form.className = 'form-horizontal';

                        // Create the Form Group
                        const formGroupDiv = document.createElement('div');
                        formGroupDiv.className = 'form-group';

                        // Create the Label
                        const label = document.createElement('label');
                        label.className = 'col-lg-2 control-label pt-2';
                        label.textContent = 'Message';

                        // Create the Textarea
                        const textarea = document.createElement('textarea');
                        textarea.rows = '10';
                        textarea.cols = '50';
                        textarea.className = 'form-control';
                        textarea.id = 'messageData';
                        textarea.name = '';
                        
                        // Append the Label and Textarea to the Form Group
                        formGroupDiv.appendChild(label);
                        formGroupDiv.appendChild(textarea);
                        // formGroupDiv.addEventListener('click',function(){
                        //     console.log('hiiiisds');
                        //     mailSpan.modal('show');
                        //     formGroupDiv.focus();

                        // });


                        // Append the Form Group to the Form
                        form.appendChild(formGroupDiv);

                        // Append the Form to the Modal Body
                        modalBodyDiv.appendChild(form);

                        // Create the Modal Footer
                        const modalFooterDiv = document.createElement('div');
                        modalFooterDiv.className = 'modal-footer';

                        // Create the Cancel Button
                        const cancelButton = document.createElement('button');
                        cancelButton.type = 'button';
                        cancelButton.className = 'btn btn-secondary';
                        cancelButton.setAttribute('data-bs-dismiss', 'modal');
                        cancelButton.textContent = 'Cancel';

                        // Create the Send Button
                        const sendButton = document.createElement('button');
                        sendButton.type = 'button';
                        sendButton.id = 'sendButton';
                        sendButton.className = 'btn btn-primary';
                        sendButton.textContent = 'Send';

                        // Append the Cancel and Send Buttons to the Modal Footer
                        modalFooterDiv.appendChild(cancelButton);
                        modalFooterDiv.appendChild(sendButton);

                        // Append the Modal Header, Body, and Footer to the Modal Content
                        modalContentDiv.appendChild(modalHeaderDiv);
                        modalContentDiv.appendChild(modalBodyDiv);
                        modalContentDiv.appendChild(modalFooterDiv);

                        // Append the Modal Content to the Modal Dialog
                        modalDialogDiv.appendChild(modalContentDiv);

                        // Append the Modal Dialog to the Modal
                        modalDiv.appendChild(modalDialogDiv);

                        // Append the entire Mail Popup Modal to the Mail Icon <span>
                        mailSpan.appendChild(modalDiv);
                        sendButton.addEventListener('click',function(){
                            fetchEnrollmentFormTitle(function () {
                                fetchEnrollmentFormBody(function () {
                                    emailSend(modalDiv);
                                   
                                });
                            });

                        });

                        // Now you can append the Mail Icon <span> to your desired location in the DOM
                        // For example, assuming you have a div with id "container":
                        // let containerval = document.createElement('div');
                        // containerval.setAttribute('id','container')
                        // containerval.appendChild(mailSpan);

                        const printIcon = document.createElement('i');
                        printIcon.setAttribute('id','printFormBtn');
                        printIcon.className = 'fa-solid fa-print p-2 action-icons';
                        printIcon.addEventListener('click',function(){
                            if(data.form_name == '2023-2024 Enrollment Agreement'){
                                fetchEnrollmentFormTitle(function() {
                                    fetchEnrollmentFormBody(function() {
                                        fetchEnrollmentPointEight(function(){
                                            let formContent = document.querySelector('#formContent');
                                            printForm(formContent);
                                        }); 
                                    });
                                });
                            }else if(data.form_name == 'ACH Recurring payments form') {
                                authorizationFormDetails(function() {
                                    let avfForm = document.querySelector('#avf_form');
                                    printForm(avfForm);
                                });
                            }
                        });
                        // ... Add other attributes and content for printIcon

                        // Append action items to the action cell
                        actionCell.appendChild(editLink);
                        editLink.appendChild(editIcon);
                        actionCell.appendChild(downloadIcon);
                        actionCell.appendChild(mailSpan);
                        mailSpan.appendChild(mailIcon);
                        actionCell.appendChild(printIcon);

                        // Append cells to the row
                        newRow.appendChild(formNameCell);
                        newRow.appendChild(formExpiryDateCell);
                        newRow.appendChild(formStatusCell);
                        newRow.appendChild(actionCell);

                        // Append the row to the table
                        tableBody.appendChild(newRow);

                        // Apply styling based on form status here as needed
                    });
                });
            }
        }
    });
}



// function parentDashBoardDetails(val) {
//     localStorage.setItem('form_year_value', val);
//     let form_status = 'unknown'
//     $.ajax({
//         url: `https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/dashboard_data/formByYear/${val}`,
//         type: 'get',
//         success: function (response) {
//             console.log(response);
//             if (Array.isArray(response) && response.length > 0) {
//                 getEnrollmentFormStatus(val, function (formStatusResp) {
//                     form_status = formStatusResp.form_status;
//                     response.forEach(data => {
//                         if (data.form_name.includes('Enrollment')) {
//                             // localStorage.setItem('child_name',
//                             // response[0].child_full_name)
//                             document.getElementById('enrollment_agreement').innerHTML =
//                                 data.form_name; //
//                             // document.querySelector('[name="enrollment_span"]').style.display
//                             // =  "block";
//                             document.getElementById('date_value').innerHTML =
//                                 data.form_expiry_date;

//                             if (form_status === "Yet To Be Filled") {
//                                 document.getElementById('form_status').innerHTML =
//                                     form_status;
//                                 document.getElementById('form_status').style.color =
//                                     '#0F2D52';
//                                 document.getElementById('form_status').style.fontWeight =
//                                     'bold';
//                                 enableAction();
//                             } else if (form_status === "Completed") {
//                                 document.getElementById('form_status').innerHTML =
//                                     form_status;
//                                 document.getElementById('form_status').style.color = 'green';
//                                 document.getElementById('form_status').style.fontWeight =
//                                     'bold';
//                                 disableAction();
//                             } else if (form_status === "Incomplete") {
//                                 document.getElementById('form_status').innerHTML =
//                                     form_status;
//                                 document.getElementById('form_status').style.color = 'red';
//                                 document.getElementById('form_status').style.fontWeight =
//                                     'bold';
//                                 enableAction();
//                             } else {
//                                 document.getElementById('form_status').innerHTML =
//                                     form_status;
//                                 document.getElementById('form_status').style.color =
//                                     '#FFCC00';
//                                 document.getElementById('form_status').style.fontWeight =
//                                     'bold';
//                                 enableAction();
//                             }
//                         } else if (data.form_name.includes('Hand Book')) {
//                             document.getElementById('tableFooterHeading').innerHTML =
//                                 data.form_name;
//                         }
//                     })
//                 });
//             }
//         }
//     });
// }


// Disable the action and styling
// function disableAction() {
//     let link = document.getElementById('pencil_icon_link');
//     let icon1 = document.getElementById('enrollmentForm');

//     link.style.pointerEvents = 'none'; // Disable link click
//     icon1.style.color = 'gray';//changed the color
//     icon1.classList.add('disabled'); // Apply disabled styling

//     let span = document.querySelector('[data-bs-toggle="modal"]');
//     let icon2 = document.getElementById('mail_icon');

//     span.style.pointerEvents = 'none'; // Disable span click
//     icon2.style.color = 'gray'//changed the color
//     icon2.classList.add('disabled'); // Apply disabled styling
// }

// // Enable the action and styling
// function enableAction() {
//     let link = document.getElementById('pencil_icon_link');
//     let icon1 = document.getElementById('enrollmentForm');

//     link.style.pointerEvents = 'auto'; // Enable link click
//     icon1.style.color = '#0F2D52';//changed the color
//     icon1.classList.remove('disabled'); // Remove disabled styling

//     let span = document.querySelector('[data-bs-toggle="modal"]');
//     let icon2 = document.getElementById('mail_icon');

//     span.style.pointerEvents = 'auto'; // Enable span click
//     icon2.style.color = '#0F2D52';//changed the color
//     icon2.classList.remove('disabled'); // Remove disabled styling
// }

//to display child's year
function parentDashBoardYear() {
    const child_id = localStorage.getItem('child_id')
    const url = 'https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/enrollment_data/fetch/'
    // console.log(url + child_id)
    $.ajax({
        url: url + child_id,
        type: 'get',
        success: function (response) {
            console.log(response);
            let yearArray = []
            for (let i = 0; i < response.length; i++) {
                yearArray.push(response[i].year)
            }
            yearArray.sort().reverse();
            let optionsData = '';
            document.querySelector('[name="form_year"]').innerHTML = '';
            for (let i = 0; i < yearArray.length; i++) {
                optionsData += '<option value="' + yearArray[i] + '">' + yearArray[i]
                                + '</option>';
                document.querySelector('[name="form_year"]').innerHTML =
                    optionsData;
            }
        }
    });
}

$(document).ready(function () {
    //geting current year
    let defaultdate = new Date().getFullYear();
    document.querySelector('[name="child_dashboard_name"]').innerHTML =
        localStorage.getItem('child_name');
    parentDashBoardDetails(defaultdate);
    parentDashBoardYear();
});
