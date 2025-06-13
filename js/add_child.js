import { isAuthenticated } from "./authentication_verify.js";

// Function to submit the form data
function submitForm() {
    const form = document.getElementById("childBasicForm");
    console.log(form);
    const formData = new FormData(form);
    const obj = Object.fromEntries(formData);
    // console.log(obj);
    // return false;
    if (obj.child_first_name != '' && obj.child_last_name != '' && obj.class_id != '' && obj.class_id != null && obj.parent_id != '') {
        obj.class_id = parseInt(obj.class_id);
        const json = JSON.stringify(obj);

        $.ajax({
            url: "https://7jpl4gpmpg.execute-api.ap-south-1.amazonaws.com/dev/child_info/create",
            type: "POST",
            contentType: "application/json",
            data: json,
            success: function (response) {
                console.log(response);
                // return false;
                if (response.message === "Child information created successfully") {
                    $(".success-msg-update").show();
                }

            },
            error: function (xhr, status, error) {
                console.log(error)
                $(".success-msg").show();
            }
        });
    } else {
        // window.location.reload();
        // alert('you have to fill all the fields');
        $(".error-msg").show();
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
        // $('#primary_parent_email').on('focus', function () {
        //     //for waking up the aws lambda server
        //     $.ajax({
        //         url: 'https://7jpl4gpmpg.execute-api.ap-south-1.amazonaws.com/dev/parent_info/getall',
        //         type: 'get',
        //         datasrc: '',
        //         dataType: 'json',
        //         //this is uesd to get the response and return the result
        //         success: function (response) {
        //             // console.log(response);
        //             var parent_email = '';
        //             if (response !== "") {
        //                 for (var i = 0; i < response.length; i++) {
        //                     // console.log(response[i].invite_email);
        //                     if (response[i].email != "" && response[i].email != undefined) {
        //                         parent_email += '<option value="' + response[i].parent_id + '">' + response[i].email + '</option>';
        //                     }
        //                 }
        //             }
        //             document.getElementById('primary_parent_email').innerHTML = parent_email;
        //         }
        //     });
        // });

        // function parent_email_load() {
        //     let selectedEmailId = window.location.search.slice(7);
        //     //for waking up the aws lambda server
        //     $.ajax({
        //         url: 'https://7jpl4gpmpg.execute-api.ap-south-1.amazonaws.com/dev/parent_info/getall',
        //         type: 'get',
        //         datasrc: '',
        //         dataType: 'json',
        //         //this is uesd to get the response and return the result
        //         success: function (response) {
        //             console.log(response);
        //             var parent_email = '';
        //             // Checking if response is not empty and contains valid data
        //             if (response && response.length > 0) {
        //                 for (var i = 0; i < response.length; i++) {
        //                     if (response[i].parent_email) {
        //                         let Selected = response[i].parent_email === selectedEmailId ? 'selected' : '';
        //                         // Dynamically constructing options for the select
        //                         parent_email += '<option value="' + response[i].parent_id + '" data-tokens="' + response[i].parent_id + '"'+ Selected +'>' + response[i].parent_email + '</option>';
        //                     }
        //                 }
        //             }
        //             // Updating the select element with new options
        //             $('#primary_parent_email').html(parent_email);

        //             // Refreshing the selectpicker to apply the new options
        //             $('#primary_parent_email').selectpicker('refresh');
        //             if (selectedEmailId) {
        //                 $('.filter-option-inner-inner').text(selectedEmailId);
        //             }
        //         }
        //     });
        // }
        // $(document).on("click", ".bs-placeholder", function () {
        //     parent_email_load();
        // });

        classroomLoad();
        function classroomLoad(){
            //for waking up the aws lambda server
            $.ajax({
                url: 'https://7jpl4gpmpg.execute-api.ap-south-1.amazonaws.com/dev/class_details/getall',
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
    }
});
