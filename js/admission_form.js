import {isAuthenticated} from "./authenticationVerify.js";

// Function to submit the form data
function submitForm() {
    const form = document.getElementById("admission_form");
    const formData = new FormData(form);
    const obj = Object.fromEntries(formData);
    const enformData = new FormData(form);
    // obj.child_id = "NCD0005";
    const logged_in_email = localStorage.getItem('logged_in_email');
    const parent_name = localStorage.getItem('parent_name');
    obj.on_process = false;
    obj.parent_email_one = logged_in_email;
    obj.parent_name = parent_name;
    obj.parent_id = localStorage.getItem('parent_id')

    const child_id_val = localStorage.getItem('child_id');
    if (child_id_val !== null && child_id_val !== undefined) {
        obj.child_id = child_id_val;
        enformData.child_id = child_id_val;
    }
    enformData.year = new Date().getFullYear() + '';
    enformData.parent_id = localStorage.getItem('parent_id');
    // const json=  JSON.stringify(obj);
    $.ajax({
        url: "https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/admission/add",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(obj),
        success: function (response) {
            // window.location.href = "child_add.html";
            if(enformData.child_id === null || enformData.child_id === undefined) {
                localStorage.setItem('child_id', response.child_id)
                enformData.child_id = response.child_id;
            }
            console.log(enformData)

            $.ajax({
                url: "https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/enrollment_data/add",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(enformData),
                success: function (response1) {
                    console.log('data submitted');
                    window.location.href = "child_add.html";
                },
                error: function (xhr, status, error) {
                    alert("form submit failed");
                    console.log(status)
                    console.log(error)
                }
            });
        },
        error: function (xhr, status, error) {
            alert("form submit failed");
        }
    });
}

// Function to submit the form data
function saveForm() {
    const form = document.getElementById("admission_form");
    const formData = new FormData(form);
    const obj = Object.fromEntries(formData);
    console.log(obj);
    // obj.child_id = "NCD0005"; 
    const logged_in_email = localStorage.getItem('logged_in_email');
    const parent_name = localStorage.getItem('parent_name');
    obj.on_process = true;
    obj.parent_email_one = logged_in_email;
    obj.parent_name = parent_name;
    obj.parent_id = localStorage.getItem('parent_id')
    const child_id_val = localStorage.getItem('child_id');
    if (child_id_val !== null && child_id_val !== undefined) {
        obj.child_id = child_id_val;
    }
    console.log(JSON.stringify(obj));
    $.ajax({
        url: "https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/admission/add",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(obj),
        success: function (response) {
            console.log('data submitted');
            console.log(response.child_id);
            localStorage.setItem('child_id', response.child_id)
            // window.location.href = "child_add.html";
        },
        error: function (xhr, status, error) {
            alert("form submit failed");
        }
    });
}

$(document).ready(function () {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
    } else {
        document.body.style.visibility = 'visible';

        // Add click event listener to the "Save" button
        $("#first_save_button").on("click", function (e) {
            e.preventDefault(); // Prevent the default form submission
            if ($(this).prop("disabled")) {
                return; // If the button is already disabled, do nothing and return
            }
            $(this).prop("disabled", true); // Disable the button after the first click
            saveForm();
        });
        $("#second_save_button").on("click", function (e) {
            e.preventDefault(); // Prevent the default form submission
            if ($(this).prop("disabled")) {
                return; // If the button is already disabled, do nothing and return
            }
            $(this).prop("disabled", true); // Disable the button after the first click
            saveForm();
        });
        $("#third_save_button").on("click", function (e) {
            e.preventDefault(); // Prevent the default form submission
            if ($(this).prop("disabled")) {
                return; // If the button is already disabled, do nothing and return
            }
            $(this).prop("disabled", true); // Disable the button after the first click
            saveForm();
        });
        $("#four_save_button").on("click", function (e) {
            e.preventDefault(); // Prevent the default form submission
            if ($(this).prop("disabled")) {
                return; // If the button is already disabled, do nothing and return
            }
            $(this).prop("disabled", true); // Disable the button after the first click
            saveForm();
        });
        $("#five_save_button").on("click", function (e) {
            e.preventDefault(); // Prevent the default form submission
            if ($(this).prop("disabled")) {
                return; // If the button is already disabled, do nothing and return
            }
            $(this).prop("disabled", true); // Disable the button after the first click
            saveForm();
        });
        $("#six_save_button").on("click", function (e) {
            e.preventDefault(); // Prevent the default form submission
            if ($(this).prop("disabled")) {
                return; // If the button is already disabled, do nothing and return
            }
            $(this).prop("disabled", true); // Disable the button after the first click
            saveForm();
        });
        $("#seven_save_button").on("click", function (e) {
            e.preventDefault(); // Prevent the default form submission
            if ($(this).prop("disabled")) {
                return; // If the button is already disabled, do nothing and return
            }
            $(this).prop("disabled", true); // Disable the button after the first click
            saveForm();
        });
        $("#eight_save_button").on("click", function (e) {
            e.preventDefault(); // Prevent the default form submission
            if ($(this).prop("disabled")) {
                return; // If the button is already disabled, do nothing and return
            }
            $(this).prop("disabled", true); // Disable the button after the first click
            saveForm();
        });
        $("#nine_save_button").on("click", function (e) {
            e.preventDefault(); // Prevent the default form submission
            if ($(this).prop("disabled")) {
                return; // If the button is already disabled, do nothing and return
            }
            $(this).prop("disabled", true); // Disable the button after the first click
            saveForm();
        });
        $("#submit_button").on("click", function (e) {
            e.preventDefault(); // Prevent the default form submission
            if ($(this).prop("disabled")) {
                return; // If the button is already disabled, do nothing and return
            }
            $(this).prop("disabled", true); // Disable the button after the first click
            submitForm();
        });

    }
});

