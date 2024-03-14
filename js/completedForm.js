import { fetchEnrollmentFormTitle, fetchEnrollmentFormBody, fetchEnrollmentPointEight } from './enrollmentForm.js';
import {isAuthenticated} from "./authenticationVerify.js";
import {authorizationFormDetails} from "./authorization_form.js";

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





$(document).ready(function () {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
    } else {
        // let childid = localStorage.getItem('editID');
        // console.log(childid);
        // parentDashBoardDetails();
    }
});
