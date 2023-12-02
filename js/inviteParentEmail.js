let obj = {
    "from": "noreply.goddard@gmail.com",
    "to": "noreply.goddard@gmail.com",
    "subject": "subject",
    "body": "",
}
function emailSend() {
    try {
        const form = document.getElementById("admission_form");
        const formData = new FormData(form);
        const obj = Object.fromEntries(formData);

        obj.from = "noreply.goddard@gmail.com";
        let email_to =  $('#parent_email').val();
        obj.to = email_to;
        obj.subject = 'Invite parents';
        // let messageData = $('#messageData').val();
        obj.body = "";
        console.log(obj.body);
        const json =JSON.stringify(obj);
        console.log(json);

        $.ajax({
            url: " https://6flxkkqvr4.execute-api.us-west-2.amazonaws.com/dev/email/send",
            type: "POST",
            contentType: "application/json",
            data: json,
            success: function (response) {
                console.log(response);
                alert(response.message);
                window.location.reload();
            },
            error: function (xhr, status, error) {
                console.log(xhr);
                console.log(status);
                console.log(error);
                alert(error);
            }
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

$(document).ready(function () {
    $('#sendButton').click(function () {
        console.log('checking email send');
        emailSend();
    });
})