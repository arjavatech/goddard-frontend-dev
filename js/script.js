function title(){

}


function WelcomeScreen(){

}

// const downloadButton = document.getElementById('downloadButton');

// Add a click event listener to the button
// downloadButton.addEventListener('click', () => {
//     const {jsPDF} = window.jspdf;
//     const doc = new jsPDF('p', 'mm', [1500, 1400]);
//     let pdfjs = document.querySelector('#wholeDiv');

//     doc.html(pdfjs, {
//         callback: function (doc) {
//             doc.save("output.pdf");
//         },
//         x: 12,
//         y: 12
//     });
// });

// $(document).ready(function() {
//     $("#sendButton").click(function() {
//       console.log('hi')
//       let messageData = $("#messageData").val();

//       let obj ={
//         "from": "mvmbalaji@gmail.com",
//         "to": "mvmbalaji@gmail.com",
//         "subject": "Enrollment Agreement 2023-2024",
//         "body": messageData,
//         "attachmentName": "Enrollment Agreement 2023-2024",
//         "attachmentBase64": ""
//     }

//       $.ajax({
//         url: "https://f64ff4v9wh.execute-api.ap-south-1.amazonaws.com/godd/email/send",
//         type: "POST",
//         contentType: "application/json",
//         data: JSON.stringify(obj),
//         success: function(response) {
//           console.log(response)
//         },
//         error: function(xhr, status, error) {
//           console.log(status)
//         }
//       });
//     });
// });