// Function to submit the form data
function submitForm() {
    const form = document.getElementById("enrollment_from");
    console.log(form);
    const formData = new FormData(form);
    console.log(form);
    const obj = Object.fromEntries(formData);
    console.log(obj);
    obj.child_id = "CD0001";
    const json = JSON.stringify(obj);

    var msg = confirm("Are you sure?");
    if (msg == true) {
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
        xhr.open("POST", "https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/enrollment_data/add");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(json);
    }
}
// function showSpinner() {
//     let first_content = document.getElementsByName("child_id");
//     console.log(first_content.value);
//     document.getElementById("spinner").style.display = "block";
//     document.getElementById("content").style.opacity = "0.3";
//     // You can also disable user interactions while the spinner is shown
//     // document.getElementById("content").style.pointerEvents = "none";
// }

// function hideSpinner() {
//     document.getElementById("spinner").style.display = "none";
//     document.getElementById("content").style.opacity = "1";
//     // Re-enable user interactions if disabled
//     // document.getElementById("content").style.pointerEvents = "auto";
// }
// showSpinner();

$(document).ready(function() {
    // Add click event listener to the "Save" button
    $("#saveBtn").on("click", function(e) {
        e.preventDefault(); // Prevent the default form submission
        submitForm();
    });
});