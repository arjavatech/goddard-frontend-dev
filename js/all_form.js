import {isAuthenticated} from "./authenticationVerify.js";


// Function to submit the form data
function submitForm(editID) {
    console.log(editID);
    const form = document.getElementById("childInfo");
    const formData = new FormData(form);
    const obj = Object.fromEntries(formData);
    obj.on_process = false
    if(editID != ''){
        obj.primary_parent_email = editID;
    }else{
        obj.primary_parent_email = localStorage.getItem('logged_in_email');
    }
    const child_id_val = localStorage.getItem('child_id');
    if (child_id_val !== null && child_id_val !== undefined) {
        obj.child_id = child_id_val; 
    }
    const json = JSON.stringify(obj);
    console.log(json);
    $.ajax({
        url: "http://localhost:8080/admission_child_personal/additional",
        type: "POST",
        contentType: "application/json",
        data: json,
        success: function (response) {
            alert(response.message)
            $(".success-msg-save").show();
                setTimeout(function(){
                $(".success-msg-save").hide();
                // window.location.reload();
                // window.location.href = 'child_add.html';
            }, 3000);  
        },
        error: function (xhr, status, error) {
            // console.log(error);
            // console.log(status);
            alert("failed to save admission form");
        }
    });
}

// Function to submit the form data
function saveForm(editID) {
    console.log(editID);
    const form = document.getElementById("childInfo");
    const formData = new FormData(form);
    console.log(formData);
    const obj = Object.fromEntries(formData);
    obj.on_process = true;
    const parenthanbook_details = {
        welcome_goddard_agreement : obj.welcome_goddard_agreement,
        medical_care_provider_agreement :obj.medical_care_provider_agreement,
        parent_access_agreement :obj.parent_access_agreement,
        release_of_children_agreement :obj.release_of_children_agreement,
        registration_fees_agreement :obj.registration_fees_agreement,
        outside_engagements_agreement :obj.outside_engagements_agreement,
        health_policies_agreement :obj.health_policies_agreement,
        medication_procedures_agreement :obj.medication_procedures_agreement,
        bring_to_school_agreement :obj.bring_to_school_agreement,
        rest_time_agreement :obj.rest_time_agreement,
        training_philosophy_agreement :obj.training_philosophy_agreement,
        affiliation_policy_agreement :obj.affiliation_policy_agreement,
        security_issue_agreement :obj.security_issue_agreement,
        addressing_individual_child_agreement :obj.addressing_individual_child_agreement,
        finalword_agreement :obj.finalword_agreement,
        mission_statement_agreement : obj.mission_statement_agreement,
        general_information_agreement : obj.general_information_agreement,
        parent_sign_handbook : obj.parent_sign_handbook,
        parent_sign_date_handbook : obj.parent_sign_date_handbook,
        admin_sign_handbook : obj.admin_sign_handbook,
        admin_sign_date_handbook : obj.admin_sign_date_handbook
    }
    // const handbook_string = JSON.stringify(parenthanbook_details);
    // console.log(handbook_string);
    obj.parent_hand_book= parenthanbook_details;
    if(editID != ''){
        obj.primary_parent_email = editID;
    }else{
        obj.primary_parent_email = localStorage.getItem('logged_in_email');
    }
    const child_id_val = localStorage.getItem('child_id');

    if (child_id_val !== null && child_id_val !== undefined) {
        obj.child_id = child_id_val; 
    }
    const json = JSON.stringify(obj);
    console.log(json);
    $.ajax({
        url: "http://localhost:8080/admission_child_personal/additional",
        type: "POST",
        contentType: "application/json",
        data: json,
        success: function (response) {
            alert(response.message)
            window.location.reload();
        },
        error: function (xhr, status, error) {
            console.log(status);
            console.log(error);
        }
    });
    // let xhr = new XMLHttpRequest();
    // xhr.onload = () => {
    //     if (xhr.status === 200) {
    //         localStorage.setItem('child_id', response.child_id);
    //         // alert('checking submit');
    //         window.location.reload();
    //     }else{
    //         alert("failed to save admission form");
    //     }
    // };
    // xhr.open("POST", "http://localhost:8080/admission_child_personal/additional");
    // xhr.setRequestHeader("Content-Type", "application/json");
    // xhr.send(json);
}

function clearForm(){
    window.location.reload();
}

