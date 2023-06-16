let messageData = $("#messageData").val();
    
    let obj ={
      "from": "mvmbalaji@gmail.com",
      "to": "mvmbalaji@gmail.com",
      "subject": "Enrollment Agreement 2023-2024",
      "body": messageData,
      "attachmentName": "Enrollment Agreement 2023-2024",
      "attachmentBase64": ""
  }

  $(document).ready(function emailSend(){ajax({
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
  })
})