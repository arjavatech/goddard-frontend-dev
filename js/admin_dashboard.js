import {signOut,isAuthenticated} from "./authenticationVerify.js";

// Signout button event listener
document.getElementById('btn-signout').addEventListener('click', signOut);

// Function to submit the form data
// function saveForm() {
//     const form = document.getElementById("admission_form");
//     const formData = new FormData(form);
//     const obj = Object.fromEntries(formData);
//     obj.year = new Date().getFullYear() + '';
//     // const json=  JSON.stringify(obj);
//     $.ajax({
//         url: " https://6flxkkqvr4.execute-api.us-west-2.amazonaws.com/dev/parent_invite_info/add",
//         type: "POST",
//         contentType: "application/json",
//         data: JSON.stringify(obj),
//         success: function (response) {
//             // window.location.href = "admin_dashboard.html";
//             // ("form submitted successfully");
//         },
//         error: function (xhr, status, error) {
//             alert("form submit failed");
//         }
//     });
// }



$(document).ready(function () {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
    } else {
        document.body.style.visibility = 'visible';
        // $("#saveButton").on("click", function (e) {
        //     e.preventDefault(); // Prevent the default form submission
        //     const saveButton = document.getElementById("saveButton");
        //     saveButton.disabled = 'true';
        //     const emailButton = document.getElementById("emailButtonDiv");
        //     emailButton.style.display ="block";
        //     saveForm();
        // });
        // $("#active_form_list").on("click", function (e) {
        //     e.preventDefault();
        //      activeFormList();
        // });
    }
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
});