jQuery(document).ready(function () {
    // click on next button
    jQuery('.form-wizard-next-btn').click(function () {
        var parentFieldset = jQuery(this).parents('.wizard-fieldset');
        var currentActiveStep = jQuery(this).parents('.form-wizard')
            .find('.form-wizard-steps .active');
        var next = jQuery(this);
        var nextWizardStep = true;
        parentFieldset.find('.wizard-required').each(function () {
            var thisValue = jQuery(this).val();

            if (thisValue == "") {
                jQuery(this).siblings(".wizard-form-error").slideDown();
                nextWizardStep = false;
            }
            else {
                jQuery(this).siblings(".wizard-form-error").slideUp();
            }
        });
        if (nextWizardStep) {
            next.parents('.wizard-fieldset').removeClass("show", "400");
            currentActiveStep.removeClass('active').addClass('activated').next()
                .addClass('active', "400");
            next.parents('.wizard-fieldset').next('.wizard-fieldset').addClass("show", "400");
            jQuery(document).find('.wizard-fieldset').each(function () {
                if (jQuery(this).hasClass('show')) {
                    var formAtrr = jQuery(this).attr('data-tab-content');
                    jQuery(document).find('.form-wizard-steps .form-wizard-step-item')
                        .each(function () {
                            if (jQuery(this).attr('data-attr') == formAtrr) {
                                jQuery(this).addClass('active');
                                var innerWidth = jQuery(this).innerWidth();
                                var position = jQuery(this).position();
                                jQuery(document).find('.form-wizard-step-move')
                                    .css({"left": position.left, "width": innerWidth});
                            } else {
                                jQuery(this).removeClass('active');
                            }
                        });
                }
            });
        }
    });
    //click on previous button
    jQuery('.form-wizard-previous-btn').click(function () {
        var counter = parseInt(jQuery(".wizard-counter").text());
        ;
        var prev = jQuery(this);
        var currentActiveStep = jQuery(this).parents('.form-wizard')
            .find('.form-wizard-steps .active');
        prev.parents('.wizard-fieldset').removeClass("show", "400");
        prev.parents('.wizard-fieldset').prev('.wizard-fieldset').addClass("show", "400");
        currentActiveStep.removeClass('active').prev().removeClass('activated')
            .addClass('active', "400");
        jQuery(document).find('.wizard-fieldset').each(function () {
            if (jQuery(this).hasClass('show')) {
                var formAtrr = jQuery(this).attr('data-tab-content');
                jQuery(document).find('.form-wizard-steps .form-wizard-step-item')
                    .each(function () {
                        if (jQuery(this).attr('data-attr') == formAtrr) {
                            jQuery(this).addClass('active');
                            var innerWidth = jQuery(this).innerWidth();
                            var position = jQuery(this).position();
                            jQuery(document).find('.form-wizard-step-move')
                                .css({"left": position.left, "width": innerWidth});
                        } else {
                            jQuery(this).removeClass('active');
                        }
                    });
            }
        });
    });
    //click on form submit button
    jQuery(document).on("click", ".form-wizard .form-wizard-submit", function () {
        var parentFieldset = jQuery(this).parents('.wizard-fieldset');
        var currentActiveStep = jQuery(this).parents('.form-wizard')
            .find('.form-wizard-steps .active');
        parentFieldset.find('.wizard-required').each(function () {
            var thisValue = jQuery(this).val();
            if (thisValue == "") {
                jQuery(this).siblings(".wizard-form-error").slideDown();
            } else {
                jQuery(this).siblings(".wizard-form-error").slideUp();
            }
        });
    });
    // focus on input field check empty or not
    jQuery(".form-control").on('focus', function () {
        var tmpThis = jQuery(this).val();
        if (tmpThis == '') {
            jQuery(this).parent().addClass("focus-input");
        } else if (tmpThis != '') {
            jQuery(this).parent().addClass("focus-input");
        }
    }).on('blur', function () {
        var tmpThis = jQuery(this).val();
        if (tmpThis == '') {
            jQuery(this).parent().removeClass("focus-input");
            jQuery(this).siblings('.wizard-form-error').slideDown("3000");
        } else if (tmpThis != '') {
            jQuery(this).parent().addClass("focus-input");
            jQuery(this).siblings('.wizard-form-error').slideUp("3000");
        }
    });
});


