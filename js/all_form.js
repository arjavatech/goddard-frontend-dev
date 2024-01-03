import {isAuthenticated} from "./authenticationVerify.js";

// Function to submit the form data
function submitForm() {
    const form = document.getElementById("childInfo");
    const formData = new FormData(form);
    const obj = Object.fromEntries(formData);
    obj.on_process = false
   obj.primary_parent_email = localStorage.getItem('logged_in_email');
    const child_id_val = localStorage.getItem('child_id');
    if (child_id_val !== null && child_id_val !== undefined) {
        obj.child_id = child_id_val; 
    }
    const json = JSON.stringify(obj);
    $.ajax({
        url: "http://localhost:8080/admission_child_personal/additional",
        type: "POST",
        contentType: "application/json",
        data: json,
        success: function (response) {
            alert(response.message)
            window.location.href = 'child_add.html';
        },
        error: function (xhr, status, error) {
            console.log(error);
            console.log(status);
            alert("failed to save admission form");
        }
    });
}

// Function to submit the form data
function saveForm() {
    const form = document.getElementById("childInfo");
    const formData = new FormData(form);
    const obj = Object.fromEntries(formData);
    obj.on_process = true;
    obj.primary_parent_email = localStorage.getItem('logged_in_email');
    const child_id_val = localStorage.getItem('child_id');
    if (child_id_val !== null && child_id_val !== undefined) {
        obj.child_id = child_id_val; 
    }
    const json = JSON.stringify(obj);
    console.log(json);
    // $.ajax({
    //     url: "http://localhost:8080/admission_child_personal/additional",
    //     type: "POST",
    //     contentType: "application/json",
    //     data: JSON.stringify(obj),
    //     success: function (response) {
    //         alert(response.message)
    //         window.location.reload();
    //     },
    //     error: function (xhr, status, error) {
    //         console.log(error);
    //         console.log(status);
    //         alert("failed to save admission form");
    //     }
    // });
    let xhr = new XMLHttpRequest();
    xhr.onload = () => {
        if (xhr.status === 200) {
            // localStorage.setItem('child_id', response.child_id);
           alert('checking');
            // alert('checking submit');
            window.location.reload();
        }else{
            alert("failed to save admission form");
        }
    };
    xhr.open("POST", "http://localhost:8080/admission_child_personal/additional");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(json);
}

function clearForm(){
    window.location.reload();
}

$(document).ready(function () {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
    } else {
        document.body.style.visibility = 'visible';
 
        // Add click event listener to the "Save" button
        $("#child_basic_info").on("click", function (e) {
            e.preventDefault(); // Prevent the default form submission
            saveForm();
        });
        $("#parent_info").on("click", function (e) {
            e.preventDefault(); // Prevent the default form submission
            saveForm();
        });
        $("#emergency_info").on("click", function (e) {
            e.preventDefault(); // Prevent the default form submission
            saveForm();
        });
        $("#fourth_save").on("click", function (e) {
            e.preventDefault(); // Prevent the default form submission
            saveForm();
        });
        $("#fifth_save").on("click", function (e) {
            e.preventDefault(); // Prevent the default form submission
            saveForm();
        });
        $("#sixth_save").on("click", function (e) {
            e.preventDefault(); // Prevent the default form submission
            saveForm();
        });
        $("#seventh_save").on("click", function (e) {
            e.preventDefault(); // Prevent the default form submission
            saveForm();
        });
        $("#eigth_save").on("click", function (e) {
            e.preventDefault(); // Prevent the default form submission
            saveForm();
        });
        $("#nine_save").on("click", function (e) {
            e.preventDefault(); // Prevent the default form submission
            saveForm();
        });
        $("#ten_save").on("click", function (e) {
            e.preventDefault(); // Prevent the default form submission
            saveForm();
        });
        $("#eleven_save").on("click", function (e) {
            e.preventDefault(); // Prevent the default form submission
            saveForm();
        });
        $("#twelve_save").on("click", function (e) {
            e.preventDefault(); // Prevent the default form submission
            saveForm();
        });
        $("#thirteen_save").on("click", function (e) {
            e.preventDefault(); // Prevent the default form submission
            saveForm();
        });
        $("#fourteen_save").on("click", function (e) {
            e.preventDefault(); // Prevent the default form submission
            saveForm();
        });
        $("#fifteen_save").on("click", function (e) {
            e.preventDefault(); // Prevent the default form submission
            saveForm();
        });
        $("#sixteen_save").on("click", function (e) {
            e.preventDefault(); // Prevent the default form submission
            saveForm();
        });
        $("#seventeen_save").on("click", function (e) {
            e.preventDefault(); // Prevent the default form submission
            saveForm();
        });
        $("#eighteen_save").on("click", function (e) {
            e.preventDefault(); // Prevent the default form submission
            saveForm();
        });
        $("#nineteen_save").on("click", function (e) {
            e.preventDefault(); // Prevent the default form submission
            saveForm();
        });
        $("#twenty_save").on("click", function (e) {
            e.preventDefault(); // Prevent the default form submission
            saveForm();
        });
        $("#twentyone_save").on("click", function (e) {
            e.preventDefault(); // Prevent the default form submission
            saveForm();
        });
        $("#twentytwo_save").on("click", function (e) {
            e.preventDefault(); // Prevent the default form submission
            saveForm();
        });
        $("#twentythree_save").on("click", function (e) {
            e.preventDefault(); // Prevent the default form submission
            saveForm();
        });
        $("#twentyfour_save").on("click", function (e) {
            e.preventDefault(); // Prevent the default form submission
            saveForm();
        });
        $("#twentyfive_save").on("click", function (e) {
            e.preventDefault(); // Prevent the default form submission
            saveForm();
        });
        $("#twentysix_save").on("click", function (e) {
            e.preventDefault(); // Prevent the default form submission
            saveForm();
        });
        $("#parent_two_info").on("click", function (e) {
            e.preventDefault(); // Prevent the default form submission
            saveForm();
        });
       
        $(".handbook_button").on("click", function (e) {
            e.preventDefault(); // Prevent the default form submission
            saveForm();
        });
        $("#submit_button").on("click", function (e) {
            e.preventDefault(); // Prevent the default form submission
            submitForm();
        });
        $("#cancelButton").on("click", function (e) {
            e.preventDefault(); // Prevent the default form submission
            clearForm();
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


