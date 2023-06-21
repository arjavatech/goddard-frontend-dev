function configureAWS() {
    AWS.config.update({
                          accessKeyId: 'AKIATNZ4QAI6MX5LH34Q',
                          secretAccessKey: '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',
                          region: 'us-west-2'
                      });
}

async function downloadParentHandbook() {
    configureAWS();
    const s3 = new AWS.S3();
    const bucketName = 'goddard-form';
    const objectKey = 'Parent Handbook.pdf';

    const params = {
        Bucket: bucketName,
        Key: objectKey,
        ResponseContentDisposition: 'attachment; filename="' + objectKey + '"',
        Expires: 60
    };

    const url = s3.getSignedUrl('getObject', params);

    const link = document.createElement('a');
    link.href = url;
    link.download = objectKey;
    link.click();
}

async function fetchAndPrintParentForm() {
    configureAWS();
    const s3 = new AWS.S3();
    const bucketName = 'goddard-form';
    const objectKey = 'Parent Handbook.pdf';

    const params = {
        Bucket: bucketName,
        Key: objectKey
    };

    try {
        const data = await s3.getObject(params).promise();
        const formBlob = new Blob([data.Body], { type: 'application/pdf' });

        // Create a temporary URL for the form blob
        const formUrl = URL.createObjectURL(formBlob);

        // Open a new window with the form URL
        const printWindow = window.open(formUrl);

        // Print the form
        printWindow.addEventListener('load', function() {
            printWindow.print();
        });
    } catch (error) {
        console.error('Error fetching the form:', error);
    }
}

$(document).ready(function() {
    // Add click event listener to the "Save" button
    $("#GetFile").on("click", function(e) {
        e.preventDefault(); // Prevent the default form submission
        downloadParentHandbook();
    });

    $("#printParentHandbook").on("click", function(e) {
        e.preventDefault(); // Prevent the default form submission
        fetchAndPrintParentForm();
    });
});