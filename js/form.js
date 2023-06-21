// Function to submit the form data
function submitForm() {
    const form = document.getElementById("enrollment_from");
    const formData = new FormData(form);
    const obj = Object.fromEntries(formData);
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

$(document).ready(function() {
    // Add click event listener to the "Save" button
    $("#saveBtn").on("click", function(e) {
        e.preventDefault(); // Prevent the default form submission
        submitForm();
    });
});