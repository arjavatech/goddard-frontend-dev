import { isAuthenticated } from "./authentication_verify.js";

// Function to submit the form data
function submitForm() {
    const form = document.getElementById("childBasicForm");
    console.log(form);
    const formData = new FormData(form);
    const obj = Object.fromEntries(formData);
    if (obj.child_first_name != '' && obj.child_last_name != '' && obj.class_id != '' && obj.parent_id) {
        obj.class_id = parseInt(obj.class_id);
        const json = JSON.stringify(obj);
        console.log(json);
        // return false;
        $.ajax({
            url: "https://ijz2b76zn8.execute-api.ap-south-1.amazonaws.com/test/child_info/create",
            type: "POST",
            contentType: "application/json",
            data: json,
            success: function (response) {
                // alert(response.message);
                $(".success-msg").show();
                setTimeout(function () {
                    $(".success-msg").hide();
                    window.location.reload();
                }, 3000);
            },
            error: function (xhr, status, error) {
                console.log(error)
                // alert("failed to submit admission form");
            }
        });
    } else {
        // window.location.reload();
        // alert('you have to fill all the fields');
        $(".error-msg").show();
        setTimeout(function () {
            $(".error-msg").hide();
        }, 3000);
    }


}
$(document).ready(function () {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
    } else {
        $("#basic_child_button").on("click", function (e) {
            e.preventDefault(); // Prevent the default form submission
            submitForm();
        });
        $('#primary_parent_email').on('focus', function () {
            //for waking up the aws lambda server
            $.ajax({
                url: 'https://ijz2b76zn8.execute-api.ap-south-1.amazonaws.com/test/parent_info/getall',
                type: 'get',
                datasrc: '',
                dataType: 'json',
                //this is uesd to get the response and return the result
                success: function (response) {
                    // console.log(response);
                    var parent_email = '';
                    if (response !== "") {
                        for (var i = 0; i < response.length; i++) {
                            // console.log(response[i].invite_email);
                            if (response[i].email != "" && response[i].email != undefined) {
                                parent_email += '<option value="' + response[i].parent_id + '">' + response[i].email + '</option>';
                            }
                        }
                    }
                    document.getElementById('primary_parent_email').innerHTML = parent_email;
                }
            });
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
    }
});
