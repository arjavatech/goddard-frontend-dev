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
        obj.child_classroom_id = document.getElementById('class_name').value;

        // obj.from = "noreply.goddard@gmail.com";
        // let email_to = $('#parent_email').val();
        // obj.to = email_to;
        // console.log(obj.to);
        // obj.subject = 'Invite parents';
        // let messageData = $('#messageData').val();
        // obj.body = "";
        const json = JSON.stringify(obj);
        console.log(json);

        if (obj.child_fname != "" && obj.child_lname && obj.child_classroom_id && obj.parent_name && obj.invite_email) {

            $.ajax({
                url: "Environment: https://7jpl4gpmpg.execute-api.ap-south-1.amazonaws.com/dev/parent_invite_with_mail_trigger/create",
                type: "POST",
                contentType: "application/json",
                data: json,
                success: function (response) {
                    console.log(response);
                    // return false;
                    if (response.error === "Already we send an mail. Please try different email") {
                        $(".error-msg-alreadyexists").show();
                    } else if (response.error === "Email Already Registered with another mail. Please try different email") {
                        $(".error-msg-alreadyexists").show();
                    } else if(response.message === "Parent invite created and Email sent successfully!") {
                        $(".success-msg").show();
                    } else {
                        $(".error-msg").show();
                    }

                },
                error: function (xhr, status, error) {
                    console.log(error);
                }
            });
        } else {
            $(".error-msg-empty").show();
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

$(document).ready(function () {
    $('#sendButton').click(function () {
        // console.log('checking email send');
        emailSend();
    });
    classroomLoad();
    function classroomLoad(){
        //for waking up the aws lambda server
        $.ajax({
            url: 'Environment: https://7jpl4gpmpg.execute-api.ap-south-1.amazonaws.com/dev/class_details/getall',
            type: 'get',
            datasrc: '',
            dataType: 'json',
            //this is uesd to get the response and return the result
            success: function (response) {
                var class_room = '';
                if (response !== "") {
                    for (var i = 0; i < response.length; i++) {
                        if (response[i].class_name != "" && response[i].class_name != undefined) {

                            const isSelected = response[i].class_name === "Unassign" ? 'selected' : '';
                            class_room += `<option value="${response[i].class_id}" ${isSelected}>${response[i].class_name}</option>`;
                        }
                    }
                }
                document.getElementById('class_name').innerHTML = class_room;
            }
        });
    }
})