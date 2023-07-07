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
    console.log(formData);
    const obj = Object.fromEntries(formData);
    console.log(obj);
    obj.child_id = "CD0001";
    const json = JSON.stringify(obj);

    let xhr = new XMLHttpRequest();
    xhr.onload = () => {
        // const data = xhr.responseText;
        if (xhr.status == 200) {
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
    xhr.open("POST", "https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/enrollment_data/add");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(json);
}

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
    document.getElementById("parent_two_sign").value = "";
    document.getElementById("parent_two_sign_date").value = "";
    document.getElementById("child_name").value = "";
    document.getElementById("dob").value = "";
    document.getElementById("school_admin_sign").value = "";
    document.getElementById("school_admin_sign_date").value = "";
}

$(document).ready(function() {
    // Add click event listener to the "Save" button
    $("#saveBtn").on("click", function(e) {
        e.preventDefault(); // Prevent the default form submission
        submitForm();
    });
    $("#clearBtn").on("click", function(e) {
        e.preventDefault(); // Prevent the default form submission
        clearForm();
    });
});