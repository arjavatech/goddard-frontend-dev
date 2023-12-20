import { fetchEnrollmentFormTitle, fetchEnrollmentFormBody, fetchEnrollmentPointEight } from './enrollmentForm.js';
import {isAuthenticated} from "./authenticationVerify.js";
import {authorizationFormDetails} from "./authorization_form.js";

function getEnrollmentFormStatus(val, callback) {
    $.ajax({
        url: ` http://localhost:8080/${val}/form_status/${localStorage.getItem('child_id')}`,
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

let obj = {
    "from": "noreply.goddard@gmail.com",
    "to": "noreply.goddard@gmail.com",
    "subject": "subject",
    "body": "message data",
    "attachmentName": "AttachmentForm",
    "attachmentKey": "attachments/Test.pdf"
}
function emailSend() {
    try {
        let messageData = $('#messageData').val();
        obj.body = messageData;
        const json =JSON.stringify(obj);
        $.ajax({
               url: "http://localhost:8080/email/send",
               type: "POST",
               contentType: "application/json",
               data: json,
               success: function (response) {
                   alert("Email Sent Successfully")
                   let modal = document.querySelector('.modal');
                   $('#mailbox').modal('hide');
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

function parentDashBoardDetails(val) {
    localStorage.setItem('form_year_value', val);
    $.ajax({
        url: ` http://localhost:8080/goddard_all_form/all/forms?status=true`,
        type: 'get',
        success: function (response) {
            if (Array.isArray(response) && response.length > 0) {
                // localStorage.setItem('form_name',  data.form_name)
                const tableBody = document.getElementById('tableBody');
                // Clear the existing table row
                tableBody.innerHTML = '';
                response.forEach(data => {
                    const newRow = document.createElement('tr');

                    // Create and append cells for each data point
                    const formNameCell = document.createElement('td');
                    formNameCell.innerText = data.form_name;
                    localStorage.setItem('form_name',  data.form_name)

                    const formExpiryDateCell = document.createElement('td');
                    formExpiryDateCell.innerText = data.form_expiry_date;

                    const formStatusCell = document.createElement('td');
                    formStatusCell.setAttribute('id','form_status');
                    if (data.form_name == '2023-2024 Enrollment Agreement') {
                        let value = 'enrollment_data';
                        getEnrollmentFormStatus(value, function (formStatusResp) {

                            // Assuming formStatusResp contains a property called 'form_status'
                            let form_status = formStatusResp.form_status;
                            formStatusCell.innerHTML = form_status;
                            if (form_status === "Completed") {
                                formStatusCell.style.color = 'green';
                                formStatusCell.style.fontWeight = 'bold';
                            } else if (form_status === "Incomplete") {
                                formStatusCell.style.color = 'red';
                                formStatusCell.style.fontWeight = 'bold';
                            } else {
                                formStatusCell.style.color = '#a5a202';
                                formStatusCell.style.fontWeight = 'bold';
                            }
                        });
                    } else if (data.form_name == 'ACH Recurring payments form') {
                        let value = 'bill_ach';
                        getEnrollmentFormStatus(value, function (formStatusResp) {
                            console.log(formStatusResp); // Check the structure of formStatusResp
                    
                            // Assuming formStatusResp contains a property called 'form_status'
                            let form_status = formStatusResp.form_status;
                    
                            // Rest of your code...
                    
                            // Update the existing formStatusCell properties
                            formStatusCell.innerText = form_status;
                            if (form_status === "Completed") {
                                formStatusCell.style.color = 'green';
                                formStatusCell.style.fontWeight = 'bold';
                            } else if (form_status === "Incomplete") {
                                formStatusCell.style.color = 'red';
                                formStatusCell.style.fontWeight = 'bold';
                            } else {
                                formStatusCell.style.color = '#a5a202';
                                formStatusCell.style.fontWeight = 'bold';
                            }
                        });
                    } else {
                        // Remove the redeclaration of formStatusCell here
                    
                        formStatusCell.innerText = "Incomplete";
                    
                        if (data.form_status === "Completed") {
                            formStatusCell.style.color = 'green';
                            formStatusCell.style.fontWeight = 'bold';
                        } else if (data.form_status === "Incomplete") {
                            formStatusCell.style.color = 'red';
                            formStatusCell.style.fontWeight = 'bold';
                        } else {
                            formStatusCell.style.color = '#a5a202';
                            formStatusCell.style.fontWeight = 'bold';
                        }
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
                        editLink.href = `form.html?id=${dynamicValue}`;
                    }else if(data.form_name == 'ACH Recurring payments form') {
                        editLink.href = `./forms/authorization_form.html?id=${dynamicValue}`;
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

                    // const mailSpan = document.createElement('span');
                    // mailSpan.setAttribute('data-bs-toggle', 'modal');
                    // mailSpan.setAttribute('data-bs-target', '#staticBackdrop');
                    // // ... Add other attributes and content for mailSpan

                    // Create the Mail Icon <i> element
                    const mailIcon = document.createElement('i');
                    mailIcon.className = 'fa-solid fa-envelope p-1 action-icons';
                    mailIcon.id = 'mail_icon';
                    mailIcon.name = 'mail_icon';
                    mailIcon.addEventListener('click',function(){
                        var modal = document.createElement('div');
                        modal.id = 'mailbox';
                        modal.className = 'modal';
                    
                        var modalDialog = document.createElement('div');
                        modalDialog.className = 'modal-dialog';
                    
                        var modalContent = document.createElement('div');
                        modalContent.className = 'modal-content';
                    
                        var modalHeader = document.createElement('div');
                        modalHeader.className = 'modal-header';
                    
                        var modalTitle = document.createElement('h1');
                        modalTitle.className = 'modal-title';
                        modalTitle.textContent = 'Mail Send to Admin';
                    
                        var closeButton = document.createElement('button');
                        closeButton.type = 'button';
                        closeButton.className = 'btn-close';
                        closeButton.setAttribute('data-dismiss', 'modal');
                        closeButton.setAttribute('aria-label', 'Close');
                        closeButton.addEventListener('click',function(){
                            $('#mailbox').modal('hide');
                        });
                    
                        var modalBody = document.createElement('div');
                        modalBody.className = 'modal-body';
                    
                        var form = document.createElement('form');
                    
                        var formGroup = document.createElement('div');
                        formGroup.className = 'form-group';
                    
                        var label = document.createElement('label');
                        label.setAttribute('for', 'messageData');
                        label.textContent = 'Message';
                    
                        var textarea = document.createElement('textarea');
                        textarea.rows = '10';
                        textarea.cols = '50';
                        textarea.className = 'form-control';
                        textarea.id = 'messageData';
                        textarea.name = '';
                    
                        var modalFooter = document.createElement('div');
                        modalFooter.className = 'modal-footer';
                    
                        var cancelButton = document.createElement('button');
                        cancelButton.type = 'button';
                        cancelButton.className = 'btn btn-secondary';
                        cancelButton.textContent = 'Cancel';
                        cancelButton.setAttribute('data-dismiss', 'modal');
                        cancelButton.addEventListener('click',function(){
                            $('#mailbox').modal('hide');
                        });
                    
                        var sendButton = document.createElement('button');
                        sendButton.type = 'button';
                        sendButton.id = 'sendButton';
                        sendButton.className = 'btn btn-primary';
                        sendButton.textContent = 'Send';
                    
                        // Append elements to the modal
                        modalHeader.appendChild(modalTitle);
                        modalHeader.appendChild(closeButton);
                    
                        formGroup.appendChild(label);
                        formGroup.appendChild(textarea);
                        form.appendChild(formGroup);
                        modalBody.appendChild(form);
                    
                        modalFooter.appendChild(cancelButton);
                        modalFooter.appendChild(sendButton);
                    
                        modalContent.appendChild(modalHeader);
                        modalContent.appendChild(modalBody);
                        modalContent.appendChild(modalFooter);
                    
                        modalDialog.appendChild(modalContent);
                        modal.appendChild(modalDialog);
                    
                        // Append the modal to the document
                        document.body.appendChild(modal);
                    
                        // Show the modal
                        $('#mailbox').modal('show');
                        sendButton.addEventListener('click',function(){
                            fetchEnrollmentFormTitle(function () {
                                fetchEnrollmentFormBody(function () {
                                    emailSend();
                                    
                                });
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
                    actionCell.appendChild(mailIcon);
                    // mailSpan.appendChild(mailIcon);
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
                // });
            }
        }
    });
}



// function parentDashBoardDetails(val) {
//     localStorage.setItem('form_year_value', val);
//     let form_status = 'unknown'
//     $.ajax({
//         url: ` http://localhost:8080/dashboard_data/formByYear/${val}`,
//         type: 'get',
//         success: function (response) {
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
    // const child_id = localStorage.getItem('child_id')
    // const url = ' http://localhost:8080/enrollment_data/fetch/'
    // $.ajax({
    //     url: url + child_id,
    //     type: 'get',
    //     success: function (response) {
    //         let yearArray = []
    //         for (let i = 0; i < response.length; i++) {
    //             yearArray.push(response[i].year)
    //         }
    //         yearArray.sort().reverse();
    //         let optionsData = '';
    //         document.querySelector('[name="form_year"]').innerHTML = '';
    //         for (let i = 0; i < yearArray.length; i++) {
    //             optionsData += '<option value="' + yearArray[i] + '">' + yearArray[i] + '</option>';
    //             document.querySelector('[name="form_year"]').innerHTML = optionsData;
    //         }
    //     }
    // });
}

$(document).ready(function () {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
    } else {
        //geting current year
        let defaultdate = new Date().getFullYear();
        document.querySelector('[name="child_dashboard_name"]').innerHTML = localStorage.getItem('child_name');
        parentDashBoardDetails(defaultdate);
        parentDashBoardYear();
    }
});
