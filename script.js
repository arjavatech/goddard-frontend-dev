$(document).ready(function() {
    $.ajax({
        url: 'https://f64ff4v9wh.execute-api.ap-south-1.amazonaws.com/godd/enrollment/fetch/1',
        type: 'get',
        success: function(response){
            document.querySelector('[name="heading"]').innerHTML = response.title
        }
    })
    $.ajax({
        url: 'https://f64ff4v9wh.execute-api.ap-south-1.amazonaws.com/godd/enrollment/fetch/1',
        type: 'get',
            success: function(response){
                console.log(response)
                if(typeof response.point_one !='undefined'){
                    document.querySelector('[name="apiResponsep1"]').innerHTML = response.point_one;
                    document.querySelector('[name="apiResponsep2"]').innerHTML = response.point_two;
                    document.querySelector('[name="apiResponsep3"]').innerHTML = response.point_three;
                    document.querySelector('[name="apiResponsep4"]').innerHTML = response.point_four;
                    document.querySelector('[name="apiResponsep5"]').innerHTML = response.point_five;
                    document.querySelector('[name="apiResponsep6"]').innerHTML = response.point_six;
                    document.querySelector('[name="apiResponsep7"]').innerHTML = response.point_seven;
                    document.querySelector('[name="apiResponsep8"]').innerHTML = response.point_eight;
                    document.querySelector('[name="apiResponsep9"]').innerHTML = response.point_nine;
                    document.querySelector('[name="apiResponsep10"]').innerHTML = response.point_ten;
                    document.querySelector('[name="apiResponsep11"]').innerHTML = response.point_eleven;
                    document.querySelector('[name="apiResponsep12"]').innerHTML = response.point_twelve;
                    document.querySelector('[name="apiResponsep13"]').innerHTML = response.point_thirteen;
                    document.querySelector('[name="apiResponsep14"]').innerHTML = response.point_fourteen;
        }}
    })

    $("#sendButton").click(function() {
        console.log('hi')
        let messageData = $("#messageData").val();
  
        let obj ={
          "from": "mvmbalaji@gmail.com",
          "to": "mvmbalaji@gmail.com",
          "subject": "Enrollment Agreement 2023-2024",
          "body": messageData,
          "attachmentName": "Enrollment Agreement 2023-2024",
          "attachmentBase64": ""
      }

      $.ajax({
        url: "https://f64ff4v9wh.execute-api.ap-south-1.amazonaws.com/godd/email/send",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(obj),
        success: function(response) {
          console.log(response)
        },
        error: function(xhr, status, error) {
          console.log(status)
        }
      });
    })
})

const downloadButton = document.getElementById('downloadButton');

// Add a click event listener to the button
downloadButton.addEventListener('click', () => {
    const {jsPDF} = window.jspdf;
    const doc = new jsPDF('p', 'mm', [1500, 1400]);
    let pdfjs = document.querySelector('#wholeDiv');

    doc.html(pdfjs, {
        callback: function (doc) {
            doc.save("output.pdf");
        },
        x: 12,
        y: 12
    });
});

$(document).ready(function() {
    $("#sendButton").click(function() {
      console.log('hi')
      let messageData = $("#messageData").val();

      let obj ={
        "from": "mvmbalaji@gmail.com",
        "to": "mvmbalaji@gmail.com",
        "subject": "Enrollment Agreement 2023-2024",
        "body": messageData,
        "attachmentName": "Enrollment Agreement 2023-2024",
        "attachmentBase64": ""
    }
      
      $.ajax({
        url: "https://f64ff4v9wh.execute-api.ap-south-1.amazonaws.com/godd/email/send",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(obj),
        success: function(response) {
          console.log(response)
        },
        error: function(xhr, status, error) {
          console.log(status)
        }
      });
    });
});