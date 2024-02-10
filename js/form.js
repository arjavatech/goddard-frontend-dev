// Function to submit the form data
function submitForm() {
    const form = document.getElementById("enrollment_from");
    const formData = new FormData(form);
    var textBoxValue1 = document.getElementById('point_one_field_one').value;
    var textBoxValue2 = document.getElementById('point_one_field_two').value;
    var textBoxValue3 = document.getElementById('point_one_field_three').value;
    formData.append('point_one_field_one', textBoxValue1);
    formData.append('point_one_field_two', textBoxValue2);
    formData.append('point_one_field_three', textBoxValue3);
    const obj = Object.fromEntries(formData);
    let defaultdate = new Date().getFullYear();
    obj.child_id = localStorage.getItem('child_id');
    obj.year = defaultdate;
    obj.form_status = 'Reviewing';
    const json = JSON.stringify(obj);
    
    let xhr = new XMLHttpRequest();
    xhr.onload = () => {
        // const data = xhr.responseText;
        if (xhr.status === 200) {
            // var confirmationRes = window.confirm(data);
            // if (confirmationRes) {
                window.location.href = "parent_dashboard.html";
            // } else {
            //     window.location.reload();
            // }
        }else{
            window.location.reload();
        }
    };
    xhr.open("POST", "https://6flxkkqvr4.execute-api.us-west-2.amazonaws.com/dev/enrollment_data/add");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(json);
}
//this function is used to clear all the element values
function clearForm(){
    document.getElementById("point_one_field_one").value = "";
    document.getElementById("point_one_field_two").value = "";
    document.getElementById("point_one_field_three").value = "";
    document.getElementById("point_two_initial_here").value = "";
    document.getElementById("point_three_initial_here").value = "";
    document.getElementById("point_four_initial_here").value = "";
    document.getElementById("point_five_initial_here").value = "";
    document.getElementById("point_six_initial_here").value = "";
    document.getElementById("point_seven_initial_here").value = "";
    document.getElementById("point_eight_initial_here").value = "";
    document.getElementById("point_nine_initial_here").value = "";
    document.getElementById("point_ten_initial_here").value = "";
    document.getElementById("point_eleven_initial_here").value = "";
    document.getElementById("point_twelve_initial_here").value = "";
    document.getElementById("point_thirteen_initial_here").value = "";
    document.getElementById("point_fourteen_initial_here").value = "";
    document.getElementById("point_fifteen_initial_here").value = "";
    document.getElementById("point_sixteen_initial_here").value = "";
    document.getElementById("point_seventeen_initial_here").value = "";
    document.getElementById("point_eighteen_initial_here").value = "";
    document.getElementById("parent_one_sign").value = "";
    document.getElementById("parent_one_sign_date").value = "";
    document.getElementById("primary_parent_email").value = "";
    document.getElementById("primary_parent_cell_number").value = "";
    document.getElementById("child_name").value = "";
    document.getElementById("dob").value = "";
    document.getElementById("school_admin_sign").value = "";
    document.getElementById("school_admin_sign_date").value = "";
}

//email validation with particular format
function emailValidation(inputtxtID,errorSpanID) {
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (reg.test(inputtxtID.value) == true) {
        document.getElementById(errorSpanID).style.display = "none";
    } else if(inputtxtID.value == ''){
        document.getElementById(errorSpanID).style.display = "none";
    } else {
        document.getElementById(errorSpanID).style.display = "block";
        inputtxtID.focus();
    }
}

//number validation with particular format
function validatePhone(inputtxtID, errorSpanId) {
    let numbersformat =/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/im;
    if (inputtxtID.value.match(numbersformat) && inputtxtID.value.length <= 15) {
        document.getElementById(errorSpanId).style.display = "none";
    } else if(inputtxtID.value == ''){
        document.getElementById(errorSpanId).style.display = "none";
    } else {
        document.getElementById(errorSpanId).style.display = "block";
        inputtxtID.focus();
    }
}

//this function restrict future date
function dateValidation(id){
    document.getElementById(id).max = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0];
}

$(document).ready(function() {
    // Add click event listener to the "Save" button
    $("#saveBtn").on("click", function(e) {
        e.preventDefault(); // Prevent the default form submission
        submitForm();
    });
     // Add click event listener to the "Clear" button
    $("#clearBtn").on("click", function(e) {
        e.preventDefault(); // Prevent the default form submission
        clearForm();
    });
});