$(document).ready(function () {
    // alert('456')
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
    } else {
        document.body.style.visibility = 'visible';
        let samplejson = {};
        $.ajax({
            url: `http://localhost:8080/goddard_all_form/all_active_forms`,
            type: 'GET',
            success: function(response){
                // extract main_topic values and store them in an array
                let mainTopics = [];
                for (let res in response) {
                    mainTopics.push(response[res].main_topic);
                }
                // sort the array alphabetically
                mainTopics.sort();
                console.log(mainTopics);
                // iterate through the sorted array
                for (let i = 0; i < mainTopics.length; i++) {
                    let mainTopic = mainTopics[i];
                    let trimValues = mainTopic.replace(/\s+/g,'').toLowerCase();

                    $.get(trimValues + "ListItem.html", function(data) {
                        $("#menu").append(data);
                    });
                    if (trimValues == 'admissionforms' || trimValues == 'authorization' || trimValues == 'enrollmentagreement' || trimValues == 'parenthandbook') {
                        $(`.tab-content.${trimValues}`).load(trimValues + ".html"); // Assuming classes like 'admissionforms', 'authorization', etc.
                        $('.svg').append('<svg width="12px" height="10px" viewbox="0 0 12 10"><polyline points="1.5 6 4.5 9 10.5 1"></polyline></svg>');
                    }
                }
            }
        });
        let editID = window.location.search.slice(4);
        console.log(editID);
        $(document).on("click", ".save-btn", function(e) {
            e.preventDefault();
            saveForm(editID);
        });
        $(document).on("click", ".submit-btn", function(e) {
            console.log('submitcall')
            e.preventDefault();
            submitForm(editID);
        });
        $(document).on("click", ".cancel-btn", function(e) {
            e.preventDefault();
            clearForm();
        });

        // $("#child_basic_info").on("click", function (e) {
        //     alert("sdvsdfvbsdfbsd");
        //     e.preventDefault(); // Prevent the default form submission
        //     saveForm();
        // });
        // $("#parent_info").on("click", function (e) {
        //     e.preventDefault(); // Prevent the default form submission
        //     saveForm();
        // });
        // $("#emergency_info").on("click", function (e) {
        //     e.preventDefault(); // Prevent the default form submission
        //     saveForm();
        // });
        // $("#fourth_save").on("click", function (e) {
        //     e.preventDefault(); // Prevent the default form submission
        //     saveForm();
        // });
        // $("#fifth_save").on("click", function (e) {
        //     e.preventDefault(); // Prevent the default form submission
        //     saveForm();
        // });
        // $("#sixth_save").on("click", function (e) {
        //     e.preventDefault(); // Prevent the default form submission
        //     saveForm();
        // });
        // $("#seventh_save").on("click", function (e) {
        //     e.preventDefault(); // Prevent the default form submission
        //     saveForm();
        // });
        // $("#eigth_save").on("click", function (e) {
        //     e.preventDefault(); // Prevent the default form submission
        //     saveForm();
        // });
        // $("#nine_save").on("click", function (e) {
        //     e.preventDefault(); // Prevent the default form submission
        //     saveForm();
        // });
        // $("#ten_save").on("click", function (e) {
        //     e.preventDefault(); // Prevent the default form submission
        //     saveForm();
        // });
        // $("#eleven_save").on("click", function (e) {
        //     e.preventDefault(); // Prevent the default form submission
        //     saveForm();
        // });
        // $("#twelve_save").on("click", function (e) {
        //     e.preventDefault(); // Prevent the default form submission
        //     saveForm();
        // });
        // $("#thirteen_save").on("click", function (e) {
        //     e.preventDefault(); // Prevent the default form submission
        //     saveForm();
        // });
        // $("#fourteen_save").on("click", function (e) {
        //     e.preventDefault(); // Prevent the default form submission
        //     saveForm();
        // });
        // $("#fifteen_save").on("click", function (e) {
        //     e.preventDefault(); // Prevent the default form submission
        //     saveForm();
        // });
        // $("#sixteen_save").on("click", function (e) {
        //     e.preventDefault(); // Prevent the default form submission
        //     saveForm();
        // });
        // $("#seventeen_save").on("click", function (e) {
        //     e.preventDefault(); // Prevent the default form submission
        //     saveForm();
        // });
        // $("#eighteen_save").on("click", function (e) {
        //     e.preventDefault(); // Prevent the default form submission
        //     saveForm();
        // });
        // $("#nineteen_save").on("click", function (e) {
        //     e.preventDefault(); // Prevent the default form submission
        //     saveForm();
        // });
        // $("#twenty_save").on("click", function (e) {
        //     e.preventDefault(); // Prevent the default form submission
        //     saveForm();
        // });
        // $("#twentyone_save").on("click", function (e) {
        //     e.preventDefault(); // Prevent the default form submission
        //     saveForm();
        // });
        // $("#twentytwo_save").on("click", function (e) {
        //     e.preventDefault(); // Prevent the default form submission
        //     saveForm();
        // });
        // $("#twentythree_save").on("click", function (e) {
        //     e.preventDefault(); // Prevent the default form submission
        //     saveForm();
        // });
        // $("#twentyfour_save").on("click", function (e) {
        //     e.preventDefault(); // Prevent the default form submission
        //     saveForm();
        // });
        // $("#twentyfive_save").on("click", function (e) {
        //     e.preventDefault(); // Prevent the default form submission
        //     saveForm();
        // });
        // $("#twentysix_save").on("click", function (e) {
        //     e.preventDefault(); // Prevent the default form submission
        //     saveForm();
        // });
        // $("#parent_two_info").on("click", function (e) {
        //     e.preventDefault(); // Prevent the default form submission
        //     saveForm();
        // });
    
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


