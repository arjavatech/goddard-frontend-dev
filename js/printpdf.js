import { fetchEnrollmentFormTitle, fetchEnrollmentFormBody } from './enrollmentForm.js';

function generatePDFContent() {
    return new Promise((resolve) => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', [1500, 1400]);
        let formContent = document.querySelector('#formContent');
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

// async function printForm() {
//     console.log("Print Form");
//     const pdfDoc = await generatePDFContent();
//
//     // Open a new window or tab for printing
//     const printWindow = window.open('', '_blank');
//
//     // Set the content of the new window to the PDF document
//     printWindow.document.open();
//     printWindow.document.write(pdfDoc.output('bloburl'));
//     printWindow.document.close();
//
//     // Trigger the print dialog
//     printWindow.print();
// }

async function printForm() {
    console.log("Print Form");
    const pdfDoc = await generatePDFContent();

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

$(document).ready(function() {
    $('#printFormBtn').click(function() {
        fetchEnrollmentFormTitle(function() {
            fetchEnrollmentFormBody(function() {
                printForm();
            });
        });
    });
});