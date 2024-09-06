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

        // obj.from = "noreply.goddard@gmail.com";
        // let email_to = $('#parent_email').val();
        // obj.to = email_to;
        // console.log(obj.to);
        // obj.subject = 'Invite parents';
        // let messageData = $('#messageData').val();
        // obj.body = "";
        const json =JSON.stringify(obj);
        console.log(json);

        $.ajax({
            url: "https://ijz2b76zn8.execute-api.ap-south-1.amazonaws.com/test/parent_invite_info/create",
            type: "POST",
            contentType: "application/json",
            data: json,
            success: function (response) {
                // console.log(response.message);
                // alert(response.message);
                // window.location.reload();
                $(".success-msg").show();
                    setTimeout(function(){
                    $(".success-msg").hide();
                    window.location.reload();
                }, 3000);
            },
            error: function (xhr, status, error) {
                // console.log(xhr);
                // console.log(status);
                // console.log(error);
                // alert(error);
                $(".error-msg-empty").show();
                    setTimeout(function(){
                    $(".error-msg-empty").hide();
                    window.location.reload();
                }, 3000);
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

    $('#class_name').on('focus', function () {
        //for waking up the aws lambda server
        $.ajax({
            url: 'https://ijz2b76zn8.execute-api.ap-south-1.amazonaws.com/test/class_details/getall',
            type: 'get',
            datasrc: '',
            dataType: 'json',
            //this is uesd to get the response and return the result
            success: function (response) {
                var class_room = '';
                if (response !== "") {
                    for (var i = 0; i < response.length; i++) {
                        if (response[i].class_name != "" && response[i].class_name != undefined) {
                            class_room += '<option value="' + response[i].class_id + '">' + response[i].class_name + '</option>';
                        }
                    }
                }
                document.getElementById('class_name').innerHTML = class_room;
            }
        });
    });
})