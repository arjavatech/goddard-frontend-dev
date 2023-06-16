import {fetchEnrollmentFormTitle, fetchEnrollmentFormBody } from './enrollmentForm.js'

// function downloadPDF() {
//     console.log("Download")
//     const {jsPDF} = window.jspdf;
//     const doc = new jsPDF('p', 'mm', [1500, 1400]);
//     let pdfjs = document.querySelector('#formContent');
//     doc.html(pdfjs, {
//         callback: function (doc) {
//             doc.save("output.pdf");
//         },
//         x: 12,
//         y: 12
//     });
// }


function downloadPDF() {
    console.log("Download");
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', [1500, 1400]);
    let formContent = document.querySelector('#formContent');
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



$(document).ready(function() {
    $('#downloadFormAsPDF').click(function() {
        fetchEnrollmentFormTitle(function() {
            fetchEnrollmentFormBody(function() {
                downloadPDF();
            });
        });
    });
});