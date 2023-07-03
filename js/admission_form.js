// Function to submit the form data
function submitForm() {
    const form = document.getElementById("admission_form");
    const formData = new FormData(form);
    console.log(formData);
    const obj = Object.fromEntries(formData);
    console.log(obj);
    obj.child_id = "NCD0001";
    const json = JSON.stringify(obj);
    console.log(json);

    let xhr = new XMLHttpRequest();
    xhr.onload = () => {
        const data = xhr.responseText;
        if (xhr.status == 200) {
            var confirmationRes = window.confirm(data);
            if (confirmationRes) {
                window.location.href = "parent_dashboard.html";
            } else {
                window.location.reload();
            }
        }
    };
    xhr.open("POST", "https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/child/add");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(json);
}

function namevalidation(inputtxt,errorSpan){
    let regName =  /^[a-zA-Z\s]+$/;
    if (regName.test(inputtxt.value) == true) {
        document.getElementById(errorSpan).style.display = "none";
    } else if(inputtxt.value == ''){
        document.getElementById(errorSpan).style.display = "none";
    } else {
        document.getElementById(errorSpan).style.display = "block";
        inputtxt.focus();
    }
}

let numbersformat =/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/im;
function validatePhone(inputtxt, errorSpan) {
    if (inputtxt.value.match(numbersformat) && inputtxt.value.length <= 15) {
        document.getElementById(errorSpan).style.display = "none";
    } else if(inputtxt.value == ''){
        document.getElementById(errorSpan).style.display = "none";
    } else {
        document.getElementById(errorSpan).style.display = "block";
        inputtxt.focus();
    }
}

$(document).ready(function() {
    // Add click event listener to the "Save" button
    $("#submit_button").on("click", function(e) {
        e.preventDefault(); // Prevent the default form submission
        submitForm();
    });
    // namevalidation();
});