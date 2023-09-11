import {isAuthenticated} from "./authenticationVerify.js";


export function authorizationFormDetails(callback) {
    $.ajax({
        url: `https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/ach/fetch/${localStorage.getItem('child_id')}?year=${localStorage.getItem('form_year_value')}`,
        type: 'get',
        success: function(response){
            console.log(response);

            // Set values of form fields
            if (typeof response.child_name !== "undefined"){
                document.getElementById("child_name").value = response.child_name;
            }
            if (typeof response.parent_name !== "undefined"){
                document.getElementById("parent_name").value = response.parent_name;
            }
            if (typeof response.bank_routing !== "undefined"){
                document.getElementById("bank_routing").value = response.bank_routing;
            }
            if (typeof response.bank_account !== "undefined"){
                document.getElementById("bank_account").value = response.bank_account;
            }
            if (typeof response.driver_license !== "undefined"){
                document.getElementById("driver_license").value = response.driver_license;
            }
            if (typeof response.state !== "undefined"){
                document.getElementById("state").value = response.state;
            }
            if (typeof response.email !== "undefined"){
                document.getElementById("email").value = response.email;
            }
            if (typeof response.i !== "undefined"){
                document.getElementById("i").value = response.i;
            }
            if (typeof response.signature !== "undefined"){
                document.getElementById("signature").value = response.signature;
            }
            if (typeof response.date !== "undefined"){
                document.getElementById("date").value = response.date;
            }

            if (typeof callback === 'function') {
                callback();
            }
        }
    })
}


// Function to submit the form data
function submitForm() {
    const form = document.getElementById("authorization_form");
    const formData = new FormData(form);
    const obj = Object.fromEntries(formData);
    console.log(obj);
    obj.child_id = localStorage.getItem('child_id');
    obj.year = new Date().getFullYear() + '';
    console.log(obj);
    const json=  JSON.stringify(obj);
    console.log(json);
    // $.ajax({
    //     url: "https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/ach/add",
    //     type: "POST",
    //     contentType: "application/json",
    //     data: json,
    //     success: function (response) {
    //         alert("success");
    //         window.location.href = "parent_dashboard.html";
    //     },
    // });
    let xhr = new XMLHttpRequest();
    xhr.onload = () => {
        if (xhr.status === 200) {
            window.location.href = "parent_dashboard.html";
        }else{
            window.location.reload();
        }
    };
    xhr.open("POST", "https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/ach/add");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(json);
}

function mainEntryPoint() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
    } else {
        document.body.style.visibility = 'visible';
        $("#submit_button").on("click", function (e) {
            e.preventDefault(); // Prevent the default form submission
            submitForm();
        });
        authorizationFormDetails();
       
    }
}
// Check if this script is the main entry point and call the main function
if (window.location.pathname.endsWith('authorization_form.html')) {
    mainEntryPoint();
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


