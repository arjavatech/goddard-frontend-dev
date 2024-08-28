 // Toggle Password Visibility
 $(".togglePassword").click(function () {
    togglePasswordVisibility($(this), ".password");
});

// Toggle Confirm Password Visibility
$(".toggleConfirmPassword").click(function () {
    togglePasswordVisibility($(this), ".confirm-password");
});

function togglePasswordVisibility(iconElement, passwordFieldSelector) {
    var passwordField = $(passwordFieldSelector);
    var type = passwordField.attr("type");

    if (type === "password") {
        console.log('checking eye');
        iconElement.find("i").removeClass("fa-eye").addClass("fa-eye-slash");
        passwordField.attr("type", "text");
    } else if (type === "text") {
        console.log('checking slash');
        iconElement.find("i").removeClass("fa-eye-slash").addClass("fa-eye");
        passwordField.attr("type", "password");
    }
}