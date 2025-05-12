import { isAuthenticated } from "./authentication_verify.js";
// import { loadIncompleteFormSections } from "./form_section.js";

let child_response = null;

function showSpinner() {
    const spinner = document.getElementById("spinner");
    console.log(spinner);
    if (spinner) spinner.style.display = "block";
}

function hideSpinner() {
    const spinner = document.getElementById("spinner");
    if (spinner) spinner.style.display = "none";
}

function clearLocalStorageExcept(keysToKeep) {
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key) && !keysToKeep.includes(key)) {
            localStorage.removeItem(key);
        }
    }
}

function checkParentAuthentication(editID, callback) {
    const logged_in_email = localStorage.getItem("logged_in_email");
    // const is_admin = localStorage.getItem('is_admin');
    let url;
    if (
        editID == logged_in_email ||
        logged_in_email == "goddard01arjava@gmail.com" ||
        editID == ""
    ) {
        // (stop user to see other kids || check admin login || default parent login)
        if (editID != "") {
            url = `https://zjnj2xrqwg.execute-api.ap-south-1.amazonaws.com/prod/admission_child_personal/parent_email/${editID}`;
        } else {
            url = `https://zjnj2xrqwg.execute-api.ap-south-1.amazonaws.com/prod/admission_child_personal/parent_email/${logged_in_email}`;
        }
        $.ajax({
            url: url,
            type: "get",
            success: function (response) {
                let keysToKeep = ["logged_in_email"];
                clearLocalStorageExcept(keysToKeep);
                // localStorage.clear()
                if (response["parent_name"]) {
                    localStorage.setItem("parent_name", response["parent_name"]);
                    //    localStorage.setItem('parent_id', response[0].id)
                }
                if (typeof callback === "function") {
                    callback();
                }
            },
        });
    } else {
        window.location.href = "login.html";
    }
}

function getAllInfo(editID, callback) {
    const logged_in_email = localStorage.getItem("logged_in_email");

    let url;
    if (editID != "") {
        url = `https://zjnj2xrqwg.execute-api.ap-south-1.amazonaws.com/prod/admission_child_personal/parent_email/${editID}`;
    } else {
        url = `https://zjnj2xrqwg.execute-api.ap-south-1.amazonaws.com/prod/admission_child_personal/parent_email/${logged_in_email}`;
    }

    $.ajax({
        url: url,
        type: "get",
        success: function (response) {
            // localStorage.clear()
            if (response["children"]) {
                // Iterate through all the child and store the response
                child_response = response["children"];
                localStorage.setItem(
                    "number_of_children",
                    response["children"].length.toString()
                );
            }

            if (typeof callback === "function") {
                callback();
            }

        },
    });
}

function responseToAuthenticationCheck() {
    const parentName = localStorage.getItem("logged_in_email");
    if (parentName !== "undefined" && parentName !== null) {
        document.body.style.visibility = "visible";
    } else {
        document.getElementById("welcomeText").innerHTML = "Parent not found";
        window.alert("Parent Not found");
        window.history.back();
    }
}

function loadDynamicCards() {
    let responseSize = parseInt(localStorage.getItem("number_of_children"), 10);
    let parentContainer = document.getElementById("dynamicChildCards");
    // console.log(parentContainer);
    let putcallId = sessionStorage.getItem("putcallId");
    // console.log(putcallId);

    parentContainer.innerHTML = "";
    for (let i = 0; i < responseSize; i++) {
        // console.log(child_response[i].child_id);
        let on_process = child_response[i].on_process;

        let div = document.createElement("li");
        div.setAttribute("class", "nav-item");

        let anchor = document.createElement("a");
        anchor.setAttribute("class", "nav-link ");
        // anchor.classList.add('anchorvalue');
        anchor.setAttribute("data-child-id", child_response[i].child_id);

        let card = document.createElement("div");
        card.setAttribute("style", "height:40px");

        anchor.addEventListener("click", function () {
            let allTabs = document.querySelectorAll(".nav-link");
            allTabs.forEach((tab) => tab.classList.remove("active"));
            anchor.classList.add("active");

            const selectedChildName = child_response[i].child_first_name;
            const selectedChildId = child_response[i].child_id;
            localStorage.setItem("child_name", selectedChildName);
            localStorage.setItem("child_id", selectedChildId);
            checking(selectedChildId);
        });

        let cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        let childName = document.createElement("h6");
        childName.id = child_response[i].child_id;
        childName.classList.add("text-center", "dashboard_card_text", "h6");
        childName.innerHTML = child_response[i].child_first_name;

        cardBody.appendChild(childName);
        card.appendChild(cardBody);
        anchor.appendChild(card);
        div.appendChild(anchor);
        parentContainer.appendChild(div);
    }

    if (!putcallId) {
        if (responseSize > 0) {
            let firstAnchor = parentContainer.querySelector("a.nav-link");
            console.log(firstAnchor);
            if (firstAnchor) {
                firstAnchor.classList.add("active");
                const selectedChildName = child_response[0].child_first_name;
                const selectedChildId = child_response[0].child_id;
                localStorage.setItem("child_name", selectedChildName);
                localStorage.setItem("child_id", selectedChildId);
                checking(selectedChildId);
            }
        }
    } else {
        let selectedAnchor = parentContainer.querySelector(
            `a.nav-link[data-child-id='${putcallId}']`
        );
        if (selectedAnchor) {
            selectedAnchor.classList.add("active");
        }
        localStorage.setItem("child_id", putcallId);
        checking(putcallId);
    }
}

function welcomeText() {
    const parentName = localStorage.getItem("parent_name");

    if (localStorage.getItem("logged_in_email") == "goddard01arjava@gmail.com") {
        document.getElementById("welcomeText").innerHTML = "Welcome Admin";
        loadDynamicCards();
    } else {
        document.getElementById("welcomeText").innerHTML = "Welcome " + parentName;
        loadDynamicCards();
    }
    // createAddChildButton();
    // additionalHtmlContainer.style.display = 'block';
}

function printContent(hiddenDiv) {
    console.log("Hidden div to print:", hiddenDiv);
    let printWindow = window.open("", "", "height=1400,width=1500");
    let formContent = hiddenDiv.innerHTML;

    printWindow.document.write("<html><head><title>Print Form</title>");
    printWindow.document.write("</head><body>");
    printWindow.document.write(formContent);
    printWindow.document.write("</body></html>");
    printWindow.document.close();

    printWindow.onload = function () {
        printWindow.focus();
        printWindow.print();
        printWindow.onafterprint = function () {
            printWindow.close();
            document.body.removeChild(hiddenDiv);
        };
    };
}

function generatePDFContent() {
    return new Promise((resolve) => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF("p", "mm", [1500, 1400]);
        let formContent = document.querySelector("#formContent");
        formContent.style.display = "block";

        formContent
            .querySelectorAll('input[type="checkbox"]')
            .forEach((checkbox) => {
                checkbox.defaultChecked = checkbox.checked;
            });

        doc.html(formContent, {
            callback: function () {
                formContent.style.display = "none";
                resolve(doc);
            },
            x: 12,
            y: 12,
            autoPaging: "slice",
            html2canvas: {
                scale: 0.75,
            },
            pagesplit: true,
        });
    });
}

function extractEditIDFromURL(url) {
    let params = new URLSearchParams(url.split("?")[1]);
    let editID = params.get("id");
    return editID;
}

function populateFormData(editID, formName) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `https://zjnj2xrqwg.execute-api.ap-south-1.amazonaws.com/prod/child_all_form_details/fetch/${editID}`,
            type: "GET",
            success: function (response) {
                console.log(response);
                let form = document.querySelector("#formContent");
                if (!form) {
                    reject("Form content not found");
                    return;
                }

                if (formName === "authorization_form.pdf") {
                    const authFields = [
                        "bank_routing",
                        "bank_account",
                        "driver_license",
                        "state",
                        "i",
                        "parent_sign_ach",
                        "parent_sign_date_ach",
                    ];

                    authFields.forEach((field) => {
                        let element = form.querySelector(`[name='${field}']`);
                        if (element) {
                            element.setAttribute("value", response[field]);
                        }
                    });
                } else if (formName === "enrollment_form.pdf") {
                    const fields = [
                        "point_one_field_three",
                        "point_two_initial_here",
                        "point_three_initial_here",
                        "point_four_initial_here",
                        "point_five_initial_here",
                        "point_six_initial_here",
                        "point_seven_initial_here",
                        "point_eight_initial_here",
                        "point_nine_initial_here",
                        "point_ten_initial_here",
                        "point_eleven_initial_here",
                        "point_twelve_initial_here",
                        "point_thirteen_initial_here",
                        "point_fourteen_initial_here",
                        "point_fifteen_initial_here",
                        "point_sixteen_initial_here",
                        "point_seventeen_initial_here",
                        "point_eighteen_initial_here",
                        "point_ninteen_initial_here",
                        "parent_sign_enroll",
                        "parent_sign_date_enroll",
                        "preferred_start_date",
                        "preferred_schedule",
                        "child_first_name",
                        "dob",
                        "parent_email",

                    ];

                    fields.forEach((field) => {
                        if (response[field] !== undefined) {
                            let element = form.querySelector(`input[name='${field}']`);
                            if (element) {
                                element.setAttribute("value", response[field]);
                            }
                        }
                    });

                    const enroll_date = [
                        "parent_sign_date_enroll",
                    ];

                    enroll_date.forEach((field) => {
                        if (response[field] !== undefined) {
                            let element = form.querySelector(`input[name='point_one_field_one']`);
                            if (element) {
                                element.setAttribute("value", response[field]);
                            }
                        }
                    });
                    // Checkbox handling
                    const checkboxFields = ["full_day", "half_day"];

                    checkboxFields.forEach((field) => {
                        let element = form.querySelector(`[name='${field}']`);
                        if (element && response[field] == "on") {
                            element.setAttribute("checked", true);
                        }
                    });

                    // Handle nested objects for parent info (primary parent)
                    const parentFields = {
                        primary_parent_email: response.primary_parent_info?.parent_email,
                    };

                    Object.entries(parentFields).forEach(([field, value]) => {
                        let element = form.querySelector(`[name='${field}']`);
                        if (element && value !== undefined) {
                            element.setAttribute("value", value);
                        }
                    });

                    // Handle nested objects for parent info (primary parent)
                    const parentFieldsAddress = {
                        parent_street_address:
                            response.primary_parent_info?.parent_street_address,
                        parent_city_address:
                            response.primary_parent_info?.parent_city_address,
                        parent_state_address:
                            response.primary_parent_info?.parent_state_address,
                        parent_zip_address:
                            response.primary_parent_info?.parent_zip_address,

                    };
                    // Object.entries(parentFieldsAddress).forEach(([field, value]) => {
                    let element = form.querySelector(`[name='preferred_home_addr']`);
                    if (element !== undefined) {
                        let addressValue = parentFieldsAddress.parent_street_address
                            + "," + parentFieldsAddress.parent_city_address + "," +
                            parentFieldsAddress.parent_zip_address;
                        element.setAttribute("value", addressValue);
                    }
                    // });
                } else if (formName === "parent_handbook.pdf") {
                    const checkboxFields = [
                        "welcome_goddard_agreement",
                        "mission_statement_agreement",
                        "general_information_agreement",
                        "medical_care_provider_agreement",
                        "parent_access_agreement",
                        "release_of_children_agreement",
                        "registration_fees_agreement",
                        "outside_engagements_agreement",
                        "health_policies_agreement",
                        "medication_procedures_agreement",
                        "bring_to_school_agreement",
                        "rest_time_agreement",
                        "training_philosophy_agreement",
                        "affiliation_policy_agreement",
                        "security_issue_agreement",
                        "expulsion_policy_agreement",
                        "addressing_individual_child_agreement",
                        "finalword_agreement",
                    ];

                    checkboxFields.forEach((field) => {
                        if (response[field] == "on") {
                            let element = form.querySelector(`input[name='${field}']`);
                            if (element) {
                                element.setAttribute("checked", true);
                            }
                        } else {
                            let element = form.querySelector(`input[name='${field}']`);
                            if (element) {
                                element.setAttribute("checked", false);
                            }
                        }
                    });

                    const parentHandBookFields = [
                        "parent_sign_handbook",
                        "parent_sign_date_handbook",
                    ];

                    parentHandBookFields.forEach((field) => {
                        if (response[field] !== null) {
                            let element = form.querySelector(`input[name='${field}']`);
                            if (element) {
                                element.setAttribute("value", response[field]);
                            }
                        }
                    });
                    // } else if (formName === 'Admission Forms.pdf') {
                    //     const inputFields = [
                    //         'child_first_name', 'child_last_name', 'nick_name', 'dob','gender','do_relevant_custody_papers_apply', 'primary_language', 'school_age_child_school',
                    //         'parent_name', 'parent_street_address', 'parent_city_address', 'parent_state_address', 'parent_zip_address',
                    //         'home_telephone_number', 'business_name', 'work_hours', 'business_telephone_number', 'business_street_address',
                    //         'business_city_address', 'business_state_address', 'business_zip_address', 'business_cell_number',
                    //         'primary_parent_email', 'parent_two_name', 'parent_two_street_address', 'parent_two_city_address',
                    //         'parent_two_state_address', 'parent_two_zip_address', 'parent_two_home_telephone_number', 'parent_two_business_name',
                    //         'parent_two_work_hours', 'parent_two_business_telephone_number', 'parent_two_business_street_address',
                    //         'parent_two_business_city_address', 'parent_two_business_state_address', 'parent_two_business_zip_address',
                    //         'parent_two_business_cell_number', 'parent_email', 'child_emergency_contact_name', 'child_emergency_contact_full_address',
                    //         'child_emergency_contact_relationship', 'child_emergency_contact_telephone_number', 'child_care_provider_name',
                    //         'child_care_provider_telephone_number', 'child_hospital_affiliation', 'child_care_provider_street_address',
                    //         'child_care_provider_city_address', 'child_care_provider_state_address', 'child_care_provider_zip_address',
                    //         'child_dentist_name', 'dentist_telephone_number', 'dentist_address', 'special_diabilities', 'allergies_medication_reaction',
                    //         'additional_info', 'medication', 'health_insurance', 'policy_number', 'obtaining_emergency_medical_care',
                    //         'administration_first_aid_procedures','physical_exam_last_date','dental_exam_last_date', 'age_group_friends',
                    //         'neighborhood_friends', 'relationship_with_mother', 'allergies','asthma','bleeding_problems','diabetes',
                    //         'epilepsy','frequent_ear_infections','frequent_illnesses','hearing_problems',
                    //         'high_fevers','hospitalization','rheumatic_fever','seizures_convulsions',
                    //         'serious_injuries_accidents','surgeries','vision_problems','medical_other',
                    //         'illness_during_pregnancy','condition_of_newborn','duration_of_pregnancy','birth_weight_lbs',
                    //         'birth_weight_oz','complications','bottle_fed','breast_fed','other_siblings_name','other_siblings_age',
                    //         'relationship_with_father', 'relationship_with_siblings', 'relationship_with_extended_family', 'fears_conflicts',
                    //         'child_response_frustration', 'favorite_activities', 'last_five_years_moved', 'things_used_at_home', 'hours_of_television_daily',
                    //         'language_used_at_home', 'changes_at_home_situation', 'educational_expectations_of_child', 'important_fam_members',
                    //         'about_family_celebrations', 'reason_for_childcare_before', 'what_child_interests', 'drop_off_time', 'pick_up_time',
                    //         'restricted_diet_reason', 'eat_own_reason', 'favorite_foods', 'reason_for_rest_in_the_middle_day', 'rest_routine',
                    //         'reason_for_toilet_trained', 'explain_for_existing_illness_allergy', 'explain_for_functioning_at_age', 'explain_for_able_to_walk',
                    //         'explain_for_communicate_their_needs', 'explain_for_any_medication', 'explain_for_utilize_special_equipment',
                    //         'explain_for_significant_periods', 'explain_for_desire_any_accommodations', 'additional_information',
                    //         'child_password_pick_up_password_form', 'photo_usage_photo_video_permission_form', 'contact_emergency_medical_technicians_medical_transportation_waiver',
                    //         'parent_sign_admission', 'parent_sign_date_admission'
                    //     ];

                    //     inputFields.forEach(field => {

                    //         let element = form.querySelector(`[name='${field}']`);
                    //         console.log(element);
                    //         console.log(response[field]);
                    //         if (element && response[field] !== undefined) {
                    //             element.setAttribute('value', response[field]);
                    //         }
                    //     });

                    //     // Checkbox handling
                    //     const checkboxFields = [
                    //         'agree_all_above_information_is_correct',
                    //         'family_history_allergies','family_history_heart_problems','family_history_tuberculosis',
                    //         'family_history_asthma','family_history_high_blood_pressure',
                    //         'family_history_vision_problems','family_history_diabetes',
                    //         'family_history_hyperactivity','family_history_epilepsy',
                    //         'no_illnesses_for_this_child','agree_all_above_info_is_correct',
                    //         'do_you_agree_this_immunization_instructions','childcare_before',
                    //         'restricted_diet','eat_own','rest_in_the_middle_day','toilet_trained',
                    //         'existing_illness_allergy','functioning_at_age',
                    //         'able_to_walk','communicate_their_needs',
                    //         'any_medication','utilize_special_equipment',
                    //         'significant_periods','desire_any_accommodations',
                    //         'do_you_agree_this','do_you_agree_this_pick_up_password_form',
                    //         'photo_permission_agree_group_photos_electronic','do_you_agree_this_photo_video_permission_form',
                    //         'do_you_agree_this_security_release_policy_form','do_you_agree_this_medical_transportation_waiver',
                    //         'do_you_agree_this_health_policies','parent_sign_outside_waiver'
                    //     ];

                    //     checkboxFields.forEach(field => {
                    //         let element = form.querySelector(`[name='${field}']`);
                    //         if (element && response[field] == 1) {
                    //             element.setAttribute('checked', true);
                    //         }
                    //     });

                    //     inputFields.forEach(field => {
                    //         if (response[field] === 1) {
                    //             let element = form.querySelector(`input[name='${field}']`);
                    //             if (element) {
                    //                 element.setAttribute('checked', true);
                    //             }
                    //         } else {
                    //             let element = form.querySelector(`input[name='${field}']`);
                    //             if (element) {
                    //                 element.setAttribute('checked', false);
                    //             }
                    //         }
                    //     });

                    //     if(response.gender === "Male" ){
                    //         let element = form.querySelector(`input[id='gender1']`);
                    //         if (element) {
                    //             element.setAttribute('checked', true);
                    //         }
                    //     } else if(response.gender === "Female") {
                    //         let element = form.querySelector(`input[id='gender2']`);
                    //         if (element) {
                    //             element.setAttribute('checked', true);
                    //         }
                    //     } else {
                    //         let element = form.querySelector(`input[id='gender3']`);
                    //         if (element) {
                    //             element.setAttribute('checked', true);
                    //         }
                    //     }
                    // }
                } else if (formName === "admission_form.pdf") {
                    const inputFields = [
                        "child_first_name",
                        "child_last_name",
                        "nick_name",
                        "dob",
                        "gender",
                        "primary_language",
                        "school_age_child_school",
                        "special_diabilities",
                        "allergies_medication_reaction",
                        "additional_info",
                        "medication",
                        "health_insurance",
                        "policy_number",
                        "obtaining_emergency_medical_care",
                        "administration_first_aid_procedures",
                        "physical_exam_last_date",
                        "dental_exam_last_date",
                        "age_group_friends",
                        "neighborhood_friends",
                        "relationship_with_mother",
                        "allergies",
                        "asthma",
                        "bleeding_problems",
                        "diabetes",
                        "epilepsy",
                        "frequent_ear_infections",
                        "frequent_illnesses",
                        "hearing_problems",
                        "high_fevers",
                        "hospitalization",
                        "rheumatic_fever",
                        "seizures_convulsions",
                        "serious_injuries_accidents",
                        "surgeries",
                        "vision_problems",
                        "medical_other",
                        "illness_during_pregnancy",
                        "condition_of_newborn",
                        "duration_of_pregnancy",
                        "birth_weight_lbs",
                        "birth_weight_oz",
                        "complications",
                        "bottle_fed",
                        "breast_fed",
                        "other_siblings_name",
                        "other_siblings_age",
                        "relationship_with_father",
                        "relationship_with_siblings",
                        "relationship_with_extended_family",
                        "fears_conflicts",
                        "child_response_frustration",
                        "favorite_activities",
                        "last_five_years_moved",
                        "things_used_at_home",
                        "hours_of_television_daily",
                        "language_used_at_home",
                        "changes_at_home_situation",
                        "educational_expectations_of_child",
                        "important_fam_members",
                        "about_family_celebrations",
                        "reason_for_childcare_before",
                        "what_child_interests",
                        "drop_off_time",
                        "pick_up_time",
                        "restricted_diet_reason",
                        "eat_own_reason",
                        "favorite_foods",
                        "reason_for_rest_in_the_middle_day",
                        "rest_routine",
                        "reason_for_toilet_trained",
                        "explain_for_existing_illness_allergy",
                        "explain_for_functioning_at_age",
                        "explain_for_able_to_walk",
                        "explain_for_communicate_their_needs",
                        "explain_for_any_medication",
                        "explain_for_utilize_special_equipment",
                        "explain_for_significant_periods",
                        "explain_for_desire_any_accommodations",
                        "additional_information",
                        "child_password_pick_up_password_form",
                        "photo_usage_photo_video_permission_form",
                        "med_technicians_med_transportation_waiver",
                        "parent_sign_admission",
                        "parent_sign_date_admission",
                        "printed_name_social_media_post",
                    ];

                    inputFields.forEach((field) => {
                        let element = form.querySelector(`[name='${field}']`);
                        if (element && response[field] !== undefined) {
                            element.setAttribute("value", response[field]);
                        }
                    });
                    if (response.do_relevant_custody_papers_apply !== undefined) {
                        let custodyField = document.querySelector(
                            `[name='do_relevant_custody_papers_apply']`
                        );

                        // Check if the field exists and update its value
                        if (custodyField) {
                            custodyField.setAttribute(
                                "value",
                                response.do_relevant_custody_papers_apply === 2 ? "No" : "Yes"
                            );
                        }
                    }

                    // Handle nested objects for child care provider info
                    const childCareProviderFields = {
                        child_care_provider_name:
                            response.child_care_provider_info?.child_care_provider_name,
                        child_hospital_affiliation:
                            response.child_care_provider_info?.child_hospital_affiliation,
                        child_care_provider_zip_address:
                            response.child_care_provider_info
                                ?.child_care_provider_zip_address,
                        child_care_provider_city_address:
                            response.child_care_provider_info
                                ?.child_care_provider_city_address,
                        child_care_provider_state_address:
                            response.child_care_provider_info
                                ?.child_care_provider_state_address,
                        child_care_provider_street_address:
                            response.child_care_provider_info
                                ?.child_care_provider_street_address,
                        child_care_provider_telephone_number:
                            response.child_care_provider_info
                                ?.child_care_provider_telephone_number,
                    };

                    Object.entries(childCareProviderFields).forEach(
                        ([field, value]) => {
                            let element = form.querySelector(`[name='${field}']`);
                            if (element && value !== undefined) {
                                element.setAttribute("value", value);
                            }
                        }
                    );

                    // Handle nested objects for child dentist info
                    const childDentistFields = {
                        child_dentist_name:
                            response.child_dentist_info?.child_dentist_name,
                        dentist_zip_address:
                            response.child_dentist_info?.dentist_zip_address,
                        dentist_city_address:
                            response.child_dentist_info?.dentist_city_address,
                        dentist_state_address:
                            response.child_dentist_info?.dentist_state_address,
                        dentist_street_address:
                            response.child_dentist_info?.dentist_street_address,
                        dentist_telephone_number:
                            response.child_dentist_info?.dentist_telephone_number,
                    };

                    Object.entries(childDentistFields).forEach(([field, value]) => {
                        let element = form.querySelector(`[name='${field}']`);
                        if (element && value !== undefined) {
                            element.setAttribute("value", value);
                        }
                    });

                    // Handle nested objects for parent info (primary parent)
                    const parentFields = {
                        parent_name: response.primary_parent_info?.parent_name,
                        primary_parent_email: response.primary_parent_info?.parent_email,
                        home_telephone_number:
                            response.primary_parent_info?.parent_home_telephone_number,
                        parent_street_address:
                            response.primary_parent_info?.parent_street_address,
                        parent_city_address:
                            response.primary_parent_info?.parent_city_address,
                        parent_state_address:
                            response.primary_parent_info?.parent_state_address,
                        parent_zip_address:
                            response.primary_parent_info?.parent_zip_address,
                        business_name: response.primary_parent_info?.parent_business_name,
                        business_cell_number:
                            response.primary_parent_info?.parent_business_cell_number,
                        work_hours_from:
                            response.primary_parent_info?.parent_work_hours_from,
                        work_hours_to: response.primary_parent_info?.parent_work_hours_to,
                        business_telephone_number:
                            response.primary_parent_info?.parent_business_telephone_number,
                    };

                    Object.entries(parentFields).forEach(([field, value]) => {
                        let element = form.querySelector(`[name='${field}']`);
                        if (element && value !== undefined) {
                            element.setAttribute("value", value);
                        }
                    });

                    const additionalParentFields = {
                        parent_two_name: response.additional_parent_info?.parent_name,
                        parent_email: response.additional_parent_info?.parent_email,
                        parent_two_home_telephone_number:
                            response.primary_parent_info?.parent_home_telephone_number,
                        parent_two_street_address:
                            response.additional_parent_info?.parent_street_address,
                        parent_two_city_address:
                            response.additional_parent_info?.parent_city_address,
                        parent_two_state_address:
                            response.additional_parent_info?.parent_state_address,
                        parent_two_zip_address:
                            response.additional_parent_info?.parent_zip_address,
                        parent_two_business_name:
                            response.additional_parent_info?.parent_business_name,
                        parent_two_business_cell_number:
                            response.additional_parent_info?.parent_business_cell_number,
                        parent_two_work_hours_from:
                            response.additional_parent_info?.parent_work_hours_from,
                        parent_two_work_hours_to:
                            response.additional_parent_info?.parent_work_hours_to,
                        parent_two_business_telephone_number:
                            response.additional_parent_info
                                ?.parent_business_telephone_number,
                    };

                    Object.entries(additionalParentFields).forEach(([field, value]) => {
                        let element = form.querySelector(`[name='${field}']`);
                        if (element && value !== undefined) {
                            element.setAttribute("value", value);
                        }
                    });

                    // Handle emergency contact info (for example, the first contact)
                    if (
                        response.emergency_contact_info &&
                        response.emergency_contact_info.length > 0
                    ) {
                        response.emergency_contact_info.forEach((contact, index) => {
                            const emergencyContactFields = {
                                [`child_emergency_contact_name${index}`]:
                                    contact.child_emergency_contact_name,
                                [`child_emergency_contact_full_address${index}`]:
                                    contact.child_emergency_contact_full_address,
                                [`child_emergency_contact_city_address${index}`]:
                                    contact.child_emergency_contact_city_address,
                                [`child_emergency_contact_state_address${index}`]:
                                    contact.child_emergency_contact_state_address,
                                [`child_emergency_contact_zip_address${index}`]:
                                    contact.child_emergency_contact_zip_address,
                                [`child_emergency_contact_telephone_number${index}`]:
                                    contact.child_emergency_contact_telephone_number,
                                [`child_emergency_contact_relationship${index}`]:
                                    contact.child_emergency_contact_relationship,
                            };

                            Object.entries(emergencyContactFields).forEach(
                                ([field, value]) => {
                                    let element = document.querySelector(`[name='${field}']`);
                                    if (element && value !== undefined) {
                                        element.setAttribute("value", value);
                                    }
                                }
                            );
                        });
                    }

                    // Checkbox handling
                    const checkboxFields = [
                        "agree_all_above_information_is_correct",
                        "family_history_allergies",
                        "family_history_heart_problems",
                        "family_history_tuberculosis",
                        "family_history_asthma",
                        "family_history_high_blood_pressure",
                        "family_history_vision_problems",
                        "family_history_diabetes",
                        "family_history_hyperactivity",
                        "family_history_epilepsy",
                        "no_illnesses_for_this_child",
                        "agree_all_above_info_is_correct",
                        "do_you_agree_this_immunization_instructions",
                        "childcare_before",
                        "restricted_diet",
                        "eat_own",
                        "rest_in_the_middle_day",
                        "toilet_trained",
                        "existing_illness_allergy",
                        "functioning_at_age",
                        "able_to_walk",
                        "communicate_their_needs",
                        "any_medication",
                        "utilize_special_equipment",
                        "significant_periods",
                        "desire_any_accommodations",
                        "do_you_agree_this",
                        "do_you_agree_this_pick_up_password_form",
                        "photo_permission_agree_group_photos_electronic",
                        "do_you_agree_this_photo_video_permission_form",
                        "security_release_policy_form",
                        "medical_transportation_waiver",
                        "do_you_agree_this_health_policies",
                        "parent_sign_outside_waiver",
                        "do_you_agree_this_social_media_post",
                    ];

                    checkboxFields.forEach((field) => {
                        let element = form.querySelector(`[name='${field}']`);
                        if (element && response[field] == "on") {
                            element.setAttribute("checked", true);
                        }
                    });

                    inputFields.forEach((field) => {
                        let element = form.querySelector(`input[name='${field}']`);
                        if (element) {
                            element.checked = response[field] === "Yes";
                        }
                    });

                    const relatedFieldsMapping = {
                        childcare_before: "reason_for_childcare_before",
                        restricted_diet: "restricted_diet_reason",
                        eat_own: "eat_own_reason",
                        rest_in_the_middle_day: "reason_for_rest_in_the_middle_day",
                        toilet_trained: "reason_for_toilet_trained",
                        existing_illness_allergy: "explain_for_existing_illness_allergy",
                        functioning_at_age: "explain_for_functioning_at_age",
                        able_to_walk: "explain_for_able_to_walk",
                        communicate_their_needs: "explain_for_communicate_their_needs",
                        any_medication: "explain_for_any_medication",
                        utilize_special_equipment:
                            "explain_for_utilize_special_equipment",
                        significant_periods: "explain_for_significant_periods",
                        desire_any_accommodations:
                            "explain_for_desire_any_accommodations",
                    };

                    Object.entries(relatedFieldsMapping).forEach(
                        ([keyField, relatedField]) => {
                            let keyElement = form.querySelector(
                                `input[name='${keyField}']`
                            );
                            let relatedElement = form.querySelector(
                                `[name='${relatedField}']`
                            );

                            if (keyElement) {
                                if (response[keyField] === 2) {
                                    if (relatedElement) {
                                        relatedElement.setAttribute(
                                            "value",
                                            response[relatedField] || ""
                                        );
                                    } else {
                                        // Create a new input field if it doesn't exist
                                        let newInput = document.createElement("input");
                                        newInput.setAttribute("type", "text");
                                        newInput.setAttribute("name", relatedField);
                                        newInput.setAttribute(
                                            "value",
                                            response[relatedField] || ""
                                        );
                                        form.appendChild(newInput);
                                    }
                                } else {
                                    if (relatedElement) {
                                        relatedElement.setAttribute("value", "No");
                                    } else {
                                        // Create a new input field if it doesn't exist
                                        let newInput = document.createElement("input");
                                        newInput.setAttribute("type", "text");
                                        newInput.setAttribute("name", relatedField);
                                        newInput.setAttribute("value", "No");
                                        form.appendChild(newInput);
                                    }
                                }
                            }
                        }
                    );

                    if (response.approve_social_media_post === 2) {
                        let element = form.querySelector(
                            `input[id='approve_social_media_post1']`
                        );
                        if (element) {
                            element.setAttribute("checked", true);
                        }
                    } else {
                        let element = form.querySelector(
                            `input[id='approve_social_media_post2']`
                        );
                        if (element) {
                            element.setAttribute("checked", true);
                        }
                    }
                }
                resolve();
            },
            error: function (error) {
                reject(error);
            },
        });
    });
}

$("#year").on("change", function () {
    year = $(this).val();
    if (!year) {
        alert("Please select a valid year.");
        return false;
    }
    if ($.fn.DataTable.isDataTable("#example")) {
        $("#example").DataTable().clear().destroy();
    }
    completedForm(year);
});

function activateTab(pointer) {
    // Map pointer values to tab IDs or classes
    const subTabMapping = {
        1: "#childinfoCollapseOne",
        2: "#parentDetailsCollapseTwo",
        3: "#additionalParentDetailsCollapseTwo",
        4: "#emergencyCollapseThree",
        5: "#medicalcareCollapseFour",
        6: "#childinfoagreeCollapseFive",
        7: "#historyCollapseOne",
        8: "#historyCollapseTwo",
        9: "#historyCollapseThree",
        10: "#historyCollapseFour",
        11: "#historyCollapseFive",
        12: "#historyCollapseSix",
        13: "#historyCollapseSeven",
        14: "#immunizationinstructions",
        15: "#childproCollapseOne",
        16: "#childproCollapseTwo",
        17: "#childproCollapseThree",
        18: "#childproCollapseFour",
        19: "#childproCollapseFive",
        20: "#pickuppassword",
        21: "#photovideopermission",
        22: "#securitypolicy",
        23: "#medicaltransportation",
        24: "#healthpolicies",
        25: "#outsideengagements",
        26: "#socialmediaapproval",

        27: "#authorizationach",
        28: "#childenrollmentagreement",
        29: "#volumeone",
    };

    const tabId = subTabMapping[pointer];
    // console.log(tabId);
    // console.log(pointer);

    // deactivate all left-side tabs
    $(".tab-pane").removeClass("active show");
    $(".anchorvalue").removeClass("active");

    if (pointer <= 26) {
        $(".admissionFormLabel").addClass("shadow");
        $(".admissionFormLabelButton").removeClass("collapsed");
        $("#admission").addClass("show");
    } else if (pointer == 27) {
        $(".achFormLabel").addClass("shadow");
        $(".achFormLabelButton").removeClass("collapsed");
        $("#authorizationform").addClass("show");
    } else if (pointer == 28) {
        $(".enrollFormLabel").addClass("shadow");
        $(".enrollFormLabelButton").removeClass("collapsed");
        $("#enrollmentagreementform").addClass("show");
    } else if (pointer == 29) {
        $(".handbookFormLabel").addClass("shadow");
        $(".handbookFormLabelButton").removeClass("collapsed");
        $("#handbook").addClass("show");
    }

    if (pointer <= 6) {
        $("#childinformation").addClass("active show");
        $('[href="#childinformation"]').addClass("active");
    } else if (pointer >= 7 && pointer <= 13) {
        $("#childandfamilyhistory").addClass("active show");
        $('[href="#childandfamilyhistory"]').addClass("active");
    } else if (pointer == 14) {
        $("#immunizationinstructions").addClass("active show");
        $('[href="#immunizationinstructions"]').addClass("active");
    } else if (pointer >= 15 && pointer <= 19) {
        $("#childprofile").addClass("active show");
        $('[href="#childprofile"]').addClass("active");
    } else if (pointer == 20) {
        $("#pickuppassword").addClass("active show");
        $('[href="#pickuppassword"]').addClass("active");
    } else if (pointer == 21) {
        $("#photovideopermission").addClass("active show");
        $('[href="#photovideopermission"]').addClass("active");
    } else if (pointer == 22) {
        $("#securitypolicy").addClass("active show");
        $('[href="#securitypolicy"]').addClass("active");
    } else if (pointer == 23) {
        $("#medicaltransportation").addClass("active show");
        $('[href="#medicaltransportation"]').addClass("active");
    } else if (pointer == 24) {
        $("#healthpolicies").addClass("active show");
        $('[href="#healthpolicies"]').addClass("active");
    } else if (pointer == 25) {
        $("#outsideengagements").addClass("active show");
        $('[href="#outsideengagements"]').addClass("active");
    } else if (pointer == 26) {
        $("#socialmediaapproval").addClass("active show");
        $('[href="#socialmediaapproval"]').addClass("active");
    } else if (pointer == 27) {
        $("#authorizationach").addClass("active show");
        $('[href="#authorizationach"]').addClass("active");
    } else if (pointer == 28) {
        console.log('ifffff');
        $("#childenrollmentagreement").addClass("active show");
        $('[href="#childenrollmentagreement"]').addClass("active");
    } else if (pointer == 29) {
        $("#volumeone").addClass("active show");
        $('[href="#volumeone"]').addClass("active");
    }

    if (tabId) {
        // $('.accordion-collapse').removeClass('show');
        // $('.accordion-button').addClass('collapsed').attr('aria-expanded', 'false');
        const selectedTab = $(tabId);
        if (selectedTab.length) {
            selectedTab.addClass("show");
            selectedTab
                .prev(".accordion-header")
                .find(".accordion-button")
                .removeClass("collapsed")
                .attr("aria-expanded", "true");
        }
    }
}

$("#example").off("click", ".download-btn").on("click", ".download-btn", function () {
    let url = $(this).data("url");
    let fileName = $(this).data("name");
    let editID = extractEditIDFromURL(url);

    localStorage.setItem("form_name", fileName);

    // Remove any existing hiddenDiv before adding new one
    let existingDiv = document.getElementById("formContent");
    if (existingDiv) {
        document.body.removeChild(existingDiv);
    }

    fetch(url)
        .then((response) => response.text())
        .then((text) => {
            let hiddenDiv = document.createElement("div");
            hiddenDiv.id = "formContent";
            hiddenDiv.style.display = "none";
            hiddenDiv.innerHTML = text;
            document.body.appendChild(hiddenDiv);

            populateFormData(editID, fileName)
                .then(() => {
                    setTimeout(() => {
                        generatePDFContent()
                            .then((doc) => {
                                doc.save(fileName);
                                document.body.removeChild(hiddenDiv);
                            })
                            .catch((error) => {
                                document.body.removeChild(hiddenDiv);
                            });
                    }, 1000); // Adjust timeout as needed
                })
                .catch((error) => {
                    document.body.removeChild(hiddenDiv);
                });
        })
        .catch((error) => {
            console.error("Error downloading the document:", error);
        });
});

$("#example").on("click", ".print-btn", function () {
    let url = $(this).data("url");
    let formName = $(this).data("name");
    let editID = extractEditIDFromURL(url);
    localStorage.setItem("form_name", formName);

    // Remove any existing hiddenDiv before adding new one
    let existingDiv = document.getElementById("formContent");
    if (existingDiv) {
        document.body.removeChild(existingDiv);
    }

    fetch(url)
        .then((response) => {
            if (!response.ok) throw new Error("Network response was not ok");
            return response.text();
        })
        .then((text) => {
            let hiddenDiv = document.createElement("div");
            hiddenDiv.id = "formContent";
            hiddenDiv.style.display = "none";
            hiddenDiv.innerHTML = text;
            document.body.appendChild(hiddenDiv);

            return populateFormData(editID, formName);
        })
        .then(() => {
            let hiddenDiv = document.getElementById("formContent");
            if (hiddenDiv) {
                console.log("Form content div found:", hiddenDiv);
                printContent(hiddenDiv);
            } else {
                throw new Error("Form content div not found");
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            let hiddenDiv = document.getElementById("formContent");
            if (hiddenDiv) {
                document.body.removeChild(hiddenDiv);
            }
        });
});

function completedForm(editID, curyear) {
    console.log(curyear);
    // DataTable initialization
    $("#example").DataTable({
        // scrollX: true,
        info: false,
        dom: "Qlfrtip",
        lengthChange: false,
        ajax: {
            url: `https://zjnj2xrqwg.execute-api.ap-south-1.amazonaws.com/prod/admission_child_personal/completed_form_status_year/${editID}/${curyear}`,
            dataSrc: function (json) {
                console.log(json);
                if (
                    !json.CompletedFormStatus ||
                    json.CompletedFormStatus.length === 0
                ) {
                    return []; // Return empty array to handle no data
                }
                console.log(json);
                // return false;
                // Format the timestamp in the JSON data before using it in the DataTable
                json.CompletedFormStatus.forEach(function (item) {
                    const date = new Date(item.completedTimestamp);
                    if (!isNaN(date)) {
                        item.completedTimestamp =
                            date.toLocaleDateString() + " " + date.toLocaleTimeString();
                    } else {
                        item.completedTimestamp = "Invalid Date";
                    }
                });
                return json.CompletedFormStatus;
            },
        },
        columns: [
            {
                data: "formName",
                render: function (data, type, full, meta) {
                    return full.formname;
                },
            },
            {
                data: "completedTimestamp",
                render: function (data, type, full, meta) {
                    // console.log(data);
                    const epochTimes = data; // Example epoch time
                    const date = new Date(epochTimes);
                    // console.log(date);
                    return date; // It's already formatted in dataSrc function
                },
            },
            {
                data: "edit",
                render: function (data, type, full, meta) {
                    let url = "";
                    let print_url = "";
                    // console.log(window.location.origin);

                    // for localhost 
                    switch (full.formname) {
                        case "admission_form":
                            url = `${window.location.origin}/admission_form_completed.html?id=${editID}`;
                            print_url = `${window.location.origin}/admission_form_pdf_completed.html?id=${editID}`;
                            break;
                        case "authorization_form":
                            url = `${window.location.origin}/authorization_completed.html?id=${editID}`;
                            print_url = `${window.location.origin}/authorization_pdf_completed.html?id=${editID}`;
                            break;
                        case "enrollment_form":
                            url = `${window.location.origin}/enrollment_agreement_completed.html?id=${editID}`;
                            print_url = `${window.location.origin}/enrollment_agreement_pdf_completed.html?id=${editID}`;
                            break;
                        case "parent_handbook":
                            url = `${window.location.origin}/parent_handbook_completed.html?id=${editID}`;
                            print_url = `${window.location.origin}/parent_handbook_pdf_completed.html?id=${editID}`;
                            break;
                        default:
                            return "";
                    }

                    //  for cloud
                    // switch (full.formname) {
                    //     case "admission_form":
                    //         url = `${window.location.origin}/goddard-frontend-dev/admission_form_completed.html?id=${editID}`;
                    //         print_url = `${window.location.origin}/goddard-frontend-dev/admission_form_pdf_completed.html?id=${editID}`;
                    //         break;
                    //     case "authorization_form":
                    //         url = `${window.location.origin}/goddard-frontend-dev/authorization_completed.html?id=${editID}`;
                    //         print_url = `${window.location.origin}/goddard-frontend-dev/authorization_pdf_completed.html?id=${editID}`;
                    //         break;
                    //     case "enrollment_form":
                    //         url = `${window.location.origin}/goddard-frontend-dev/enrollment_agreement_completed.html?id=${editID}`;
                    //         print_url = `${window.location.origin}/goddard-frontend-dev/enrollment_agreement_pdf_completed.html?id=${editID}`;
                    //         break;
                    //     case "parent_handbook":
                    //         url = `${window.location.origin}/goddard-frontend-dev/parent_handbook_completed.html?id=${editID}`;
                    //         print_url = `${window.location.origin}/goddard-frontend-dev/parent_handbook_pdf_completed.html?id=${editID}`;
                    //         break;
                    //     default:
                    //         return "";
                    // }
                    return `
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="18" height="18" class="action-icons m-2 download-btn" data-url="${url}" data-name="${full.formname}.pdf" name="downbutton"><path fill="#0F2D52" d="M256 0a256 256 0 1 0 0 512A256 256 0 1 0 256 0zM376.9 294.6L269.8 394.5c-3.8 3.5-8.7 5.5-13.8 5.5s-10.1-2-13.8-5.5L135.1 294.6c-4.5-4.2-7.1-10.1-7.1-16.3c0-12.3 10-22.3 22.3-22.3l57.7 0 0-96c0-17.7 14.3-32 32-32l32 0c17.7 0 32 14.3 32 32l0 96 57.7 0c12.3 0 22.3 10 22.3 22.3c0 6.2-2.6 12.1-7.1 16.3z"/></svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="18" height="18" class="action-icons m-2 print-btn" data-url="${print_url}" data-name="${full.formname}.pdf" name="printbutton"><path fill="#0F2D52" d="M128 0C92.7 0 64 28.7 64 64v96h64V64H354.7L384 93.3V160h64V93.3c0-17-6.7-33.3-18.7-45.3L400 18.7C388 6.7 371.7 0 354.7 0H128zM384 352v32 64H128V384 368 352H384zm64 32h32c17.7 0 32-14.3 32-32V256c0-35.3-28.7-64-64-64H64c-35.3 0-64 28.7-64 64v96c0 17.7 14.3 32 32 32H64v64c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V384zM432 248a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"/></svg>
            </div>`;
                },
            },
        ],
        pageLength: 25,
    });
}

function checking(editID) {
    window.localStorage.setItem("editChildId", editID);
    showSpinner(); // Show spinner at the beginning

    // First, load the form structure
    $.ajax({
        url: `https://zjnj2xrqwg.execute-api.ap-south-1.amazonaws.com/prod/admission_child_personal/incomplete_form_status/${editID}`,
        type: "GET",
        dataType: "json",
        success: function (response) {
            let mainTopics = [];
            // iterate over the values of incompletedformstatus
            for (let value of Object.values(response["InCompletedFormStatus"])) {
                mainTopics.push(value);
            }

            // Clear all menu containers first
            document.getElementById("admissionFormMenu").innerHTML = "";
            document.getElementById("authorizationMenu").innerHTML = "";
            document.getElementById("enrollmentMenu").innerHTML = "";
            document.getElementById("parentHandbookMenu").innerHTML = "";
            document.getElementById("admissionforms").innerHTML = "";
            document.getElementById("authorization").innerHTML = "";
            document.getElementById("enrollmentagreement").innerHTML = "";
            document.getElementById("parenthandbook").innerHTML = "";

            // Create a promise array for all content loading
            let loadPromises = [];

            for (let i = 0; i < mainTopics.length; i++) {
                let mainTopic = mainTopics[i];
                let trimValues = mainTopic.replace(/\s+/g, "_").toLowerCase();

                if (
                    trimValues == "admission_form" ||
                    trimValues == "authorization" ||
                    trimValues == "enrollment_agreement" ||
                    trimValues == "parent_handbook"
                ) {
                    // Create a promise for each menu item loading
                    let menuPromise = new Promise((resolve, reject) => {
                        $(`.menu.${trimValues}`).load(trimValues + "_list_item.html", function () {
                            resolve();
                        });
                    });
                    loadPromises.push(menuPromise);

                    // Create a promise for each content loading
                    let contentPromise = new Promise((resolve, reject) => {
                        $(`.tab-content.${trimValues}`).load(trimValues + ".html", function () {
                            $(".svg").append(
                                '<svg width="12px" height="10px" viewbox="0 0 12 10"><polyline points="1.5 6 4.5 9 10.5 1"></polyline></svg>'
                            );
                            resolve();
                        });
                    });
                    loadPromises.push(contentPromise);
                }
            }

            // Wait for all content to be loaded before fetching form data
            Promise.all(loadPromises).then(() => {
                // Now fetch form data only after all DOM elements are loaded
                fetchFormData(editID);
            });
        },
        error: function (xhr, status, error) {
            console.error("Error loading form structure:", error);
            hideSpinner();
        }
    });

    let childName = localStorage.getItem("child_name");
    if (document.getElementById("childName")) {
        document.getElementById("childName").innerHTML = childName;
    }

    // Set up completed forms functionality
    let link = document.querySelector(".completedforms");
    if (link) {
        let year = new Date().getFullYear();
        link.addEventListener("click", function (event) {
            event.preventDefault();
        });

        $.fn.dataTable.ext.errMode = "none";

        if ($.fn.DataTable.isDataTable("#example")) {
            $("#example").DataTable().destroy();
        }

        completedForm(editID, year);
    }
}

// Separate function to fetch form data after DOM elements are loaded
function fetchFormData(editID) {
    if (editID === "") {
        hideSpinner();
        return;
    }

    $.ajax({
        url: `https://zjnj2xrqwg.execute-api.ap-south-1.amazonaws.com/prod/child_all_form_details/fetch/${editID}`,
        type: "GET",
        success: function (response) {
            console.log("Form data received:", response);

            // Store response data in localStorage
            window.localStorage.setItem("responseData", JSON.stringify(response));

            // Activate correct tab if needed
            let tabPointer = response.pointer;
            if (typeof tabPointer !== "undefined") {
                activateTab(tabPointer);
            }

            // Using a timeout to ensure all dynamic content is fully rendered
            setTimeout(() => {
                updateFormFields(response);
                validateAllForms(response);
                hideSpinner();
            }, 300);
        },
        error: function (xhr, status, error) {
            console.error("Error fetching form data:", error);
            hideSpinner();
        }
    });
}

// Function to update all form fields with API response data
function updateFormFields(response) {
    const childInfoForm = document.getElementById("childinformation");
    if (childInfoForm) {
        if (typeof response.child_first_name !== "undefined") {
            const firstNameField = document.getElementsByName("child_first_name")[0];
            if (firstNameField) {
                firstNameField.value = response.child_first_name;
            }
        }
        if (typeof response.child_last_name !== "undefined") {
            const firstNameField = document.getElementsByName("child_last_name")[0];
            if (firstNameField) {
                firstNameField.value = response.child_last_name;
            }
        }
        if (typeof response.nick_name !== "undefined" && typeof response.nick_name !== null) {
            const firstNameField = document.getElementsByName("nick_name")[0];
            if (firstNameField) {
                firstNameField.value = response.nick_name;
            }
        }
        if (typeof response.dob !== "undefined") {
            const firstNameField = document.getElementsByName("dob")[0];
            if (firstNameField) {
                firstNameField.value = response.dob;
            }
        }
        if (typeof response.primary_language !== "undefined") {
            const languageField = document.getElementsByName("primary_language")[0];
            if (languageField) {
                languageField.value = response.primary_language;
            }
        }

        if (typeof response.school_age_child_school !== "undefined") {
            const schoolField = document.getElementsByName("school_age_child_school")[0];
            if (schoolField) {
                schoolField.value = response.school_age_child_school;
            }
        }

        if (typeof response.do_relevant_custody_papers_apply !== "undefined") {
            if (response.do_relevant_custody_papers_apply === 1) {
                const custodyYes = document.getElementById("do_relevant_custody_papers_apply1");
                if (custodyYes) {
                    custodyYes.checked = true;
                }
            } else if (response.do_relevant_custody_papers_apply === 2) {
                const custodyNo = document.getElementById("do_relevant_custody_papers_apply2");
                if (custodyNo) {
                    custodyNo.checked = true;
                }
            }
        }

        if (typeof response.gender !== "undefined") {
            const gender1 = document.getElementById("gender1");
            const gender2 = document.getElementById("gender2");
            const gender3 = document.getElementById("gender3");

            if (response.gender == 1 && gender1) {
                gender1.checked = true;
            } else if (response.gender == 2 && gender2) {
                gender2.checked = true;
            } else if (response.gender == 3 && gender3) {
                gender3.checked = true;
            }
        }
        console.log(response.primary_parent_info);
        if (response.primary_parent_info) {
            const info = response.primary_parent_info;

            const setFieldValue = (name, value) => {
                const field = document.getElementsByName(name)[0];
                if (field) field.value = value;
            };

            setFieldValue("parent_name", info.parent_name);
            setFieldValue("parent_street_address", info.parent_street_address);
            setFieldValue("parent_city_address", info.parent_city_address);
            setFieldValue("parent_state_address", info.parent_state_address);
            setFieldValue("parent_zip_address", info.parent_zip_address);
            setFieldValue("home_telephone_number", info.parent_home_telephone_number);
            setFieldValue("business_name", info.parent_business_name);
            setFieldValue("work_hours_from", info.parent_work_hours_from);
            setFieldValue("work_hours_to", info.parent_work_hours_to);
            setFieldValue("business_telephone_number", info.parent_business_telephone_number);
            setFieldValue("business_cell_number", info.parent_business_cell_number);
            setFieldValue("parent_email", info.parent_email);

        }
        if (response.additional_parent_info) {
            const info = response.additional_parent_info;

            const setFieldValue = (name, value) => {
                const field = document.getElementsByName(name)[0];
                if (field) field.value = value;
            };

            setFieldValue("parent_two_name", info.parent_name);
            setFieldValue("parent_two_street_address", info.parent_street_address);
            setFieldValue("parent_two_city_address", info.parent_city_address);
            setFieldValue("parent_two_state_address", info.parent_state_address);
            setFieldValue("parent_two_zip_address", info.parent_zip_address);
            setFieldValue("parent_two_home_telephone_number", info.parent_home_telephone_number);
            setFieldValue("parent_two_business_name", info.parent_business_name);
            setFieldValue("parent_two_work_hours_from", info.parent_work_hours_from);
            setFieldValue("parent_two_work_hours_to", info.parent_work_hours_to);
            setFieldValue("parent_two_business_telephone_number", info.parent_business_telephone_number);

            // Note: You're referencing `response.primary_parent_info` for this field, likely a mistake.
            // If that's intentional, leave it. Otherwise, use `info` instead for consistency.
            setFieldValue("parent_two_business_cell_number", response.primary_parent_info?.parent_business_cell_number);

            setFieldValue("parent_two_email", info.parent_email);
        }
        if (response.emergency_contact_info) {
            let allContactsValid = true;

            const setInputValue = (id, value) => {
                const input = document.getElementById(id);
                if (input) input.value = value || "";
            };

            response.emergency_contact_info.forEach((contact, index) => {
                let isValidContact = true;

                const requiredFields = [
                    "child_emergency_contact_name",
                    "child_emergency_contact_relationship",
                    "child_emergency_contact_telephone_number",
                    "child_emergency_contact_full_address",
                    "child_emergency_contact_city_address",
                    "child_emergency_contact_state_address",
                    "child_emergency_contact_zip_address"
                ];

                requiredFields.forEach(field => {
                    const id = `${field}${index}`;
                    const value = contact[field];
                    setInputValue(id, value);
                    if (!value) isValidContact = false;
                });

                if (!isValidContact) allContactsValid = false;
            });
            if (response.child_care_provider_info) {
                const info = response.child_care_provider_info;

                const setInputValue = (id, value) => {
                    const input = document.getElementById(id);
                    if (input) input.value = value || "";
                };

                setInputValue("child_care_provider_name", info.child_care_provider_name);
                setInputValue("child_care_provider_telephone_number", info.child_care_provider_telephone_number);
                setInputValue("child_hospital_affiliation", info.child_hospital_affiliation);
                setInputValue("child_care_provider_street_address", info.child_care_provider_street_address);
                setInputValue("child_care_provider_city_address", info.child_care_provider_city_address);
                setInputValue("child_care_provider_state_address", info.child_care_provider_state_address);
                setInputValue("child_care_provider_zip_address", info.child_care_provider_zip_address);
            }
            if (response.child_dentist_info) {
                const info = response.child_dentist_info;
                const {
                    child_dentist_id: dentistId,
                    child_dentist_name: dentistName = "",
                    dentist_telephone_number: dentistPhone = "",
                    dentist_street_address: dentistStreet = "",
                    dentist_city_address: dentistCity = "",
                    dentist_state_address: dentistState = "",
                    dentist_zip_address: dentistZip = ""
                } = info;

                const dropdownButton = document.getElementById("dropdownMenuButton");
                const dropdownItems = document.querySelectorAll("#dropdown-menu .dropdown-item");
                let matched = false;

                dropdownItems.forEach((item) => {
                    if ($(item).data("value") === dentistId) {
                        dropdownButton.textContent = item.textContent;
                        matched = true;
                    }
                });

                if (!matched) {
                    dropdownButton.textContent = "Others";

                    // Append custom name input only if it doesn't already exist
                    if (!document.getElementById("customDentistName")) {
                        $("#dropdown-menu").append(`
                            <input type="text" id="customDentistName" class="form-control mt-2" placeholder="Enter dentist name..." value="${dentistName}">
                        `);
                    }

                    // Enable and set values for the fields
                    $("#dentist_telephone_number").prop("disabled", false).val(dentistPhone);
                    $("#dentist_street_address").prop("disabled", false).val(dentistStreet);
                    $("#dentist_city_address").prop("disabled", false).val(dentistCity);
                    $("#dentist_state_address").prop("disabled", false).val(dentistState);
                    $("#dentist_zip_address").prop("disabled", false).val(dentistZip);

                    $("#child_dentist_name").removeClass("d-none").val(dentistName);
                } else {
                    // Disable and clear the extra fields if a known dentist is selected
                    $("#dentist_telephone_number").prop("disabled", true);
                    $("#dentist_street_address").prop("disabled", true);
                    $("#dentist_city_address").prop("disabled", true);
                    $("#dentist_state_address").prop("disabled", true);
                    $("#dentist_zip_address").prop("disabled", true);
                    $("#child_dentist_name").addClass("d-none");
                }
            }
            if (typeof response.special_diabilities !== "undefined") {
                const disabilitiesField = document.getElementsByName("special_diabilities")[0];
                if (disabilitiesField) {
                    disabilitiesField.value = response.special_diabilities;
                }
            }

            if (typeof response.allergies_medication_reaction !== "undefined") {
                const allergiesField = document.getElementsByName("allergies_medication_reaction")[0];
                if (allergiesField) {
                    allergiesField.value = response.allergies_medication_reaction;
                }
            }

            if (typeof response.additional_info !== "undefined") {
                const additionalInfoField = document.getElementsByName("additional_info")[0];
                if (additionalInfoField) {
                    additionalInfoField.value = response.additional_info;
                }
            }

            if (typeof response.medication !== "undefined") {
                const medicationField = document.getElementsByName("medication")[0];
                if (medicationField) {
                    medicationField.value = response.medication;
                }
            }

            if (typeof response.health_insurance !== "undefined") {
                const insuranceField = document.getElementsByName("health_insurance")[0];
                if (insuranceField) {
                    insuranceField.value = response.health_insurance;
                }
            }

            if (typeof response.policy_number !== "undefined") {
                const policyNumberField = document.getElementsByName("policy_number")[0];
                if (policyNumberField) {
                    policyNumberField.value = response.policy_number;
                }
            }
            if (typeof response.obtaining_emergency_medical_care !== "undefined") {
                const emergencyCareField = document.getElementsByName("obtaining_emergency_medical_care")[0];
                if (emergencyCareField) {
                    emergencyCareField.value = response.obtaining_emergency_medical_care;
                }
            }

            if (typeof response.administration_first_aid_procedures !== "undefined") {
                const firstAidField = document.getElementsByName("administration_first_aid_procedures")[0];
                if (firstAidField) {
                    firstAidField.value = response.administration_first_aid_procedures;
                }
            }

            const agreementCheckbox = document.getElementById("agree_all_above_information_is_correct");
            if (agreementCheckbox) {
                agreementCheckbox.checked = response.agree_all_above_information_is_correct === "on";
            }


        }


    }

    var inputs = document.querySelectorAll("#childinformation input");

    inputs.forEach(function (input) {
        if (input.type === "checkbox" || input.type === "radio") {
            if (input.checked) {
                input.classList.remove("input-success");
                input.classList.remove("input-error");
            }
        } else {
            if (input.value.trim() === "") {
                input.classList.add("input-error"); // Highlight empty input
                input.classList.remove("input-success");
            } else {
                input.classList.add("input-success");
                input.classList.remove("input-error");
            }
        }
    });

    const childfamilyHistory = document.getElementById("childandfamilyhistory");
    if (childfamilyHistory) {
        if (typeof response.physical_exam_last_date !== "undefined") {
            const physicalExamField = document.getElementsByName("physical_exam_last_date")[0];
            if (physicalExamField) {
                physicalExamField.value = response.physical_exam_last_date;
            }
        }

        if (typeof response.dental_exam_last_date !== "undefined") {
            const dentalExamField = document.getElementsByName("dental_exam_last_date")[0];
            if (dentalExamField) {
                dentalExamField.value = response.dental_exam_last_date;
            }
        }
        if (typeof response.allergies !== "undefined") {
            const allergiesField = document.getElementsByName("allergies")[0];
            if (allergiesField) {
                allergiesField.value = response.allergies;
            }
        }

        if (typeof response.asthma !== "undefined") {
            const asthmaField = document.getElementsByName("asthma")[0];
            if (asthmaField) {
                asthmaField.value = response.asthma;
            }
        }

        if (typeof response.bleeding_problems !== "undefined") {
            const bleedingProblemsField = document.getElementsByName("bleeding_problems")[0];
            if (bleedingProblemsField) {
                bleedingProblemsField.value = response.bleeding_problems;
            }
        }

        if (typeof response.diabetes !== "undefined") {
            const diabetesField = document.getElementsByName("diabetes")[0];
            if (diabetesField) {
                diabetesField.value = response.diabetes;
            }
        }

        if (typeof response.epilepsy !== "undefined") {
            const epilepsyField = document.getElementsByName("epilepsy")[0];
            if (epilepsyField) {
                epilepsyField.value = response.epilepsy;
            }
        }

        if (typeof response.frequent_ear_infections !== "undefined") {
            const frequentEarInfectionsField = document.getElementsByName("frequent_ear_infections")[0];
            if (frequentEarInfectionsField) {
                frequentEarInfectionsField.value = response.frequent_ear_infections;
            }
        }

        if (typeof response.frequent_illnesses !== "undefined") {
            const frequentIllnessesField = document.getElementsByName("frequent_illnesses")[0];
            if (frequentIllnessesField) {
                frequentIllnessesField.value = response.frequent_illnesses;
            }
        }

        if (typeof response.hearing_problems !== "undefined") {
            const hearingProblemsField = document.getElementsByName("hearing_problems")[0];
            if (hearingProblemsField) {
                hearingProblemsField.value = response.hearing_problems;
            }
        }

        if (typeof response.high_fevers !== "undefined") {
            const highFeversField = document.getElementsByName("high_fevers")[0];
            if (highFeversField) {
                highFeversField.value = response.high_fevers;
            }
        }

        if (typeof response.hospitalization !== "undefined") {
            const hospitalizationField = document.getElementsByName("hospitalization")[0];
            if (hospitalizationField) {
                hospitalizationField.value = response.hospitalization;
            }
        }

        if (typeof response.rheumatic_fever !== "undefined") {
            const rheumaticFeverField = document.getElementsByName("rheumatic_fever")[0];
            if (rheumaticFeverField) {
                rheumaticFeverField.value = response.rheumatic_fever;
            }
        }

        if (typeof response.seizures_convulsions !== "undefined") {
            const seizuresConvulsionsField = document.getElementsByName("seizures_convulsions")[0];
            if (seizuresConvulsionsField) {
                seizuresConvulsionsField.value = response.seizures_convulsions;
            }
        }

        if (typeof response.serious_injuries_accidents !== "undefined") {
            const seriousInjuriesField = document.getElementsByName("serious_injuries_accidents")[0];
            if (seriousInjuriesField) {
                seriousInjuriesField.value = response.serious_injuries_accidents;
            }
        }

        if (typeof response.surgeries !== "undefined") {
            const surgeriesField = document.getElementsByName("surgeries")[0];
            if (surgeriesField) {
                surgeriesField.value = response.surgeries;
            }
        }

        if (typeof response.vision_problems !== "undefined") {
            const visionProblemsField = document.getElementsByName("vision_problems")[0];
            if (visionProblemsField) {
                visionProblemsField.value = response.vision_problems;
            }
        }

        if (typeof response.medical_other !== "undefined") {
            const medicalOtherField = document.getElementsByName("medical_other")[0];
            if (medicalOtherField) {
                medicalOtherField.value = response.medical_other;
            }
        }

        if (typeof response.illness_during_pregnancy !== "undefined") {
            const illnessDuringPregnancyField = document.getElementsByName("illness_during_pregnancy")[0];
            if (illnessDuringPregnancyField) {
                illnessDuringPregnancyField.value = response.illness_during_pregnancy;
            }
        }

        if (typeof response.condition_of_newborn !== "undefined") {
            const conditionOfNewbornField = document.getElementsByName("condition_of_newborn")[0];
            if (conditionOfNewbornField) {
                conditionOfNewbornField.value = response.condition_of_newborn;
            }
        }

        if (typeof response.duration_of_pregnancy !== "undefined") {
            const durationOfPregnancyField = document.getElementsByName("duration_of_pregnancy")[0];
            if (durationOfPregnancyField) {
                durationOfPregnancyField.value = response.duration_of_pregnancy;
            }
        }

        if (typeof response.birth_weight_lbs !== "undefined") {
            const birthWeightLbsField = document.getElementsByName("birth_weight_lbs")[0];
            if (birthWeightLbsField) {
                birthWeightLbsField.value = response.birth_weight_lbs;
            }
        }

        if (typeof response.birth_weight_oz !== "undefined") {
            const birthWeightOzField = document.getElementsByName("birth_weight_oz")[0];
            if (birthWeightOzField) {
                birthWeightOzField.value = response.birth_weight_oz;
            }
        }

        if (typeof response.complications !== "undefined") {
            const complicationsField = document.getElementsByName("complications")[0];
            if (complicationsField) {
                complicationsField.value = response.complications;
            }
        }

        if (response.bottle_fed === 1) {
            const bottleFed1 = document.getElementById("bottle_fed1");
            if (bottleFed1) {
                bottleFed1.checked = true;
            }
        } else if (response.bottle_fed === 2) {
            const bottleFed2 = document.getElementById("bottle_fed2");
            if (bottleFed2) {
                bottleFed2.checked = true;
            }
        }

        if (response.breast_fed === 1) {
            const breastFed1 = document.getElementById("breast_fed1");
            if (breastFed1) {
                breastFed1.checked = true;
            }
        } else if (response.breast_fed === 2) {
            const breastFed2 = document.getElementById("breast_fed2");
            if (breastFed2) {
                breastFed2.checked = true;
            }
        }

        if (typeof response.other_siblings_name !== "undefined") {
            const siblingsNameField = document.getElementsByName("other_siblings_name")[0];
            if (siblingsNameField) {
                siblingsNameField.value = response.other_siblings_name;
            }
        }

        if (typeof response.other_siblings_age !== "undefined") {
            const siblingsAgeField = document.getElementsByName("other_siblings_age")[0];
            if (siblingsAgeField) {
                siblingsAgeField.value = response.other_siblings_age;
            }
        }
        if (typeof response.family_history_allergies !== "undefined") {
            const checkbox = document.getElementById("family_history_allergies");
            if (checkbox) {
                checkbox.checked = response.family_history_allergies === "on";
            }
        }

        if (typeof response.family_history_heart_problems !== "undefined") {
            const checkbox = document.getElementById("family_history_heart_problems");
            if (checkbox) {
                checkbox.checked = response.family_history_heart_problems === "on";
            }
        }

        if (typeof response.family_history_tuberculosis !== "undefined") {
            const checkbox = document.getElementById("family_history_tuberculosis");
            if (checkbox) {
                checkbox.checked = response.family_history_tuberculosis === "on";
            }
        }

        if (typeof response.family_history_asthma !== "undefined") {
            const checkbox = document.getElementById("family_history_asthma");
            if (checkbox) {
                checkbox.checked = response.family_history_asthma === "on";
            }
        }

        if (typeof response.family_history_high_blood_pressure !== "undefined") {
            const checkbox = document.getElementById("family_history_high_blood_pressure");
            if (checkbox) {
                checkbox.checked = response.family_history_high_blood_pressure === "on";
            }
        }

        if (typeof response.family_history_vision_problems !== "undefined") {
            const checkbox = document.getElementById("family_history_vision_problems");
            if (checkbox) {
                checkbox.checked = response.family_history_vision_problems === "on";
            }
        }

        if (typeof response.family_history_diabetes !== "undefined") {
            const checkbox = document.getElementById("family_history_diabetes");
            if (checkbox) {
                checkbox.checked = response.family_history_diabetes === "on";
            }
        }

        if (typeof response.family_history_hyperactivity !== "undefined") {
            const checkbox = document.getElementById("family_history_hyperactivity");
            if (checkbox) {
                checkbox.checked = response.family_history_hyperactivity === "on";
            }
        }

        if (typeof response.family_history_epilepsy !== "undefined") {
            const checkbox = document.getElementById("family_history_epilepsy");
            if (checkbox) {
                checkbox.checked = response.family_history_epilepsy === "on";
            }
        }

        if (typeof response.no_illnesses_for_this_child !== "undefined") {
            const checkbox = document.getElementById("no_illnesses_for_this_child");
            if (checkbox) {
                checkbox.checked = response.no_illnesses_for_this_child === "on";
            }
        }

        setInputValue("age_group_friends", response.age_group_friends);
        setInputValue("neighborhood_friends", response.neighborhood_friends);
        setInputValue("relationship_with_mother", response.relationship_with_mother);
        setInputValue("relationship_with_father", response.relationship_with_father);
        setInputValue("relationship_with_siblings", response.relationship_with_siblings);
        setInputValue("relationship_with_extended_family", response.relationship_with_extended_family);
        setInputValue("fears_conflicts", response.fears_conflicts);
        setInputValue("child_response_frustration", response.child_response_frustration);
        setInputValue("favorite_activities", response.favorite_activities);

        setInputValue("last_five_years_moved", response.last_five_years_moved);
        setInputValue("things_used_at_home", response.things_used_at_home);
        setInputValue("hours_of_television_daily", response.hours_of_television_daily);
        setInputValue("language_used_at_home", response.language_used_at_home);
        setInputValue("changes_at_home_situation", response.changes_at_home_situation);
        setInputValue("educational_expectations_of_child", response.educational_expectations_of_child);


        setCheckbox("agree_all_above_info_is_correct", response.agree_all_above_info_is_correct);

    }

    var inputs = document.querySelectorAll("#childandfamilyhistory input");

    inputs.forEach(function (input) {
        if (input.type === "checkbox" || input.type === "radio") {
            if (input.checked) {
                input.classList.remove("input-success");
                input.classList.remove("input-error");
            }
        } else {
            if (input.value.trim() === "") {
                input.classList.add("input-error"); // Add a class to highlight empty input
                input.classList.remove("input-success");
            } else {
                input.classList.add("input-success");
                input.classList.remove("input-error"); // Remove error class if input is not empty
            }
        }

    });

    const immunizationValue = document.getElementById("immunizationinstructions");
    if (immunizationValue) {
        setCheckbox("do_you_agree_this_immunization_instructions", response.do_you_agree_this_immunization_instructions);
        // immunizationInstruction = response.do_you_agree_this_immunization_instructions === "on";

    }

    var inputs = document.querySelectorAll(
        "#immunizationinstructions input"
    );

    inputs.forEach(function (input) {
        if (input.type === "checkbox" || input.type === "radio") {
            if (input.checked) {
                input.classList.remove("input-success");
                input.classList.remove("input-error");
            }
        } else {
            if (input.value.trim() === "") {
                input.classList.add("input-error"); // Add a class to highlight empty input
                input.classList.remove("input-success");
            } else {
                input.classList.add("input-success");
                input.classList.remove("input-error"); // Remove error class if input is not empty
            }
        }
    });

    const childHistoryValue = document.getElementById("childprofile");
    if (childHistoryValue) {
        setInputValue("important_fam_members", response.important_fam_members);
        setInputValue("about_family_celebrations", response.about_family_celebrations);
        setRadioValue("childcare_before", response.childcare_before);
        setInputValue("reason_for_childcare_before", response.reason_for_childcare_before);
        setInputValue("what_child_interests", response.what_child_interests);
        setInputValue("drop_off_time", response.drop_off_time);
        setInputValue("pick_up_time", response.pick_up_time);

        setRadioValue("restricted_diet", response.restricted_diet);
        setInputValue("restricted_diet_reason", response.restricted_diet_reason);

        setRadioValue("eat_own", response.eat_own);
        setInputValue("eat_own_reason", response.eat_own_reason);

        setInputValue("favorite_foods", response.favorite_foods);

        // Rest in the middle of the day
        setRadioValue("rest_in_the_middle_day", response.rest_in_the_middle_day);
        setInputValue("reason_for_rest_in_the_middle_day", response.reason_for_rest_in_the_middle_day);
        setInputValue("rest_routine", response.rest_routine);

        // Toilet trained
        setRadioValue("toilet_trained", response.toilet_trained);
        setInputValue("reason_for_toilet_trained", response.reason_for_toilet_trained);

        // Existing illness/allergy
        setRadioValue("existing_illness_allergy", response.existing_illness_allergy);
        setInputValue("explain_for_existing_illness_allergy", response.explain_for_existing_illness_allergy);

        // Functioning at age
        setRadioValue("functioning_at_age", response.functioning_at_age);
        setInputValue("explain_for_functioning_at_age", response.explain_for_functioning_at_age);

        // Able to walk
        setRadioValue("able_to_walk", response.able_to_walk);
        setInputValue("explain_for_able_to_walk", response.explain_for_able_to_walk);

        // Communicate needs
        setRadioValue("communicate_their_needs", response.communicate_their_needs);
        setInputValue("explain_for_communicate_their_needs", response.explain_for_communicate_their_needs);

        // Any medication
        setRadioValue("any_medication", response.any_medication);
        setInputValue("explain_for_any_medication", response.explain_for_any_medication);

        // Utilize special equipment
        setRadioValue("utilize_special_equipment", response.utilize_special_equipment);
        setInputValue("explain_for_utilize_special_equipment", response.explain_for_utilize_special_equipment);

        // Significant periods
        setRadioValue("significant_periods", response.significant_periods);
        setInputValue("explain_for_significant_periods", response.explain_for_significant_periods);

        // Desire accommodations
        setRadioValue("desire_any_accommodations", response.desire_any_accommodations);
        setInputValue("explain_for_desire_any_accommodations", response.explain_for_desire_any_accommodations);

        // Additional information
        setInputValue("additional_information", response.additional_information);

        setCheckbox("do_you_agree_this", response.do_you_agree_this);




    }

    var inputs = document.querySelectorAll("#childprofile input");

    inputs.forEach(function (input) {
        if (input.type === "checkbox" || input.type === "radio") {
            if (input.checked) {
                input.classList.remove("input-success");
                input.classList.remove("input-error");
            }
        } else {
            if (input.value.trim() === "") {
                input.classList.add("input-error"); // Add a class to highlight empty input
                input.classList.remove("input-success");
            } else {
                input.classList.add("input-success");
                input.classList.remove("input-error"); // Remove error class if input is not empty
            }
        }
    });

    const pickupPasswordValue = document.getElementById("pickuppassword");
    if (pickupPasswordValue) {
        if (typeof response.child_password_pick_up_password_form !== "undefined") {
            setInputValue("child_password_pick_up_password_form", response.child_password_pick_up_password_form);
        }

        setCheckbox("do_you_agree_this_pick_up_password_form", response.do_you_agree_this_pick_up_password_form);
    }

    var inputs = document.querySelectorAll("#pickuppassword input");

    inputs.forEach(function (input) {
        if (input.type === "checkbox" || input.type === "radio") {
            if (input.checked) {
                input.classList.remove("input-success");
                input.classList.remove("input-error");
            }
        } else {
            if (input.value.trim() === "") {
                input.classList.add("input-error"); // Add a class to highlight empty input
                input.classList.remove("input-success");
            } else {
                input.classList.add("input-success");
                input.classList.remove("input-error"); // Remove error class if input is not empty
            }
        }
    });

    console.log(response.photo_usage_photo_video_permission_form);
    console.log(response.photo_permission_agree_group_photos_electronic);
    console.log(response.do_you_agree_this_photo_video_permission_form);
    const photoVideoPermissionValue = document.getElementById("photovideopermission");
    if (photoVideoPermissionValue) {
        // Set the value for photo usage form
        if (typeof response.photo_usage_photo_video_permission_form !== "undefined") {
            setInputValue("photo_usage_photo_video_permission_form", response.photo_usage_photo_video_permission_form);
        }

        // Set checkboxes based on the response
        if (typeof response.photo_permission_agree_group_photos_electronic !== "undefined") {
            const checkbox = document.getElementById("photo_permission_agree_group_photos_electronic");
            if (checkbox) {
                checkbox.checked = response.photo_permission_agree_group_photos_electronic === "on";
            }
        }
        if (typeof response.do_you_agree_this_photo_video_permission_form !== "undefined") {
            const checkbox = document.getElementById("do_you_agree_this_photo_video_permission_form");
            if (checkbox) {
                checkbox.checked = response.do_you_agree_this_photo_video_permission_form === "on";
            }
        }
        // setCheckbox("photo_permission_agree_group_photos_electronic", response.photo_permission_agree_group_photos_electronic);
        // setCheckbox("do_you_agree_this_photo_video_permission_form", response.do_you_agree_this_photo_video_permission_form);
    }

    var inputs = document.querySelectorAll("#photovideopermission select");

    inputs.forEach(function (input) {
        if (input.type === "checkbox" || input.type === "radio") {
            if (input.checked) {
                input.classList.remove("input-success");
                input.classList.remove("input-error");
            }
        } else {
            if (input.value.trim() === "") {
                input.classList.add("input-error"); // Add a class to highlight empty input
                input.classList.remove("input-success");
            } else {
                input.classList.add("input-success");
                input.classList.remove("input-error"); // Remove error class if input is not empty
            }
        }
    });

    const securitypolicyValue = document.getElementById("securitypolicy");
    if (securitypolicyValue) {
        // Using the helper function to set the checkbox state
        setCheckbox("security_release_policy_form", response.security_release_policy_form);

    }

    var inputs = document.querySelectorAll("#securitypolicy input");

    inputs.forEach(function (input) {
        if (input.type === "checkbox" || input.type === "radio") {
            if (input.checked) {
                input.classList.remove("input-success");
                input.classList.remove("input-error");
            }
        } else {
            if (input.value.trim() === "") {
                input.classList.add("input-error"); // Add a class to highlight empty input
                input.classList.remove("input-success");
            } else {
                input.classList.add("input-success");
                input.classList.remove("input-error"); // Remove error class if input is not empty
            }
        }
    });

    const medicaltransportationWeiverValue = document.getElementById("medicaltransportation");
    if (medicaltransportationWeiverValue) {
       
        // Set the value for the 'med_technicians_med_transportation_waiver' field if it's defined
        if (typeof response.med_technicians_med_transportation_waiver !== "undefined") {
            setInputValue("med_technicians_med_transportation_waiver", response.med_technicians_med_transportation_waiver);
            // document.getElementsByName("med_technicians_med_transportation_waiver")[0].value = response.med_technicians_med_transportation_waiver;
        }

        // Use the helper function to set the checkbox state
        setCheckbox("medical_transportation_waiver", response.medical_transportation_waiver);
    }

    var inputs = document.querySelectorAll("#medicaltransportation input");

    inputs.forEach(function (input) {
        if (input.type === "checkbox" || input.type === "radio") {
            if (input.checked) {
                input.classList.remove("input-success");
                input.classList.remove("input-error");
            }
        } else {
            if (input.value.trim() === "") {
                input.classList.add("input-error"); // Add a class to highlight empty input
                input.classList.remove("input-success");
            } else {
                input.classList.add("input-success");
                input.classList.remove("input-error"); // Remove error class if input is not empty
            }
        }
    });

    const healthPolicyValue = document.getElementById("healthpolicies");
    if (healthPolicyValue) {
        setCheckbox("do_you_agree_this_health_policies", response.do_you_agree_this_health_policies);
    }

    var inputs = document.querySelectorAll("#healthpolicies input");

    inputs.forEach(function (input) {
        if (input.type === "checkbox" || input.type === "radio") {
            if (input.checked) {
                input.classList.remove("input-success");
                input.classList.remove("input-error");
            }
        } else {
            if (input.value.trim() === "") {
                input.classList.add("input-error"); // Add a class to highlight empty input
                input.classList.remove("input-success");
            } else {
                input.classList.add("input-success");
                input.classList.remove("input-error"); // Remove error class if input is not empty
            }
        }
    });

    const outsideWeiverValue = document.getElementById("outsideengagements");
    if (outsideWeiverValue) {
        setCheckbox("parent_sign_outside_waiver", response.parent_sign_outside_waiver);

    }

    var inputs = document.querySelectorAll("#outsideengagements input");

    inputs.forEach(function (input) {
        if (input.type === "checkbox" || input.type === "radio") {
            if (input.checked) {
                input.classList.remove("input-success");
                input.classList.remove("input-error");
            }
        } else {
            if (input.value.trim() === "") {
                input.classList.add("input-error"); // Add a class to highlight empty input
                input.classList.remove("input-success");
            } else {
                input.classList.add("input-success");
                input.classList.remove("input-error"); // Remove error class if input is not empty
            }
        }
    });

    const socialMediaValue = document.getElementById("socialmediaapproval");
    if (socialMediaValue) {
        setRadioValue("approve_social_media_post", response.approve_social_media_post);
        setInputValue("printed_name_social_media_post", response.printed_name_social_media_post);
        setCheckbox("do_you_agree_this_social_media_post", response.do_you_agree_this_social_media_post);

    }

    var inputs = document.querySelectorAll("#socialmediaapproval input");

    inputs.forEach(function (input) {
        if (input.type === "checkbox" || input.type === "radio") {
            if (input.checked) {
                input.classList.remove("input-success");
                input.classList.remove("input-error");
            }
        } else {
            if (input.value.trim() === "") {
                input.classList.add("input-error"); // Add a class to highlight empty input
                input.classList.remove("input-success");
            } else {
                input.classList.add("input-success");
                input.classList.remove("input-error"); // Remove error class if input is not empty
            }
        }
    });

    // // Admission form parent agreement
    const parentSignatureForm = document.getElementById("parentsignature");
    if (parentSignatureForm) {
        if (typeof response.parent_sign_admission !== "undefined") {
            const signField = document.getElementsByName("parent_sign_admission")[0];
            if (signField) {
                signField.value = response.parent_sign_admission;
            }
        }

        const dateField = document.getElementsByName("parent_sign_date_admission")[0];
        if (dateField) {
            if (response.parent_sign_date_admission === null || response.parent_sign_date_admission === undefined) {
                dateField.value = new Date().toISOString().split('T')[0];
            } else {
                dateField.value = response.parent_sign_date_admission;
            }
        }
    }

    var inputs = document.querySelectorAll("#parentsignature input");

    inputs.forEach(function (input) {
        if (input.type === "checkbox" || input.type === "radio") {
            if (input.checked) {
                input.classList.remove("input-success");
                input.classList.remove("input-error");
            }
        } else {
            if (input.value.trim() === "") {
                input.classList.add("input-error"); // Add a class to highlight empty input
                input.classList.remove("input-success");
            } else {
                input.classList.add("input-success");
                input.classList.remove("input-error"); // Remove error class if input is not empty
            }
        }
    });

    // Render the value for Enrollment Agreement Form 

    const childEnrollmentAgreementValue = document.getElementById("childenrollmentagreement");
    if (childEnrollmentAgreementValue) {

        if (typeof response.point_one_field_one !== "undefined") {
            const pointOneFieldValue = document.getElementsByName("point_one_field_one")[0];
            if (pointOneFieldValue) {
                pointOneFieldValue.value = response.point_one_field_one;
            }
        } else {
            document.getElementsByName("point_one_field_one")[0].value = new Date().toISOString().split('T')[0];
        }

        if (typeof response.point_one_field_two !== "undefined") {
            const pointTwoFieldValue = document.getElementsByName("point_one_field_two")[0];
            if (pointTwoFieldValue) {
                pointTwoFieldValue.value = response.point_one_field_two;
            }
        }

        if (typeof response.point_one_field_three !== "undefined") {
            const pointThreeFieldValue = document.getElementsByName("point_one_field_three")[0];
            if (pointThreeFieldValue) {
                pointThreeFieldValue.value = response.point_one_field_three;
            }
        }

        if (typeof response.point_two_initial_here !== "undefined") {
            const pointTwoInitialValue = document.getElementsByName("point_two_initial_here")[0];
            if (pointTwoInitialValue) {
                pointTwoInitialValue.value = response.point_two_initial_here;
            }
        }

        if (typeof response.point_three_initial_here !== "undefined") {
            const pointThreeInitialValue = document.getElementsByName("point_three_initial_here")[0];
            if (pointThreeInitialValue) {
                pointThreeInitialValue.value = response.point_three_initial_here;
            }
        }

        if (typeof response.point_four_initial_here !== "undefined") {
            const pointFourInitialValue = document.getElementsByName("point_four_initial_here")[0];
            if (pointFourInitialValue) {
                pointFourInitialValue.value = response.point_four_initial_here;
            }
        }

        if (typeof response.point_five_initial_here !== "undefined") {
            const pointFiveInitialValue = document.getElementsByName("point_five_initial_here")[0];
            if (pointFiveInitialValue) {
                pointFiveInitialValue.value = response.point_five_initial_here;
            }
        }

        if (typeof response.point_six_initial_here !== "undefined") {
            const pointSixInitialValue = document.getElementsByName("point_six_initial_here")[0];
            if (pointSixInitialValue) {
                pointSixInitialValue.value = response.point_six_initial_here;
            }
        }

        if (typeof response.point_seven_initial_here !== "undefined") {
            const pointSevenInitialValue = document.getElementsByName("point_seven_initial_here")[0];
            if (pointSevenInitialValue) {
                pointSevenInitialValue.value = response.point_seven_initial_here;
            }
        }

        if (typeof response.point_eight_initial_here !== "undefined") {
            const pointEightInitialValue = document.getElementsByName("point_eight_initial_here")[0];
            if (pointEightInitialValue) {
                pointEightInitialValue.value = response.point_eight_initial_here;
            }
        }

        if (typeof response.point_nine_initial_here !== "undefined") {
            const pointNineInitialValue = document.getElementsByName("point_nine_initial_here")[0];
            if (pointNineInitialValue) {
                pointNineInitialValue.value = response.point_nine_initial_here;
            }
        }

        if (typeof response.point_ten_initial_here !== "undefined") {
            const pointTenInitialValue = document.getElementsByName("point_ten_initial_here")[0];
            if (pointTenInitialValue) {
                pointTenInitialValue.value = response.point_ten_initial_here;
            }
        }

        if (typeof response.point_eleven_initial_here !== "undefined") {
            const pointElevenInitialValue = document.getElementsByName("point_eleven_initial_here")[0];
            if (pointElevenInitialValue) {
                pointElevenInitialValue.value = response.point_eleven_initial_here;
            }
        }

        if (typeof response.point_twelve_initial_here !== "undefined") {
            const pointTwelveInitialValue = document.getElementsByName("point_twelve_initial_here")[0];
            if (pointTwelveInitialValue) {
                pointTwelveInitialValue.value = response.point_twelve_initial_here;
            }
        }

        if (typeof response.point_thirteen_initial_here !== "undefined") {
            const pointThirteenInitialValue = document.getElementsByName("point_thirteen_initial_here")[0];
            if (pointThirteenInitialValue) {
                pointThirteenInitialValue.value = response.point_thirteen_initial_here;
            }
        }

        if (typeof response.point_fourteen_initial_here !== "undefined") {
            const pointFourteenInitialValue = document.getElementsByName("point_fourteen_initial_here")[0];
            if (pointFourteenInitialValue) {
                pointFourteenInitialValue.value = response.point_fourteen_initial_here;
            }
        }

        if (typeof response.point_fifteen_initial_here !== "undefined") {
            const pointFifteenInitialValue = document.getElementsByName("point_fifteen_initial_here")[0];
            if (pointFifteenInitialValue) {
                pointFifteenInitialValue.value = response.point_fifteen_initial_here;
            }
        }

        if (typeof response.point_sixteen_initial_here !== "undefined") {
            const pointSixteenInitialValue = document.getElementsByName("point_sixteen_initial_here")[0];
            if (pointSixteenInitialValue) {
                pointSixteenInitialValue.value = response.point_sixteen_initial_here;
            }
        }

        if (typeof response.point_seventeen_initial_here !== "undefined") {
            const pointSeventeenInitialValue = document.getElementsByName("point_seventeen_initial_here")[0];
            if (pointSeventeenInitialValue) {
                pointSeventeenInitialValue.value = response.point_seventeen_initial_here;
            }
        }

        if (typeof response.point_eighteen_initial_here !== "undefined") {
            const pointEighteenInitialValue = document.getElementsByName("point_eighteen_initial_here")[0];
            if (pointEighteenInitialValue) {
                pointEighteenInitialValue.value = response.point_eighteen_initial_here;
            }
        }

        if (typeof response.point_ninteen_initial_here !== "undefined") {
            const pointNinteenInitialValue = document.getElementsByName("point_ninteen_initial_here")[0];
            if (pointNinteenInitialValue) {
                pointNinteenInitialValue.value = response.point_ninteen_initial_here;
            }
        }

        if (typeof response.preferred_start_date !== "undefined") {
            const preferredStartDateValue = document.getElementsByName("preferred_start_date")[0];
            if (preferredStartDateValue) {
                preferredStartDateValue.value = response.preferred_start_date;
            }
        }

        if (typeof response.preferred_schedule !== "undefined") {
            const preferredScheduleValue = document.getElementsByName("preferred_schedule")[0];
            if (preferredScheduleValue) {
                preferredScheduleValue.value = response.preferred_schedule;
            }
        }

        if (response.full_day == "on") {
            document.getElementById("full_day").checked = true;
        } else {
            document.getElementById("full_day").checked = false;
        }
        if (response.half_day == "on") {
            document.getElementById("half_day").checked = true;
        } else {
            document.getElementById("half_day").checked = false;
        }

    }

    var inputs = document.querySelectorAll(
        "#childenrollmentagreement input"
    );
    var selects = document.querySelectorAll("#childenrollmentagreement select");

    selects.forEach(function (select) {
        if (select.value.trim() === "") {
            select.classList.add("input-error"); // Add a class to highlight empty input
            select.classList.remove("input-success");
        } else {
            select.classList.add("input-success");
            select.classList.remove("input-error"); // Remove error class if input is not empty
        }
    });

    inputs.forEach(function (input) {
        if (input.type === "checkbox" || input.type === "radio") {
            if (input.checked) {
                input.classList.remove("input-success");
                input.classList.remove("input-error");
            }
        } else {
            if (input.value.trim() === "") {
                input.classList.add("input-error"); // Add a class to highlight empty input
                input.classList.remove("input-success");
            } else {
                input.classList.add("input-success");
                input.classList.remove("input-error"); // Remove error class if input is not empty
            }
        }
    });

    // Entrollment form parent agreement
    const parentSignatureEntrollForm = document.getElementById("childenrollmentagreementparentsign");
    if (parentSignatureEntrollForm) {
        if (typeof response.parent_sign_enroll !== "undefined") {
            const signField = document.getElementsByName("parent_sign_enroll")[0];
            if (signField) {
                signField.value = response.parent_sign_enroll;
            }
        }

        const dateField = document.getElementsByName("parent_sign_date_enroll")[0];
        if (dateField) {
            if (response.parent_sign_date_enroll === null || response.parent_sign_date_enroll === undefined) {
                dateField.value = new Date().toISOString().split('T')[0];
            } else {
                dateField.value = response.parent_sign_date_enroll;
            }
        }
    }

    var inputs = document.querySelectorAll(
        "#childenrollmentagreementparentsign input"
    );

    inputs.forEach(function (input) {
        if (input.type === "checkbox" || input.type === "radio") {
            if (input.checked) {
                input.classList.remove("input-success");
                input.classList.remove("input-error");
            }
        } else {
            if (input.value.trim() === "") {
                input.classList.add("input-error"); // Add a class to highlight empty input
                input.classList.remove("input-success");
            } else {
                input.classList.add("input-success");
                input.classList.remove("input-error"); // Remove error class if input is not empty
            }
        }
    });

    // Render the value for Entrollment Agreement Form

    const Authorizationach = document.getElementById("authorizationach");

    if (Authorizationach) {
        if (typeof response.bank_routing !== "undefined") {
            const bankRouting = document.getElementById("bank_routing");
            if (bankRouting) {
                bankRouting.value = response.bank_routing;
            }
        }
        if (typeof response.bank_account !== "undefined") {
            const bankAccount = document.getElementById("bank_account");
            if (bankAccount) {
                bankAccount.value = response.bank_account;
            }
        }

        if (typeof response.driver_license !== "undefined") {
            const DriverLicense = document.getElementById("driver_license");
            if (DriverLicense) {
                DriverLicense.value = response.driver_license;
            }
        }

        if (typeof response.state !== "undefined") {
            const State = document.getElementById("state");
            if (State) {
                State.value = response.state;
            }
        }

        if (typeof response.i !== "undefined") {
            const I = document.getElementById("i");
            if (I) {
                I.value = response.i;
            }
        }

    }

    var inputs = document.querySelectorAll("#authorizationach input");

    var selects = document.querySelectorAll("#authorizationach select");

    selects.forEach(function (select) {
        if (select.value.trim() === "") {
            select.classList.add("input-error"); // Add a class to highlight empty input
            select.classList.remove("input-success");
        } else {
            select.classList.add("input-success");
            select.classList.remove("input-error"); // Remove error class if input is not empty
        }
    });

    inputs.forEach(function (input) {
        if (input.type === "checkbox" || input.type === "radio") {
            if (input.checked) {
                input.classList.remove("input-success");
                input.classList.remove("input-error");
            }
        } else {
            if (input.value.trim() === "") {
                input.classList.add("input-error"); // Add a class to highlight empty input
                input.classList.remove("input-success");
            } else {
                input.classList.add("input-success");
                input.classList.remove("input-error"); // Remove error class if input is not empty
            }
        }
    });


    // Authorization form parent agreement
    const parentSignatureAuthorizationForm = document.getElementById("authorizationparentsign");
    if (parentSignatureAuthorizationForm) {
        if (typeof response.parent_sign_ach !== "undefined") {
            const signField = document.getElementsByName("parent_sign_ach")[0];
            if (signField) {
                signField.value = response.parent_sign_ach;
            }
        }

        const dateField = document.getElementsByName("parent_sign_date_ach")[0];
        if (dateField) {
            if (response.parent_sign_date_ach === null || response.parent_sign_date_ach === undefined) {
                dateField.value = new Date().toISOString().split('T')[0];
            } else {
                dateField.value = response.parent_sign_date_ach;
            }
        }
    }

    var inputs = document.querySelectorAll(
        "#authorizationparentsign input"
    );

    inputs.forEach(function (input) {
        if (input.type === "checkbox" || input.type === "radio") {
            if (input.checked) {
                input.classList.remove("input-success");
                input.classList.remove("input-error");
            }
        } else {
            if (input.value.trim() === "") {
                input.classList.add("input-error"); // Add a class to highlight empty input
                input.classList.remove("input-success");
            } else {
                input.classList.add("input-success");
                input.classList.remove("input-error"); // Remove error class if input is not empty
            }
        }
    });

    // Render the value for Parent Handbook

    const Volumeone = document.getElementById("volumeone");

    if (Volumeone) {
        if (typeof response.welcome_goddard_agreement !== "undefined") {
            const checkbox = document.getElementById("welcome_goddard_agreement");
            if (checkbox) {
                checkbox.checked = response.welcome_goddard_agreement === "on";
            }
        }
        if (typeof response.mission_statement_agreement !== "undefined") {
            const checkbox = document.getElementById("mission_statement_agreement");
            if (checkbox) {
                checkbox.checked = response.mission_statement_agreement === "on";
            }
        }
        if (typeof response.general_information_agreement !== "undefined") {
            const checkbox = document.getElementById("general_information_agreement");
            if (checkbox) {
                checkbox.checked = response.general_information_agreement === "on";
            }
        }

        if (typeof response.medical_care_provider_agreement !== "undefined") {
            const checkbox = document.getElementById("medical_care_provider_agreement");
            if (checkbox) {
                checkbox.checked = response.medical_care_provider_agreement === "on";
            }
        }

        if (typeof response.parent_access_agreement !== "undefined") {
            const checkbox = document.getElementById("parent_access_agreement");
            if (checkbox) {
                checkbox.checked = response.parent_access_agreement === "on";
            }
        }

        if (typeof response.release_of_children_agreement !== "undefined") {
            const checkbox = document.getElementById("release_of_children_agreement");
            if (checkbox) {
                checkbox.checked = response.release_of_children_agreement === "on";
            }
        }

        if (typeof response.registration_fees_agreement !== "undefined") {
            const checkbox = document.getElementById("registration_fees_agreement");
            if (checkbox) {
                checkbox.checked = response.registration_fees_agreement === "on";
            }
        }

        if (typeof response.outside_engagements_agreement !== "undefined") {
            const checkbox = document.getElementById("outside_engagements_agreement");
            if (checkbox) {
                checkbox.checked = response.outside_engagements_agreement === "on";
            }
        }

        if (typeof response.health_policies_agreement !== "undefined") {
            const checkbox = document.getElementById("health_policies_agreement");
            if (checkbox) {
                checkbox.checked = response.health_policies_agreement === "on";
            }
        }

        if (typeof response.medication_procedures_agreement !== "undefined") {
            const checkbox = document.getElementById("medication_procedures_agreement");
            if (checkbox) {
                checkbox.checked = response.medication_procedures_agreement === "on";
            }
        }

        if (typeof response.bring_to_school_agreement !== "undefined") {
            const checkbox = document.getElementById("bring_to_school_agreement");
            if (checkbox) {
                checkbox.checked = response.bring_to_school_agreement === "on";
            }
        }

        if (typeof response.rest_time_agreement !== "undefined") {
            const checkbox = document.getElementById("rest_time_agreement");
            if (checkbox) {
                checkbox.checked = response.rest_time_agreement === "on";
            }
        }

        if (typeof response.training_philosophy_agreement !== "undefined") {
            const checkbox = document.getElementById("training_philosophy_agreement");
            if (checkbox) {
                checkbox.checked = response.training_philosophy_agreement === "on";
            }
        }

        if (typeof response.affiliation_policy_agreement !== "undefined") {
            const checkbox = document.getElementById("affiliation_policy_agreement");
            if (checkbox) {
                checkbox.checked = response.affiliation_policy_agreement === "on";
            }
        }

        if (typeof response.security_issue_agreement !== "undefined") {
            const checkbox = document.getElementById("security_issue_agreement");
            if (checkbox) {
                checkbox.checked = response.security_issue_agreement === "on";
            }
        }

        if (typeof response.expulsion_policy_agreement !== "undefined") {
            const checkbox = document.getElementById("expulsion_policy_agreement");
            if (checkbox) {
                checkbox.checked = response.expulsion_policy_agreement === "on";
            }
        }

        if (typeof response.addressing_individual_child_agreement !== "undefined") {
            const checkbox = document.getElementById("addressing_individual_child_agreement");
            if (checkbox) {
                checkbox.checked = response.addressing_individual_child_agreement === "on";
            }
        }

        if (typeof response.finalword_agreement !== "undefined") {
            const checkbox = document.getElementById("finalword_agreement");
            if (checkbox) {
                checkbox.checked = response.finalword_agreement === "on";
            }
        }
    }

    var inputs = document.querySelectorAll("#volumeone input");

    inputs.forEach(function (input) {
        if (input.type === "checkbox" || input.type === "radio") {
            if (input.checked) {
                input.classList.remove("input-success");
                input.classList.remove("input-error");
            }
        } else {
            if (input.value.trim() === "") {
                input.classList.add("input-error"); // Add a class to highlight empty input
                input.classList.remove("input-success");
            } else {
                input.classList.add("input-success");
                input.classList.remove("input-error"); // Remove error class if input is not empty
            }
        }
    });

    // ParentHandbook form parent agreement
    const parentSignatureParentHandbookForm = document.getElementById("parentsignaturehandbook");
    if (parentSignatureParentHandbookForm) {
        if (typeof response.parent_sign_handbook !== "undefined") {
            const signField = document.getElementsByName("parent_sign_handbook")[0];
            if (signField) {
                signField.value = response.parent_sign_handbook;
            }
        }

        const dateField = document.getElementsByName("parent_sign_date_handbook")[0];
        if (dateField) {
            if (response.parent_sign_date_handbook === null || response.parent_sign_date_handbook === undefined) {
                dateField.value = new Date().toISOString().split('T')[0];
            } else {
                dateField.value = response.parent_sign_date_handbook;
            }
        }
    }

    var inputs = document.querySelectorAll(
        "#parentsignaturehandbook input"
    );

    inputs.forEach(function (input) {
        if (input.type === "checkbox" || input.type === "radio") {
            if (input.checked) {
                input.classList.remove("input-success");
                input.classList.remove("input-error");
            }
        } else {
            if (input.value.trim() === "") {
                input.classList.add("input-error"); // Add a class to highlight empty input
                input.classList.remove("input-success");
            } else {
                input.classList.add("input-success");
                input.classList.remove("input-error"); // Remove error class if input is not empty
            }
        }
    });

}

function setRadioValue(baseId, value) {
    const radio = document.getElementById(`${baseId}${value}`);
    if (radio) radio.checked = true;
}


function setInputValue(name, value) {
    const input = document.getElementsByName(name)[0];
    if (input && typeof value !== "undefined") {
        input.value = value;
    }
}

function setCheckbox(id, value) {
    const el = document.getElementById(id);
    if (el) el.checked = value === "on";
}



// Function to validate all forms and update UI indicators
// Function to validate all forms and update UI indicators
function validateAllForms(response) {
    // Initialize validation flags
    let childbasicInfo = false;
    let childparentInfo = false;
    let additionalChildparentInfo = false;
    let childEmergencyContact = false;
    let childMedicalcare = false;
    let childParentAgreementOne = false;
    let childHistory = false;
    let medicalHistory = false;
    let pregnancyHistory = false;
    let familyHistroy = false;
    let socialBehavior = false;
    let environmentalFactor = false;
    let parentAgreementTwo = false;
    let immunizationInstruction = false;
    let childProfile = false;
    let nutritionDetails = false;
    let restDetails = false;
    let medicalDetails = false;
    let parentAgreementThree = false;
    let pickupPassword = false;
    let photoVideoPermission = false;
    let securityPolicy = false;
    let medicaltransportationWeiver = false;
    let healthPolicy = false;
    let outsideWeiver = false;
    let socialMedia = false;
    let admissionparentsign = false;
    let isValidContact = false;
    let allContactsValid = false;

    // Validate child information
    if (document.getElementById("childinformation")) {
        if (
            response.child_first_name &&
            response.child_last_name &&
            response.nick_name &&
            response.dob &&
            response.primary_language &&
            response.school_age_child_school &&
            response.gender
        ) {
            updateValidationIcons(".childdetails-tick", ".childdetails-circle", true);
            childbasicInfo = true;
        } else {
            updateValidationIcons(".childdetails-tick", ".childdetails-circle", false);
            childbasicInfo = false;
        }

        //parent form
        if (
            response.primary_parent_info.parent_name &&
            response.primary_parent_info.parent_street_address &&
            response.primary_parent_info.parent_city_address &&
            response.primary_parent_info.parent_state_address &&
            response.primary_parent_info.parent_zip_address &&
            response.primary_parent_info.parent_home_telephone_number &&
            response.primary_parent_info.parent_business_name &&
            response.primary_parent_info.parent_work_hours_from &&
            response.primary_parent_info.parent_work_hours_to &&
            response.primary_parent_info.parent_business_telephone_number &&
            response.primary_parent_info.parent_business_cell_number &&
            response.primary_parent_info.parent_email
        ) {
            childparentInfo = true;
            updateValidationIcons(".parentdetails-tick", ".parentdetails-circle", true);
        } else {
            childparentInfo = false;
            updateValidationIcons(".parentdetails-tick", ".parentdetails-circle", false);
        }

        //additional parent form
        if (
            response.additional_parent_info.parent_name &&
            response.additional_parent_info.parent_street_address &&
            response.additional_parent_info.parent_city_address &&
            response.additional_parent_info.parent_state_address &&
            response.additional_parent_info.parent_zip_address &&
            response.additional_parent_info.parent_home_telephone_number &&
            response.additional_parent_info.parent_business_name &&
            response.additional_parent_info.parent_work_hours_from &&
            response.additional_parent_info.parent_work_hours_to &&
            response.additional_parent_info.parent_business_telephone_number &&
            response.additional_parent_info.parent_business_cell_number &&
            response.additional_parent_info.parent_email
        ) {
            additionalChildparentInfo = true;
            updateValidationIcons(".parent_twodetails-tick", ".parent_twodetails-circle", true);
        } else {
            additionalChildparentInfo = false;
            updateValidationIcons(".parent_twodetails-tick", ".parent_twodetails-circle", false);
        }

        //emergency care provide
        if (
            response.child_emergency_contact_name ||
            response.child_emergency_contact_relationship ||
            response.child_emergency_contact_telephone_number ||
            response.child_emergency_contact_full_address ||
            response.child_emergency_contact_city_address ||
            response.child_emergency_contact_state_address ||
            response.child_emergency_contact_zip_address
        ) {
            isValidContact = false;
            allContactsValid = false;
        } else {
            isValidContact = true;
            allContactsValid = true;

        }
        if (allContactsValid) {
            childEmergencyContact = true;
            updateValidationIcons(".emergencycontact-tick", ".emergencycontact-circle", true);
        } else {
            childEmergencyContact = false;
            updateValidationIcons(".emergencycontact-tick", ".emergencycontact-circle", false);
        }

        // Medical care validation
        if (
            response.child_care_provider_info?.child_care_provider_name &&
            response.child_care_provider_info?.child_care_provider_telephone_number &&
            response.child_care_provider_info?.child_hospital_affiliation &&
            response.child_care_provider_info?.child_care_provider_street_address &&
            response.child_care_provider_info?.child_care_provider_city_address &&
            response.child_care_provider_info?.child_care_provider_state_address &&
            response.child_care_provider_info?.child_care_provider_zip_address &&
            response.child_dentist_info?.child_dentist_name &&
            response.child_dentist_info?.dentist_telephone_number &&
            response.child_dentist_info?.dentist_street_address &&
            response.child_dentist_info?.dentist_city_address &&
            response.child_dentist_info?.dentist_state_address &&
            response.child_dentist_info?.dentist_zip_address &&
            response.special_diabilities &&
            response.allergies_medication_reaction &&
            response.additional_info &&
            response.medication &&
            response.health_insurance &&
            response.policy_number
        ) {
            updateValidationIcons(".medicalcare-tick", ".medicalcare-circle", true);
            childMedicalcare = true;
        } else {
            updateValidationIcons(".medicalcare-tick", ".medicalcare-circle", false);
            childMedicalcare = false;
        }

        if (
            response.obtaining_emergency_medical_care &&
            response.administration_first_aid_procedures &&
            response.agree_all_above_information_is_correct
        ) {
            childParentAgreementOne = true;
            updateValidationIcons(".parentagreement-tick", ".parentagreement-circle", true);
        } else {
            childParentAgreementOne = false;
            updateValidationIcons(".parentagreement-tick", ".parentagreement-circle", false);
        }
        // Overall child info validation
        if (
            childbasicInfo &&
            childparentInfo &&
            additionalChildparentInfo &&
            childMedicalcare &&
            childEmergencyContact &&
            childParentAgreementOne
        ) {
           
            updateValidationIcons(".childinfo-tick", ".childinfo-circle", true);
        } else {
           
            updateValidationIcons(".childinfo-tick", ".childinfo-circle", false);
        }

        

        if (
            response.physical_exam_last_date &&
            response.dental_exam_last_date
        ) {
            childHistory = true;
            updateValidationIcons(".childhistoryDetails-tick", ".childhistoryDetails-circle", true);
        } else {
            childHistory = false;
            updateValidationIcons(".childhistoryDetails-tick", ".childhistoryDetails-circle", false);
        }

        //medical history
        if (
            response.allergies &&
            response.asthma &&
            response.bleeding_problems &&
            response.diabetes &&
            response.epilepsy &&
            response.frequent_ear_infections &&
            response.hearing_problems &&
            response.hospitalization &&
            response.rheumatic_fever &&
            response.seizures_convulsions &&
            response.serious_injuries_accidents &&
            response.surgeries &&
            response.vision_problems &&
            response.medical_other
        ) {
            medicalHistory = true;
            updateValidationIcons(".medicalhistory-tick", ".medicalhistory-circle", true);
        } else {
            medicalHistory = false;
            updateValidationIcons(".medicalhistory-tick", ".medicalhistory-circle", false);
        }
        //pragnancy history
        if (
            response.illness_during_pregnancy &&
            response.condition_of_newborn &&
            response.duration_of_pregnancy &&
            response.birth_weight_lbs &&
            response.birth_weight_oz &&
            response.complications &&
            response.bottle_fed &&
            response.breast_fed &&
            response.other_siblings_name &&
            response.other_siblings_age
        ) {
            pregnancyHistory = true;
            updateValidationIcons(".pregnancyhistory-tick", ".pregnancyhistory-circle", true);
        } else {
            pregnancyHistory = false;
            updateValidationIcons(".pregnancyhistory-tick", ".pregnancyhistory-circle", false);
        }

        //family history
        if (
            response.family_history_allergies ||
            response.family_history_heart_problems ||
            response.family_history_tuberculosis ||
            response.family_history_asthma ||
            response.family_history_high_blood_pressure ||
            response.family_history_vision_problems ||
            response.family_history_diabetes ||
            response.family_history_hyperactivity ||
            response.family_history_epilepsy ||
            response.no_illnesses_for_this_child
        ) {
            familyHistroy = true;
            updateValidationIcons(".familyhistory-tick", ".familyhistory-circle", true);
        } else {
            familyHistroy = false;
            updateValidationIcons(".familyhistory-tick", ".familyhistory-circle", false);
        }

        //social behavior 
        if (
            response.age_group_friends &&
            response.neighborhood_friends &&
            response.relationship_with_mother &&
            response.relationship_with_father &&
            response.relationship_with_siblings &&
            response.relationship_with_extended_family &&
            response.fears_conflicts &&
            response.child_response_frustration &&
            response.favorite_activities
        ) {
            socialBehavior = true;
            updateValidationIcons(".socialbehavior-tick", ".socialbehavior-circle", true);
        } else {
            socialBehavior = false;
            updateValidationIcons(".socialbehavior-tick", ".socialbehavior-circle", false);
        }

        //environmental factor
        if (
            response.last_five_years_moved &&
            response.things_used_at_home &&
            response.hours_of_television_daily &&
            response.language_used_at_home &&
            response.changes_at_home_situation &&
            response.educational_expectations_of_child
        ) {
            environmentalFactor = true;
            updateValidationIcons(".environmentalfactor-tick", ".environmentalfactor-circle", true);
        } else {
            environmentalFactor = false;
            updateValidationIcons(".environmentalfactor-tick", ".environmentalfactor-circle", false);
        }
        if (
            response.agree_all_above_info_is_correct
        ) {
            parentAgreementTwo = true;
            updateValidationIcons(".parentagreement-two-tick", ".parentagreement-two-circle", true);
        } else {
            parentAgreementTwo = false;
            updateValidationIcons(".parentagreement-two-tick", ".parentagreement-two-circle", false);
        }

        //social behavior 
        if (
            childHistory == true &&
            medicalHistory == true &&
            pregnancyHistory == true &&
            familyHistroy == true &&
            socialBehavior == true &&
            environmentalFactor == true &&
            parentAgreementTwo == true
        ) {
            updateValidationIcons(".childhistory-tick", ".childhistory-circle", true);
        } else {
            updateValidationIcons(".childhistory-tick", ".childhistory-circle", false);
        }

        if (
            response.do_you_agree_this_immunization_instructions == "on"
        ) {
            updateValidationIcons(".immunization-tick", ".immunization-circle", true);
        } else {
            updateValidationIcons(".immunization-tick", ".immunization-circle", false);
        }

        if (
            response.important_fam_members &&
            response.about_family_celebrations &&
            response.childcare_before &&
            response.reason_for_childcare_before &&
            response.what_child_interests &&
            response.drop_off_time &&
            response.pick_up_time
        ) {
            childProfile = true;
            updateValidationIcons(".childprofiledetail-tick", ".childprofiledetail-circle", true);
        } else {
            childProfile = false;
            updateValidationIcons(".childprofiledetail-tick", ".childprofiledetail-circle", false);
        }
        if (
            response.restricted_diet &&
            response.eat_own &&
            response.favorite_foods
        ) {
            nutritionDetails = true;
            updateValidationIcons(".nutrition-tick", ".nutrition-circle", true);
        } else {
            nutritionDetails = false;
            updateValidationIcons(".nutrition-tick", ".nutrition-circle", false);
        }

        if (
            response.rest_in_the_middle_day &&
            response.rest_routine &&
            response.toilet_trained
        ) {
            restDetails = true;
            updateValidationIcons(".restdetails-tick", ".restdetails-circle", true);
        } else {
            restDetails = false;
            updateValidationIcons(".restdetails-tick", ".restdetails-circle", false);
        }
        if (
            response.existing_illness_allergy &&
            response.explain_for_existing_illness_allergy &&
            response.functioning_at_age &&
            response.explain_for_functioning_at_age &&
            response.able_to_walk &&
            response.explain_for_able_to_walk &&
            response.communicate_their_needs &&
            response.explain_for_communicate_their_needs &&
            response.any_medication &&
            response.explain_for_any_medication &&
            response.utilize_special_equipment &&
            response.explain_for_utilize_special_equipment &&
            response.significant_periods &&
            response.explain_for_significant_periods &&
            response.desire_any_accommodations &&
            response.explain_for_desire_any_accommodations &&
            response.additional_information
        ) {
            medicalDetails = true;
            updateValidationIcons(".medicaldetails-tick", ".medicaldetails-circle", true);
        } else {
            medicalDetails = false;
            updateValidationIcons(".medicaldetails-tick", ".medicaldetails-circle", false);
        }
        if (
            response.do_you_agree_this
        ) {
            parentAgreementThree = true;
            updateValidationIcons(".parentagreement-three-tick", ".parentagreement-three-circle", true);
        } else {
            parentAgreementThree = false;
            updateValidationIcons(".parentagreement-three-tick", ".parentagreement-three-circle", false);
        }

        if (
            childProfile == true &&
            nutritionDetails == true &&
            restDetails == true &&
            medicalDetails == true &&
            parentAgreementThree == true
        ) {
            updateValidationIcons(".childprofile-tick", ".childprofile-circle", true);
        } else {
            updateValidationIcons(".childprofile-tick", ".childprofile-circle", false);
        }
        if (
            response.child_password_pick_up_password_form &&
            response.do_you_agree_this_pick_up_password_form
        ) {
            updateValidationIcons(".childpickup-tick", ".childpickup-circle", true);
        } else {
            updateValidationIcons(".childpickup-tick", ".childpickup-circle", false);
        }

        console.log( response.photo_usage_photo_video_permission_form);
        console.log(response.photo_permission_agree_group_photos_electronic);
        console.log(response.do_you_agree_this_photo_video_permission_form);
        if (
            response.photo_usage_photo_video_permission_form &&
            response.photo_permission_agree_group_photos_electronic == "on" &&
            response.do_you_agree_this_photo_video_permission_form == "on"
        ) {
            updateValidationIcons(".childphotopermission-tick", ".childphotopermission-circle", true);
        } else {
            updateValidationIcons(".childphotopermission-tick", ".childphotopermission-circle", false);
        }
        if (
            response.security_release_policy_form
        ) {
            updateValidationIcons(".childsecurity-tick", ".childsecurity-circle", true);
        } else {
            updateValidationIcons(".childsecurity-tick", ".childsecurity-circle", false);
        }
        if (
            response.med_technicians_med_transportation_waiver &&
            response.medical_transportation_waiver
        ) {
            updateValidationIcons(".childmedical-tick", ".childmedical-circle", true);
        } else {
            updateValidationIcons(".childmedical-tick", ".childmedical-circle", false);
        }
        if (
            response.do_you_agree_this_health_policies
        ) {
            updateValidationIcons(".childhealth-tick", ".childhealth-circle", true);
        } else {
            updateValidationIcons(".childhealth-tick", ".childhealth-circle", false);
        }
        if (
            response.parent_sign_outside_waiver
        ) {
            updateValidationIcons(".childoutside-tick", ".childoutside-circle", true);
        } else {
            updateValidationIcons(".childoutside-tick", ".childoutside-circle", false);
        }
        if (
            response.approve_social_media_post &&
            response.printed_name_social_media_post &&
            response.do_you_agree_this_social_media_post
        ) {
            updateValidationIcons(".socialmedia-tick", ".socialmedia-circle", true);
        } else {
            updateValidationIcons(".socialmedia-tick", ".socialmedia-circle", false);
        }
        // if (
        //     response.parent_sign_outside_waiver
        // ) {
        //     updateValidationIcons(".childoutside-tick", ".childoutside-circle", true);
        // } else {
        //     updateValidationIcons(".childoutside-tick", ".childoutside-circle", false);
        // }

    }
    // Validate parent signature
    if (document.getElementById("parentsignature")) {
        if (
            response.parent_sign_admission &&
            response.parent_sign_date_admission
        ) {
            updateValidationIcons(".childparent-tick", ".childparent-circle", true);
            admissionparentsign = true;
        } else {
            updateValidationIcons(".childparent-tick", ".childparent-circle", false);
            admissionparentsign = false;
        }

        // Enable/disable parent final agreement button
        const allFormsComplete =
            childbasicInfo &&
            childparentInfo &&
            childEmergencyContact &&
            childMedicalcare &&
            childParentAgreementOne &&
            childHistory &&
            medicalHistory &&
            pregnancyHistory &&
            familyHistroy &&
            socialBehavior &&
            environmentalFactor &&
            parentAgreementTwo &&
            immunizationInstruction &&
            childProfile &&
            nutritionDetails &&
            restDetails &&
            medicalDetails &&
            parentAgreementThree &&
            pickupPassword &&
            photoVideoPermission &&
            securityPolicy &&
            medicaltransportationWeiver &&
            healthPolicy &&
            outsideWeiver &&
            socialMedia;

        let parentFinalAgreement = document.getElementById("parentFinalAgreement");
        if (parentFinalAgreement) {
            if (allFormsComplete) {
                updateValidationIcons(".childparent-tick", ".childparent-circle", true);
                parentFinalAgreement.classList.remove("disabled");
            } else {
                updateValidationIcons(".childparent-tick", ".childparent-circle", false);
                parentFinalAgreement.classList.add("disabled");
            }
        }

        let adminFinalAgreement = document.getElementById("adminFinalAgreement");
        if (adminFinalAgreement) {
             if ( localStorage.getItem("logged_in_email") !== "goddard01arjava@gmail.com") {
                // updateValidationIcons(".childadmin-tick", ".childadmin-circle", true);
                adminFinalAgreement.classList.add("disabled");
            } else {
                // updateValidationIcons(".childadmin-tick", ".childadmin-circle", false);
                adminFinalAgreement.classList.remove("disabled");
            }
        }
    }

    // Overall admission form validation
    const allFormsAndSignatureComplete =
        childbasicInfo &&
        childparentInfo &&
        childEmergencyContact &&
        childMedicalcare &&
        childParentAgreementOne &&
        childHistory &&
        medicalHistory &&
        pregnancyHistory &&
        familyHistroy &&
        socialBehavior &&
        environmentalFactor &&
        parentAgreementTwo &&
        immunizationInstruction &&
        childProfile &&
        nutritionDetails &&
        restDetails &&
        medicalDetails &&
        parentAgreementThree &&
        pickupPassword &&
        photoVideoPermission &&
        securityPolicy &&
        medicaltransportationWeiver &&
        healthPolicy &&
        outsideWeiver &&
        socialMedia &&
        admissionparentsign;

    const admissionTick = document.querySelector(".admission-tick");
    const admissionCircle = document.querySelector(".admission-circle");

    if (admissionTick && admissionCircle) {
        updateValidationIcons(".admission-tick", ".admission-circle", allFormsAndSignatureComplete);
    }


    let enrollmentDetails;
    let enrollmentparent;
    if (
        response.point_one_field_three &&
        response.point_two_initial_here &&
        response.point_three_initial_here &&
        response.point_four_initial_here &&
        response.point_five_initial_here &&
        response.point_six_initial_here &&
        response.point_seven_initial_here &&
        response.point_eight_initial_here &&
        response.point_nine_initial_here &&
        response.point_ten_initial_here &&
        response.point_eleven_initial_here &&
        response.point_twelve_initial_here &&
        response.point_thirteen_initial_here &&
        response.point_fourteen_initial_here &&
        response.point_fifteen_initial_here &&
        response.point_sixteen_initial_here &&
        response.point_seventeen_initial_here &&
        response.point_eighteen_initial_here &&
        response.point_ninteen_initial_here &&
        response.preferred_start_date &&
        response.preferred_schedule
    ) {
        enrollmentDetails = true;
        updateValidationIcons(".childenrollmentagreement-tick", ".childenrollmentagreement-circle", true);
    } else {
        enrollmentDetails = false;
         updateValidationIcons(".childenrollmentagreement-tick", ".childenrollmentagreement-circle", true);
    }

     // Validate parent signature
     if (document.getElementById("childenrollmentagreementparentsign")) {
        if (
            response.parent_sign_enroll &&
            response.parent_sign_date_enroll
        ) {
            updateValidationIcons(".childenrollmentagreementparentsign-tick", ".childenrollmentagreementparentsign-circle", true);
            enrollmentparent = true;
        } else {
            updateValidationIcons(".childenrollmentagreementparentsign-tick", ".childenrollmentagreementparentsign-circle", false);
            enrollmentparent = false;
        }

        // Enable/disable parent final agreement button
        const allFormsCompleteEnroll = enrollmentDetails

        let parentFinalAgreement = document.getElementById("enrollmentFinalAgreement");
        if (parentFinalAgreement) {
            if (allFormsCompleteEnroll) {
                updateValidationIcons(".childenrollmentagreementparentsign-tick", ".childenrollmentagreementparentsign-circle", true);
                parentFinalAgreement.classList.remove("disabled");
            } else {
                updateValidationIcons(".childenrollmentagreementparentsign-tick", ".childenrollmentagreementparentsign-circle", false);
                parentFinalAgreement.classList.add("disabled");
            }
        }

        let enrollmentAdminFinalAgreement = document.getElementById("enrollmentAdminFinalAgreement");
        if (enrollmentAdminFinalAgreement) {
            if (localStorage.getItem("logged_in_email") !== "goddard01arjava@gmail.com") {
                // updateValidationIcons(".childenrollmentagreementadminsign-tick", ".childenrollmentagreementadminsign-circle", true);
                enrollmentAdminFinalAgreement.classList.add("disabled");
            } else {
                // updateValidationIcons(".childenrollmentagreementadminsign-tick", ".childenrollmentagreementadminsign-circle", false);
                enrollmentAdminFinalAgreement.classList.remove("disabled");
            }
        }
    }

    // Overall admission form validation
    const allFormsAndSignatureCompleteEnroll = enrollmentDetails && enrollmentparent
    const admissionTickEnroll = document.querySelector(".childenrollmentagreementadminsign-tick");
    const admissionCircleEnroll = document.querySelector(".childenrollmentagreementadminsign-circle");

    if (admissionTick && admissionCircle) {
        updateValidationIcons(".childenrollment-tick", ".childenrollment-circle", allFormsAndSignatureCompleteEnroll);
    }


    //authorization form
    let authorizationDetails;
    let achparentsign;
    if (
        response.bank_routing &&
        response.bank_account &&
        response.driver_license &&
        response.state &&
        response.i
    ) {
        authorizationDetails = true;
        updateValidationIcons(".authorizationach-tick", ".authorizationach-circle", true);
    } else {
        authorizationDetails = false;
         updateValidationIcons(".authorizationach-tick", ".authorizationach-circle", true);
    }

     // Validate parent signature
     if (document.getElementById("authorizationparentsign")) {
        if (
            response.parent_sign_date_ach &&
            response.parent_sign_date_ach
        ) {
            updateValidationIcons(".authorizationparentsign-tick", ".authorizationparentsign-circle", true);
            achparentsign = true;
        } else {
            updateValidationIcons(".authorizationparentsign-tick", ".authorizationparentsign-circle", false);
            achparentsign = false;
        }

        // Enable/disable parent final agreement button
        const allFormsCompleteAch = authorizationDetails

        let parentFinalAgreement = document.getElementById("achFinalAgreement");
        if (parentFinalAgreement) {
            if (allFormsCompleteAch) {
                updateValidationIcons(".authorizationparentsign-tick", ".authorizationparentsign-circle", true);
                parentFinalAgreement.classList.remove("disabled");
            } else {
                updateValidationIcons(".authorizationparentsign-tick", ".authorizationparentsign-circle", false);
                parentFinalAgreement.classList.add("disabled");
            }
        }

         let achAdminFinalAgreement = document.getElementById("achAdminFinalAgreement");
        if (achAdminFinalAgreement) {
            if (localStorage.getItem("logged_in_email") !== "goddard01arjava@gmail.com") {
                // updateValidationIcons(".authorizationadminsign-tick", ".authorizationadminsign-circle", true);
                achAdminFinalAgreement.classList.add("disabled");
            } else {
                // updateValidationIcons(".authorizationadminsign-tick", ".authorizationadminsign-circle", false);
                achAdminFinalAgreement.classList.remove("disabled");
            }
        }
    }

    // Overall admission form validation
    const allFormsAndSignatureCompleteAch = authorizationDetails && achparentsign
    const admissionTickAch = document.querySelector(".authorizationparentsign-tick");
    const admissionCircleAch = document.querySelector(".authorizationparentsign-circle");

    if (admissionTick && admissionCircle) {
        updateValidationIcons(".authorization-tick", ".authorization-circle", allFormsAndSignatureCompleteAch);
    }

    //authorization form
    let welcome_goddard_agreement;
    let parentHandBook;
    if (
        welcome_goddard_agreement == true &&
        mission_statement_agreement == true &&
        general_information_agreement == true &&
        medical_care_provider_agreement == true &&
        parent_access_agreement == true &&
        release_of_children_agreement == true &&
        registration_fees_agreement == true &&
        outside_engagements_agreement == true &&
        health_policies_agreement == true &&
        medication_procedures_agreement == true &&
        bring_to_school_agreement == true &&
        rest_time_agreement == true &&
        training_philosophy_agreement == true &&
        affiliation_policy_agreement == true &&
        security_issue_agreement == true &&
        expulsion_policy_agreement == true &&
        addressing_individual_child_agreement == true &&
        finalword_agreement == true
    ) {
        welcome_goddard_agreement = true;
        updateValidationIcons(".goddardschool1-tick", ".goddardschool1-circle", true);
    } else {
        welcome_goddard_agreement = false;
         updateValidationIcons(".goddardschool1-tick", ".goddardschool1-circle", true);
    }

     // Validate parent signature
     if (document.getElementById("parentsignaturehandbook")) {
        if (
            response.parent_sign_handbook &&
            response.parent_sign_date_handbook
        ) {
            updateValidationIcons(".childparenthandbook-tick", ".childparenthandbook-circle", true);
            achparentsign = true;
        } else {
            updateValidationIcons(".childparenthandbook-tick", ".childparenthandbook-circle", false);
            achparentsign = false;
        }

        // Enable/disable parent final agreement button
        const allFormsCompleteAch = welcome_goddard_agreement

        let parentFinalAgreement = document.getElementById("handbookFinalAgreement");
        if (parentFinalAgreement) {
            if (allFormsCompleteAch) {
                updateValidationIcons(".childparenthandbook-tick", ".childparenthandbook-circle", true);
                parentFinalAgreement.classList.remove("disabled");
            } else {
                updateValidationIcons(".childparenthandbook-tick", ".childparenthandbook-circle", false);
                parentFinalAgreement.classList.add("disabled");
            }
        }

         let handbookFinalAgreement = document.getElementById("handbookFinalAgreement");
        if (handbookFinalAgreement) {
            if (localStorage.getItem("logged_in_email") !== "goddard01arjava@gmail.com") {
                // updateValidationIcons(".goddardschool1-tick", ".goddardschool1-circle", true);
                handbookFinalAgreement.classList.add("disabled");
            } else {
                // updateValidationIcons(".goddardschool1-tick", ".goddardschool1-circle", false);
                handbookFinalAgreement.classList.remove("disabled");
            }
        }
    }

    // Overall admission form validation
    const allFormsAndSignatureCompleteHandbook = welcome_goddard_agreement && parentHandBook
    const admissionTickHandbook = document.querySelector(".childparenthandbook-tick");
    const admissionCircleHandbook = document.querySelector(".childparenthandbook-circle");

    if (admissionTick && admissionCircle) {
        updateValidationIcons(".handbook-tick", ".handbook-circle", allFormsAndSignatureCompleteHandbook);
    }

    
    
}

// Helper function to update validation icons
function updateValidationIcons(tickSelector, circleSelector, isValid) {
    const tickElement = document.querySelector(tickSelector);
    const circleElement = document.querySelector(circleSelector);

    if (tickElement && circleElement) {
        tickElement.style.display = "none";
        circleElement.style.display = "none";

        if (isValid) {
            tickElement.style.display = "block";
        } else {
            circleElement.style.display = "block";
        }
    }
}

// function checking(editID) {

//     $.ajax({
//         url: `https://zjnj2xrqwg.execute-api.ap-south-1.amazonaws.com/prod/admission_child_personal/incomplete_form_status/${editID}`,
//         type: "GET",
//         dataType: "json",
//         success: function (response) {
//             let mainTopics = Object.values(response["InCompletedFormStatus"]);

//             // Clear all menus and tab containers
//             $("#admissionFormMenu, #authorizationMenu, #enrollmentMenu, #parentHandbookMenu").empty();
//             $("#admissionforms, #authorization, #enrollmentagreement, #parenthandbook").empty();

//             const mainTopicMap = {
//                 admission_form: "admission_form",
//                 authorization: "authorization",
//                 enrollment_agreement: "enrollment_agreement",
//                 parent_handbook: "parent_handbook"
//             };

//             let loadCount = 0;
//             let expectedLoads = 0;

//             mainTopics.forEach(topic => {
//                 let trimValues = topic.replace(/\s+/g, "_").toLowerCase();

//                 if (mainTopicMap[trimValues]) {
//                     expectedLoads += 2;

//                     // Load menu list item
//                     $(`.menu.${trimValues}`).load(`${trimValues}_list_item.html`, function (response, status) {
//                         loadCount++;
//                         if (status !== "success") {
//                             console.error(`${trimValues}_list_item.html failed to load`);
//                         }
//                         checkAllLoaded();
//                     });

//                     // Load content tab
//                     $(`.tab-content.${trimValues}`).load(`${trimValues}.html`, function (response, status) {
//                         loadCount++;
//                         if (status !== "success") {
//                             console.error(`${trimValues}.html failed to load`);
//                         }
//                         checkAllLoaded();
//                     });
//                 }
//             });

//             function checkAllLoaded() {
//                 if (loadCount === expectedLoads) {
//                     renderAfterAllLoaded();
//                 }
//             }

//             function renderAfterAllLoaded() {
//                 console.log("✅ All tabs and list items loaded.");

//                 // Now safe to render tick mark
//                 $(".svg").append(
//                     '<svg width="12px" height="10px" viewbox="0 0 12 10"><polyline points="1.5 6 4.5 9 10.5 1"></polyline></svg>'
//                 );

//                 // Safe to call form logic
//                 const year = new Date().getFullYear();
//                 completedForm(editID, year);

//                 // Optional: Destroy existing DataTable if needed
//                 if ($.fn.DataTable.isDataTable("#example")) {
//                     $("#example").DataTable().destroy();
//                 }
//             }
//         },
//         error: function (xhr, status, error) {
//             console.error("AJAX Error:", status, error);
//         }
//     });

//     // Set child name
//     const childName = localStorage.getItem("child_name");
//     document.getElementById("childName").innerHTML = childName || "";

//     // Completed forms link
//     const completedFormsLink = document.querySelector(".completedforms");
//     if (completedFormsLink) {
//         completedFormsLink.addEventListener("click", function (event) {
//             event.preventDefault();
//             // parentDashBoardDetails(editID, new Date().getFullYear());
//         });
//     }

//     // Prevent DataTable errors from popping up
//     $.fn.dataTable.ext.errMode = "none";

//     const year = new Date().getFullYear();
//     completedForm(editID, year);
//     //destroy datatable
//     $("#example").DataTable().destroy();

//     if (editID != "") {
//         //for waking up the aws lambda server
//         $.ajax({
//             url: `https://zjnj2xrqwg.execute-api.ap-south-1.amazonaws.com/prod/child_all_form_details/fetch/${editID}`,
//             type: "GET",
//             //this is used to get the response and return the result
//             success: function (response) {
//                 let tabPointer = response.pointer; // Assume this value comes from the API
//                 // console.log(tabPointer);
//                 if (typeof tabPointer !== "undefined") {
//                     // Example of tab structure: If the tabs have IDs or classes like 'tab1', 'tab2', 'tab3'
//                     activateTab(tabPointer);
//                 }
//                 console.log(response);
//                 let childbasicInfo = false;
//                 let childparentInfo= false;
//                 let additionalChildparentInfo= false;
//                 let childEmergencyContact= false;
//                 let childMedicalcare= false;
//                 let childParentAgreementOne= false;
//                 let statuscall= false;
//                 if (document.getElementById("childinformation") !== null) {
//                     //child information details
//                     if (typeof response.child_first_name !== "undefined")
//                         document.getElementsByClassName("child_first_name")[0].value =
//                             response.child_first_name;

//                     // add cname in entrollment form
//                     // document.getElementsByClassName("enrollment_child_name")[0].value = response.child_first_name;

//                     if (typeof response.child_last_name !== "undefined")
//                         document.getElementsByClassName("child_last_name")[0].value =
//                             response.child_last_name;

//                     if (
//                         typeof response.nick_name !== "undefined" &&
//                         typeof response.nick_name !== null
//                     ) {
//                         document.getElementsByName("nick_name")[0].value =
//                             response.nick_name;
//                     }
//                     if (typeof response.dob !== "undefined")
//                         document.getElementsByClassName("dob")[0].value = response.dob;

//                     // add dob in entrollment form
//                     // document.getElementsByClassName("enrollment_child_dob")[0].value = response.dob;

//                     if (typeof response.primary_language !== "undefined")
//                         document.getElementsByName("primary_language")[0].value =
//                             response.primary_language;
//                     if (typeof response.school_age_child_school !== "undefined")
//                         document.getElementsByName("school_age_child_school")[0].value =
//                             response.school_age_child_school;
//                     if (response.do_relevant_custody_papers_apply === 1) {
//                         document.getElementById(
//                             "do_relevant_custody_papers_apply1"
//                         ).checked = true;
//                     } else if(response.do_relevant_custody_papers_apply === 2) {
//                         document.getElementById(
//                             "do_relevant_custody_papers_apply2"
//                         ).checked = true;
//                     }
//                     if (response.gender == 1) {
//                         document.getElementById("gender1").checked = true;
//                     } else if (response.gender == 2) {
//                         document.getElementById("gender2").checked = true;
//                     } else if (response.gender == 3) {
//                         document.getElementById("gender3").checked = true;
//                     }

//                     if (
//                         response.child_first_name &&
//                         response.child_last_name &&
//                         response.nick_name &&
//                         response.dob &&
//                         response.primary_language &&
//                         response.school_age_child_school &&
//                         response.gender
//                     ) {
//                         // Reset the display for both images
//                         document.querySelector(".childdetails-tick").style.display = "none";
//                         document.querySelector(".childdetails-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".childdetails-tick").style.display =
//                             "block";
//                         childbasicInfo = true;
//                     } else {
//                         // Reset the display for both images
//                         document.querySelector(".childdetails-tick").style.display = "none";
//                         document.querySelector(".childdetails-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".childdetails-circle").style.display =
//                             "block";
//                         childbasicInfo = false;
//                     }

//                     if (response.primary_parent_info) {
//                         document.getElementsByName("parent_name")[0].value =
//                             response.primary_parent_info.parent_name;
//                         document.getElementsByName("parent_street_address")[0].value =
//                             response.primary_parent_info.parent_street_address;

//                         // add address in entrollment form
//                         // document.getElementsByName("preferred_home_addr")[0].value =
//                         //     response.primary_parent_info.parent_street_address + "," + response.primary_parent_info.parent_city_address + "," + response.primary_parent_info.parent_zip_address;

//                         document.getElementsByName("parent_city_address")[0].value =
//                             response.primary_parent_info.parent_city_address;
//                         document.getElementsByName("parent_state_address")[0].value =
//                             response.primary_parent_info.parent_state_address;
//                         document.getElementsByName("parent_zip_address")[0].value =
//                             response.primary_parent_info.parent_zip_address;
//                         document.getElementsByName("home_telephone_number")[0].value =
//                             response.primary_parent_info.parent_home_telephone_number;
//                         document.getElementsByName("business_name")[0].value =
//                             response.primary_parent_info.parent_business_name;
//                         document.getElementsByName("work_hours_from")[0].value =
//                             response.primary_parent_info.parent_work_hours_from;
//                         document.getElementsByName("work_hours_to")[0].value =
//                             response.primary_parent_info.parent_work_hours_to;
//                         document.getElementsByName("business_telephone_number")[0].value =
//                             response.primary_parent_info.parent_business_telephone_number;
//                         document.getElementsByName("business_cell_number")[0].value =
//                             response.primary_parent_info.parent_business_cell_number;
//                         document.getElementsByName("parent_email")[0].value =
//                             response.primary_parent_info.parent_email;
//                         // add email in entrollment form
//                         // document.getElementsByName("preferred_email")[0].value =
//                         //     response.primary_parent_info.parent_email;

//                     }

//                     if (
//                         response.primary_parent_info.parent_name &&
//                         response.primary_parent_info.parent_street_address &&
//                         response.primary_parent_info.parent_city_address &&
//                         response.primary_parent_info.parent_state_address &&
//                         response.primary_parent_info.parent_zip_address &&
//                         response.primary_parent_info.parent_home_telephone_number &&
//                         response.primary_parent_info.parent_business_name &&
//                         response.primary_parent_info.parent_work_hours_from &&
//                         response.primary_parent_info.parent_work_hours_to &&
//                         response.primary_parent_info.parent_business_telephone_number &&
//                         response.primary_parent_info.parent_business_cell_number &&
//                         response.primary_parent_info.parent_email
//                     ) {
//                         // Reset the display for both images
//                         document.querySelector(".parentdetails-tick").style.display =
//                             "none";
//                         document.querySelector(".parentdetails-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".parentdetails-tick").style.display =
//                             "block";
//                         childparentInfo = true;
//                     } else {
//                         // Reset the display for both images
//                         document.querySelector(".parentdetails-tick").style.display =
//                             "none";
//                         document.querySelector(".parentdetails-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".parentdetails-circle").style.display =
//                             "block";
//                         childparentInfo = false;
//                     }

//                     if (response.additional_parent_info) {
//                         document.getElementsByName("parent_two_name")[0].value =
//                             response.additional_parent_info.parent_name;
//                         document.getElementsByName("parent_two_street_address")[0].value =
//                             response.additional_parent_info.parent_street_address;
//                         document.getElementsByName("parent_two_city_address")[0].value =
//                             response.additional_parent_info.parent_city_address;
//                         document.getElementsByName("parent_two_state_address")[0].value =
//                             response.additional_parent_info.parent_state_address;
//                         document.getElementsByName("parent_two_zip_address")[0].value =
//                             response.additional_parent_info.parent_zip_address;
//                         document.getElementsByName(
//                             "parent_two_home_telephone_number"
//                         )[0].value =
//                             response.additional_parent_info.parent_home_telephone_number;
//                         document.getElementsByName("parent_two_business_name")[0].value =
//                             response.additional_parent_info.parent_business_name;
//                         document.getElementsByName("parent_two_work_hours_from")[0].value =
//                             response.additional_parent_info.parent_work_hours_from;
//                         document.getElementsByName("parent_two_work_hours_to")[0].value =
//                             response.additional_parent_info.parent_work_hours_to;
//                         document.getElementsByName(
//                             "parent_two_business_telephone_number"
//                         )[0].value =
//                             response.additional_parent_info.parent_business_telephone_number;
//                         document.getElementsByName(
//                             "parent_two_business_cell_number"
//                         )[0].value =
//                             response.primary_parent_info.parent_business_cell_number;
//                         document.getElementsByName("parent_two_email")[0].value =
//                             response.additional_parent_info.parent_email;
//                     }

//                     if (
//                         response.additional_parent_info.parent_name &&
//                         response.additional_parent_info.parent_street_address &&
//                         response.additional_parent_info.parent_city_address &&
//                         response.additional_parent_info.parent_state_address &&
//                         response.additional_parent_info.parent_zip_address &&
//                         response.additional_parent_info.parent_home_telephone_number &&
//                         response.additional_parent_info.parent_business_name &&
//                         response.additional_parent_info.parent_work_hours_from &&
//                         response.additional_parent_info.parent_work_hours_to &&
//                         response.additional_parent_info.parent_business_telephone_number &&
//                         response.additional_parent_info.parent_business_cell_number &&
//                         response.additional_parent_info.parent_email
//                     ) {
//                         document.querySelector(".parent_twodetails-tick").style.display =
//                             "block";
//                         additionalChildparentInfo = true;
//                     } else {
//                         document.querySelector(".parent_twodetails-circle").style.display =
//                             "block";
//                         additionalChildparentInfo = false;
//                     }

//                     if (response.emergency_contact_info) {
//                         let allContactsValid = true;
//                         response.emergency_contact_info.forEach((contact, index) => {
//                             let isValidContact = true;
//                             if (
//                                 document.getElementById(`child_emergency_contact_name${index}`)
//                             ) {
//                                 document.getElementById(
//                                     `child_emergency_contact_name${index}`
//                                 ).value = contact.child_emergency_contact_name || "";
//                                 document.getElementById(
//                                     `child_emergency_contact_relationship${index}`
//                                 ).value = contact.child_emergency_contact_relationship || "";
//                                 document.getElementById(
//                                     `child_emergency_contact_telephone_number${index}`
//                                 ).value =
//                                     contact.child_emergency_contact_telephone_number || "";
//                                 document.getElementById(
//                                     `child_emergency_contact_full_address${index}`
//                                 ).value = contact.child_emergency_contact_full_address || "";
//                                 document.getElementById(
//                                     `child_emergency_contact_city_address${index}`
//                                 ).value = contact.child_emergency_contact_city_address || "";
//                                 document.getElementById(
//                                     `child_emergency_contact_state_address${index}`
//                                 ).value = contact.child_emergency_contact_state_address || "";
//                                 document.getElementById(
//                                     `child_emergency_contact_zip_address${index}`
//                                 ).value = contact.child_emergency_contact_zip_address || "";
//                                 if (
//                                     !contact.child_emergency_contact_name ||
//                                     !contact.child_emergency_contact_relationship ||
//                                     !contact.child_emergency_contact_telephone_number ||
//                                     !contact.child_emergency_contact_full_address ||
//                                     !contact.child_emergency_contact_city_address ||
//                                     !contact.child_emergency_contact_state_address ||
//                                     !contact.child_emergency_contact_zip_address
//                                 ) {
//                                     isValidContact = false;
//                                     allContactsValid = false; // If any contact is invalid, set the overall flag to false
//                                 }
//                             }
//                         });
//                         if (allContactsValid) {
//                             // Reset the display for both images
//                             document.querySelector(".emergencycontact-tick").style.display =
//                                 "none";
//                             document.querySelector(".emergencycontact-circle").style.display =
//                                 "none";
//                             // Update the display for the clicked card
//                             document.querySelector(".emergencycontact-tick").style.display =
//                                 "block";
//                             childEmergencyContact = true;
//                         } else {
//                             // Reset the display for both images
//                             document.querySelector(".emergencycontact-tick").style.display =
//                                 "none";
//                             document.querySelector(".emergencycontact-circle").style.display =
//                                 "none";
//                             // Update the display for the clicked card
//                             document.querySelector(".emergencycontact-circle").style.display =
//                                 "block";
//                             childEmergencyContact = false;
//                         }
//                     }

//                     if (response.child_care_provider_info) {
//                         document.getElementById("child_care_provider_name").value =
//                             response.child_care_provider_info.child_care_provider_name || "";
//                         document.getElementById(
//                             "child_care_provider_telephone_number"
//                         ).value =
//                             response.child_care_provider_info
//                                 .child_care_provider_telephone_number || "";
//                         document.getElementById("child_hospital_affiliation").value =
//                             response.child_care_provider_info.child_hospital_affiliation ||
//                             "";
//                         document.getElementById(
//                             "child_care_provider_street_address"
//                         ).value =
//                             response.child_care_provider_info
//                                 .child_care_provider_street_address || "";
//                         document.getElementById("child_care_provider_city_address").value =
//                             response.child_care_provider_info
//                                 .child_care_provider_city_address || "";
//                         document.getElementById("child_care_provider_state_address").value =
//                             response.child_care_provider_info
//                                 .child_care_provider_state_address || "";
//                         document.getElementById("child_care_provider_zip_address").value =
//                             response.child_care_provider_info
//                                 .child_care_provider_zip_address || "";
//                     }
//                     // if (response.child_dentist_info) {
//                     //     document.getElementById('child_dentist_name').value = response.child_dentist_info.child_dentist_name || '';
//                     //     document.getElementById('dentist_telephone_number').value = response.child_dentist_info.dentist_telephone_number || '';
//                     //     document.getElementById('dentist_street_address').value = response.child_dentist_info.dentist_street_address || '';
//                     //     document.getElementById('dentist_city_address').value = response.child_dentist_info.dentist_city_address || '';
//                     //     document.getElementById('dentist_state_address').value = response.child_dentist_info.dentist_state_address || '';
//                     //     document.getElementById('dentist_zip_address').value = response.child_dentist_info.dentist_zip_address || '';

//                     // }

//                     if (response.child_dentist_info) {
//                         let dentistId = response.child_dentist_info.child_dentist_id;
//                         let dentistName =
//                             response.child_dentist_info.child_dentist_name || "";
//                         let dentistPhone =
//                             response.child_dentist_info.dentist_telephone_number || "";
//                         let dentistStreet =
//                             response.child_dentist_info.dentist_street_address || "";
//                         let dentistCity =
//                             response.child_dentist_info.dentist_city_address || "";
//                         let dentistState =
//                             response.child_dentist_info.dentist_state_address || "";
//                         let dentistZip =
//                             response.child_dentist_info.dentist_zip_address || "";

//                         let dropdownButton = document.getElementById("dropdownMenuButton");
//                         dropdownButton.textContent = dentistName;

//                         // Find the dropdown item with the matching dentist ID and select it
//                         let dropdownItems = document.querySelectorAll(
//                             "#dropdown-menu .dropdown-item"
//                         );
//                         let found = false;

//                         dropdownItems.forEach((item) => {
//                             let itemId = $(item).data("value");
//                             if (itemId === dentistId) {
//                                 // If the current dropdown item matches the dentist ID, select it
//                                 dropdownButton.textContent = item.textContent;
//                                 found = true;
//                             }
//                         });

//                         if (!found) {
//                             dropdownButton.textContent = "Others";
//                             $("#dropdown-menu").append(`
//                                 <input type="text" id="customDentistName" class="form-control mt-2" placeholder="Enter dentist name..." value="${dentistName}">
//                             `);
//                             $("#dentist_telephone_number")
//                                 .prop("disabled", false)
//                                 .val(
//                                     response.child_dentist_info.dentist_telephone_number || ""
//                                 );
//                             $("#dentist_street_address")
//                                 .prop("disabled", false)
//                                 .val(response.child_dentist_info.dentist_street_address || "");
//                             $("#dentist_city_address")
//                                 .prop("disabled", false)
//                                 .val(response.child_dentist_info.dentist_city_address || "");
//                             $("#dentist_state_address")
//                                 .prop("disabled", false)
//                                 .val(response.child_dentist_info.dentist_state_address || "");
//                             $("#dentist_zip_address")
//                                 .prop("disabled", false)
//                                 .val(response.child_dentist_info.dentist_zip_address || "");
//                             $("#child_dentist_name").removeClass("d-none").val(dentistName);
//                         } else {
//                             $("#dentist_telephone_number").prop("disabled", true);
//                             $("#dentist_street_address").prop("disabled", true);
//                             $("#dentist_city_address").prop("disabled", true);
//                             $("#dentist_state_address").prop("disabled", true);
//                             $("#dentist_zip_address").prop("disabled", true);
//                             $("#child_dentist_name").addClass("d-none");
//                         }
//                     }

//                     if (typeof response.special_diabilities !== "undefined")
//                         document.getElementsByName("special_diabilities")[0].value =
//                             response.special_diabilities;
//                     if (typeof response.allergies_medication_reaction !== "undefined")
//                         document.getElementsByName(
//                             "allergies_medication_reaction"
//                         )[0].value = response.allergies_medication_reaction;
//                     if (typeof response.additional_info !== "undefined")
//                         document.getElementsByName("additional_info")[0].value =
//                             response.additional_info;
//                     if (typeof response.medication !== "undefined")
//                         document.getElementsByName("medication")[0].value =
//                             response.medication;
//                     if (typeof response.health_insurance !== "undefined")
//                         document.getElementsByName("health_insurance")[0].value =
//                             response.health_insurance;
//                     if (typeof response.policy_number !== "undefined")
//                         document.getElementsByName("policy_number")[0].value =
//                             response.policy_number;

//                     if (
//                         response.child_care_provider_info.child_care_provider_name &&
//                         response.child_care_provider_info
//                             .child_care_provider_telephone_number &&
//                         response.child_care_provider_info.child_hospital_affiliation &&
//                         response.child_care_provider_info
//                             .child_care_provider_street_address &&
//                         response.child_care_provider_info
//                             .child_care_provider_city_address &&
//                         response.child_care_provider_info
//                             .child_care_provider_state_address &&
//                         response.child_care_provider_info.child_care_provider_zip_address &&
//                         response.child_dentist_info.child_dentist_name &&
//                         response.child_dentist_info.dentist_telephone_number &&
//                         response.child_dentist_info.dentist_street_address &&
//                         response.child_dentist_info.dentist_city_address &&
//                         response.child_dentist_info.dentist_state_address &&
//                         response.child_dentist_info.dentist_zip_address &&
//                         response.special_diabilities &&
//                         response.allergies_medication_reaction &&
//                         response.additional_info &&
//                         response.medication &&
//                         response.health_insurance &&
//                         response.policy_number
//                     ) {
//                         // Reset the display for both images
//                         document.querySelector(".medicalcare-tick").style.display = "none";
//                         document.querySelector(".medicalcare-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".medicalcare-tick").style.display = "block";
//                         childMedicalcare = true;
//                     } else {
//                         // Reset the display for both images
//                         document.querySelector(".medicalcare-tick").style.display = "none";
//                         document.querySelector(".medicalcare-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".medicalcare-circle").style.display =
//                             "block";
//                         childMedicalcare = false;
//                     }

//                     // parent agreement one information
//                     if (typeof response.obtaining_emergency_medical_care !== "undefined")
//                         document.getElementsByName(
//                             "obtaining_emergency_medical_care"
//                         )[0].value = response.obtaining_emergency_medical_care;
//                     if (
//                         typeof response.administration_first_aid_procedures !== "undefined"
//                     )
//                         document.getElementsByName(
//                             "administration_first_aid_procedures"
//                         )[0].value = response.administration_first_aid_procedures;
//                     if (response.agree_all_above_information_is_correct == "on") {
//                         document.getElementById(
//                             "agree_all_above_information_is_correct"
//                         ).checked = true;
//                     } else {
//                         document.getElementById(
//                             "agree_all_above_information_is_correct"
//                         ).checked = false;
//                     }
//                     if (
//                         response.obtaining_emergency_medical_care &&
//                         response.administration_first_aid_procedures &&
//                         response.agree_all_above_information_is_correct
//                     ) {
//                         // Reset the display for both images
//                         document.querySelector(".parentagreement-tick").style.display =
//                             "none";
//                         document.querySelector(".parentagreement-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".parentagreement-tick").style.display =
//                             "block";
//                         childParentAgreementOne = true;
//                     } else {
//                         // Reset the display for both images
//                         document.querySelector(".parentagreement-tick").style.display =
//                             "none";
//                         document.querySelector(".parentagreement-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".parentagreement-circle").style.display =
//                             "block";
//                         childParentAgreementOne = false;
//                     }

//                     if (
//                         childbasicInfo == true &&
//                         childparentInfo == true &&
//                         additionalChildparentInfo == true &&
//                         childMedicalcare == true &&
//                         childEmergencyContact == true &&
//                         childParentAgreementOne == true
//                     ) {
//                         // Reset the display for both images
//                         document.querySelector(".childinfo-tick").style.display = "none";
//                         document.querySelector(".childinfo-circle").style.display = "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".childinfo-tick").style.display = "block";
//                         statuscall = true;
//                     } else {
//                         // Reset the display for both images
//                         document.querySelector(".childinfo-tick").style.display = "none";
//                         document.querySelector(".childinfo-circle").style.display = "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".childinfo-circle").style.display = "block";
//                         statuscall = false;
//                     }
//                 }

//                 var inputs = document.querySelectorAll("#childinformation input");

//                 inputs.forEach(function (input) {
//                     if (input.type === "checkbox" || input.type === "radio") {
//                         if (input.checked) {
//                             input.classList.remove("input-success");
//                             input.classList.remove("input-error");
//                         } 
//                     } else {
//                         if (input.value.trim() === "") {
//                             input.classList.add("input-error"); // Highlight empty input
//                             input.classList.remove("input-success");
//                         } else {
//                             input.classList.add("input-success");
//                             input.classList.remove("input-error");
//                         }
//                     }
//                 });

//                 // child family and history
//                 let childHistory= false;
//                 let medicalHistory= false;
//                 let pregnancyHistory= false;
//                 let familyHistroy= false;
//                 let socialBehavior= false;
//                 let environmentalFactor= false;
//                 let parentAgreementTwo= false;
//                 if (document.getElementById("childandfamilyhistory") != null) {
//                     if (typeof response.physical_exam_last_date !== "undefined")
//                         document.getElementsByName("physical_exam_last_date")[0].value =
//                             response.physical_exam_last_date;
//                     if (typeof response.dental_exam_last_date !== "undefined")
//                         document.getElementsByName("dental_exam_last_date")[0].value =
//                             response.dental_exam_last_date;
//                     if (
//                         response.physical_exam_last_date &&
//                         response.dental_exam_last_date
//                     ) {
//                         // Reset the display for both images
//                         document.querySelector(".childhistoryDetails-tick").style.display =
//                             "none";
//                         document.querySelector(
//                             ".childhistoryDetails-circle"
//                         ).style.display = "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".childhistoryDetails-tick").style.display =
//                             "block";
//                         childHistory = true;
//                     } else {
//                         // Reset the display for both images
//                         document.querySelector(".childhistoryDetails-tick").style.display =
//                             "none";
//                         document.querySelector(
//                             ".childhistoryDetails-circle"
//                         ).style.display = "none";
//                         // Update the display for the clicked card
//                         document.querySelector(
//                             ".childhistoryDetails-circle"
//                         ).style.display = "block";
//                         childHistory = false;
//                     }

//                     if (typeof response.allergies !== "undefined")
//                         document.getElementsByName("allergies")[0].value =
//                             response.allergies;
//                     if (typeof response.asthma !== "undefined")
//                         document.getElementsByName("asthma")[0].value = response.asthma;
//                     if (typeof response.bleeding_problems !== "undefined")
//                         document.getElementsByName("bleeding_problems")[0].value =
//                             response.bleeding_problems;
//                     if (typeof response.diabetes !== "undefined")
//                         document.getElementsByName("diabetes")[0].value = response.diabetes;
//                     if (typeof response.epilepsy !== "undefined")
//                         document.getElementsByName("epilepsy")[0].value = response.epilepsy;
//                     if (typeof response.frequent_ear_infections !== "undefined")
//                         document.getElementsByName("frequent_ear_infections")[0].value =
//                             response.frequent_ear_infections;
//                     if (typeof response.frequent_illnesses !== "undefined")
//                         document.getElementsByName("frequent_illnesses")[0].value =
//                             response.frequent_illnesses;
//                     if (typeof response.hearing_problems !== "undefined")
//                         document.getElementsByName("hearing_problems")[0].value =
//                             response.hearing_problems;
//                     if (typeof response.high_fevers !== "undefined")
//                         document.getElementsByName("high_fevers")[0].value =
//                             response.high_fevers;
//                     if (typeof response.hospitalization !== "undefined")
//                         document.getElementsByName("hospitalization")[0].value =
//                             response.hospitalization;
//                     if (typeof response.rheumatic_fever !== "undefined")
//                         document.getElementsByName("rheumatic_fever")[0].value =
//                             response.rheumatic_fever;
//                     if (typeof response.seizures_convulsions !== "undefined")
//                         document.getElementsByName("seizures_convulsions")[0].value =
//                             response.seizures_convulsions;
//                     if (typeof response.serious_injuries_accidents !== "undefined")
//                         document.getElementsByName("serious_injuries_accidents")[0].value =
//                             response.serious_injuries_accidents;
//                     if (typeof response.surgeries !== "undefined")
//                         document.getElementsByName("surgeries")[0].value =
//                             response.surgeries;
//                     if (typeof response.vision_problems !== "undefined")
//                         document.getElementsByName("vision_problems")[0].value =
//                             response.vision_problems;
//                     if (typeof response.medical_other !== "undefined")
//                         document.getElementsByName("medical_other")[0].value =
//                             response.medical_other;

//                     if (
//                         response.allergies &&
//                         response.asthma &&
//                         response.bleeding_problems &&
//                         response.diabetes &&
//                         response.epilepsy &&
//                         response.frequent_ear_infections &&
//                         response.hearing_problems &&
//                         response.hospitalization &&
//                         response.rheumatic_fever &&
//                         response.seizures_convulsions &&
//                         response.serious_injuries_accidents &&
//                         response.surgeries &&
//                         response.vision_problems &&
//                         response.medical_other
//                     ) {
//                         // Reset the display for both images
//                         document.querySelector(".medicalhistory-tick").style.display =
//                             "none";
//                         document.querySelector(".medicalhistory-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".medicalhistory-tick").style.display =
//                             "block";
//                         medicalHistory = true;
//                     } else {
//                         // Reset the display for both images
//                         document.querySelector(".medicalhistory-tick").style.display =
//                             "none";
//                         document.querySelector(".medicalhistory-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".medicalhistory-circle").style.display =
//                             "block";
//                         medicalHistory = false;
//                     }

//                     if (typeof response.illness_during_pregnancy !== "undefined")
//                         document.getElementsByName("illness_during_pregnancy")[0].value =
//                             response.illness_during_pregnancy;
//                     if (typeof response.condition_of_newborn !== "undefined")
//                         document.getElementsByName("condition_of_newborn")[0].value =
//                             response.condition_of_newborn;
//                     if (typeof response.duration_of_pregnancy !== "undefined")
//                         document.getElementsByName("duration_of_pregnancy")[0].value =
//                             response.duration_of_pregnancy;
//                     if (typeof response.birth_weight_lbs !== "undefined")
//                         document.getElementsByName("birth_weight_lbs")[0].value =
//                             response.birth_weight_lbs;
//                     if (typeof response.birth_weight_oz !== "undefined")
//                         document.getElementsByName("birth_weight_oz")[0].value =
//                             response.birth_weight_oz;
//                     if (typeof response.complications !== "undefined")
//                         document.getElementsByName("complications")[0].value =
//                             response.complications;

//                     // console.log(response.breast_fed);
//                     // console.log(response.bottle_fed);
//                     if (response.bottle_fed === 1) {
//                         document.getElementById("bottle_fed1").checked = true;
//                     } else if (response.bottle_fed === 2) {
//                         document.getElementById("bottle_fed2").checked = true;
//                     }
//                     if (response.breast_fed === 1) {
//                         document.getElementById("breast_fed1").checked = true;
//                     } else if (response.breast_fed === 2) {
//                         document.getElementById("breast_fed2").checked = true;
//                     }

//                     if (typeof response.other_siblings_name !== "undefined")
//                         document.getElementsByName("other_siblings_name")[0].value =
//                             response.other_siblings_name;
//                     if (typeof response.other_siblings_age !== "undefined")
//                         document.getElementsByName("other_siblings_age")[0].value =
//                             response.other_siblings_age;

//                     if (
//                         response.illness_during_pregnancy &&
//                         response.condition_of_newborn &&
//                         response.duration_of_pregnancy &&
//                         response.birth_weight_lbs &&
//                         response.birth_weight_oz &&
//                         response.complications &&
//                         response.bottle_fed &&
//                         response.breast_fed &&
//                         response.other_siblings_name &&
//                         response.other_siblings_age
//                     ) {
//                         // Reset the display for both images
//                         document.querySelector(".pregnancyhistory-tick").style.display =
//                             "none";
//                         document.querySelector(".pregnancyhistory-circle").style.display =
//                             "none";
//                         // Update the display for the tick
//                         document.querySelector(".pregnancyhistory-tick").style.display =
//                             "block";
//                         pregnancyHistory = true;
//                     } else {
//                         // Reset the display for both images
//                         document.querySelector(".pregnancyhistory-tick").style.display =
//                             "none";
//                         document.querySelector(".pregnancyhistory-circle").style.display =
//                             "none";
//                         // Update the display for the circle
//                         document.querySelector(".pregnancyhistory-circle").style.display =
//                             "block";
//                         pregnancyHistory = false;
//                     }

//                     if (response.family_history_allergies == "on") {
//                         document.getElementById("family_history_allergies").checked = true;
//                     } else {
//                         document.getElementById("family_history_allergies").checked = false;
//                     }
//                     if (response.family_history_heart_problems == "on") {
//                         document.getElementById(
//                             "family_history_heart_problems"
//                         ).checked = true;
//                     } else {
//                         document.getElementById(
//                             "family_history_heart_problems"
//                         ).checked = false;
//                     }
//                     if (response.family_history_tuberculosis == "on") {
//                         document.getElementById(
//                             "family_history_tuberculosis"
//                         ).checked = true;
//                     } else {
//                         document.getElementById(
//                             "family_history_tuberculosis"
//                         ).checked = false;
//                     }
//                     if (response.family_history_asthma == "on") {
//                         document.getElementById("family_history_asthma").checked = true;
//                     } else {
//                         document.getElementById("family_history_asthma").checked = false;
//                     }
//                     if (response.family_history_high_blood_pressure == "on") {
//                         document.getElementById(
//                             "family_history_high_blood_pressure"
//                         ).checked = true;
//                     } else {
//                         document.getElementById(
//                             "family_history_high_blood_pressure"
//                         ).checked = false;
//                     }
//                     if (response.family_history_vision_problems == "on") {
//                         document.getElementById(
//                             "family_history_vision_problems"
//                         ).checked = true;
//                     } else {
//                         document.getElementById(
//                             "family_history_vision_problems"
//                         ).checked = false;
//                     }
//                     if (response.family_history_diabetes == "on") {
//                         document.getElementById("family_history_diabetes").checked = true;
//                     } else {
//                         document.getElementById("family_history_diabetes").checked = false;
//                     }
//                     if (response.family_history_hyperactivity == "on") {
//                         document.getElementById(
//                             "family_history_hyperactivity"
//                         ).checked = true;
//                     } else {
//                         document.getElementById(
//                             "family_history_hyperactivity"
//                         ).checked = false;
//                     }
//                     if (response.family_history_epilepsy == "on") {
//                         document.getElementById("family_history_epilepsy").checked = true;
//                     } else {
//                         document.getElementById("family_history_epilepsy").checked = false;
//                     }
//                     if (response.no_illnesses_for_this_child == "on") {
//                         document.getElementById(
//                             "no_illnesses_for_this_child"
//                         ).checked = true;
//                     } else {
//                         document.getElementById(
//                             "no_illnesses_for_this_child"
//                         ).checked = false;
//                     }

//                     // if (
//                     //     response.family_history_allergies == "on" ||
//                     //     response.family_history_heart_problems == "on" ||
//                     //     response.family_history_tuberculosis == "on" ||
//                     //     response.family_history_asthma == "on" ||
//                     //     response.family_history_high_blood_pressure == "on" ||
//                     //     response.family_history_vision_problems == "on" ||
//                     //     response.family_history_diabetes == "on" ||
//                     //     response.family_history_hyperactivity == "on" ||
//                     //     response.family_history_epilepsy == "on"
//                     // ) {
//                     //     document.getElementById(
//                     //         "no_illnesses_for_this_child"
//                     //     ).checked = false;
//                     // } else {
//                     //     document.getElementById(
//                     //         "no_illnesses_for_this_child"
//                     //     ).checked = true;
//                     // }

//                     if (
//                         response.family_history_allergies ||
//                         response.family_history_heart_problems ||
//                         response.family_history_tuberculosis ||
//                         response.family_history_asthma ||
//                         response.family_history_high_blood_pressure ||
//                         response.family_history_vision_problems ||
//                         response.family_history_diabetes ||
//                         response.family_history_hyperactivity ||
//                         response.family_history_epilepsy ||
//                         response.no_illnesses_for_this_child
//                     ) {
//                         // Reset the display for both images
//                         document.querySelector(".familyhistory-tick").style.display =
//                             "none";
//                         document.querySelector(".familyhistory-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".familyhistory-tick").style.display =
//                             "block";
//                         familyHistroy = true;
//                     } else {
//                         // Reset the display for both images
//                         document.querySelector(".familyhistory-tick").style.display =
//                             "none";
//                         document.querySelector(".familyhistory-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".familyhistory-circle").style.display =
//                             "block";
//                         familyHistroy = false;
//                     }

//                     if (typeof response.age_group_friends !== "undefined")
//                         document.getElementsByName("age_group_friends")[0].value =
//                             response.age_group_friends;
//                     if (typeof response.neighborhood_friends !== "undefined")
//                         document.getElementsByName("neighborhood_friends")[0].value =
//                             response.neighborhood_friends;
//                     if (typeof response.relationship_with_mother !== "undefined")
//                         document.getElementsByName("relationship_with_mother")[0].value =
//                             response.relationship_with_mother;
//                     if (typeof response.relationship_with_father !== "undefined")
//                         document.getElementsByName("relationship_with_father")[0].value =
//                             response.relationship_with_father;
//                     if (typeof response.relationship_with_siblings !== "undefined")
//                         document.getElementsByName("relationship_with_siblings")[0].value =
//                             response.relationship_with_siblings;
//                     if (typeof response.relationship_with_extended_family !== "undefined")
//                         document.getElementsByName(
//                             "relationship_with_extended_family"
//                         )[0].value = response.relationship_with_extended_family;
//                     if (typeof response.fears_conflicts !== "undefined")
//                         document.getElementsByName("fears_conflicts")[0].value =
//                             response.fears_conflicts;
//                     if (typeof response.child_response_frustration !== "undefined")
//                         document.getElementsByName("child_response_frustration")[0].value =
//                             response.child_response_frustration;
//                     if (typeof response.favorite_activities !== "undefined")
//                         document.getElementsByName("favorite_activities")[0].value =
//                             response.favorite_activities;

//                     if (
//                         response.age_group_friends &&
//                         response.neighborhood_friends &&
//                         response.relationship_with_mother &&
//                         response.relationship_with_father &&
//                         response.relationship_with_siblings &&
//                         response.relationship_with_extended_family &&
//                         response.fears_conflicts &&
//                         response.child_response_frustration &&
//                         response.favorite_activities
//                     ) {
//                         // Reset the display for both images
//                         document.querySelector(".socialbehavior-tick").style.display =
//                             "none";
//                         document.querySelector(".socialbehavior-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".socialbehavior-tick").style.display =
//                             "block";
//                         socialBehavior = true;
//                     } else {
//                         // Reset the display for both images
//                         document.querySelector(".socialbehavior-tick").style.display =
//                             "none";
//                         document.querySelector(".socialbehavior-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".socialbehavior-circle").style.display =
//                             "block";
//                         socialBehavior = false;
//                     }

//                     if (typeof response.last_five_years_moved !== "undefined")
//                         document.getElementsByName("last_five_years_moved")[0].value =
//                             response.last_five_years_moved;
//                     if (typeof response.things_used_at_home !== "undefined")
//                         document.getElementsByName("things_used_at_home")[0].value =
//                             response.things_used_at_home;
//                     if (typeof response.hours_of_television_daily !== "undefined")
//                         document.getElementsByName("hours_of_television_daily")[0].value =
//                             response.hours_of_television_daily;
//                     if (typeof response.language_used_at_home !== "undefined")
//                         document.getElementsByName("language_used_at_home")[0].value =
//                             response.language_used_at_home;
//                     if (typeof response.changes_at_home_situation !== "undefined")
//                         document.getElementsByName("changes_at_home_situation")[0].value =
//                             response.changes_at_home_situation;
//                     if (typeof response.educational_expectations_of_child !== "undefined")
//                         document.getElementsByName(
//                             "educational_expectations_of_child"
//                         )[0].value = response.educational_expectations_of_child;

//                     if (
//                         response.last_five_years_moved &&
//                         response.things_used_at_home &&
//                         response.hours_of_television_daily &&
//                         response.language_used_at_home &&
//                         response.changes_at_home_situation &&
//                         response.educational_expectations_of_child
//                     ) {
//                         // Reset the display for both images
//                         document.querySelector(".environmentalfactor-tick").style.display =
//                             "none";
//                         document.querySelector(
//                             ".environmentalfactor-circle"
//                         ).style.display = "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".environmentalfactor-tick").style.display =
//                             "block";
//                         environmentalFactor = true;
//                     } else {
//                         // Reset the display for both images
//                         document.querySelector(".environmentalfactor-tick").style.display =
//                             "none";
//                         document.querySelector(
//                             ".environmentalfactor-circle"
//                         ).style.display = "none";
//                         // Update the display for the clicked card
//                         document.querySelector(
//                             ".environmentalfactor-circle"
//                         ).style.display = "block";
//                         environmentalFactor = false;
//                     }

//                     if (response.agree_all_above_info_is_correct == "on") {
//                         document.getElementById(
//                             "agree_all_above_info_is_correct"
//                         ).checked = true;
//                     } else {
//                         document.getElementById(
//                             "agree_all_above_info_is_correct"
//                         ).checked = false;
//                     }

//                     if (response.agree_all_above_info_is_correct) {
//                         // Reset the display for both images
//                         document.querySelector(".parentagreement-two-tick").style.display =
//                             "none";
//                         document.querySelector(
//                             ".parentagreement-two-circle"
//                         ).style.display = "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".parentagreement-two-tick").style.display =
//                             "block";
//                         parentAgreementTwo = true;
//                     } else {
//                         // Reset the display for both images
//                         document.querySelector(".parentagreement-two-tick").style.display =
//                             "none";
//                         document.querySelector(
//                             ".parentagreement-two-circle"
//                         ).style.display = "none";
//                         // Update the display for the clicked card
//                         document.querySelector(
//                             ".parentagreement-two-circle"
//                         ).style.display = "block";
//                         parentAgreementTwo = false;
//                     }

//                     if (
//                         childHistory == true &&
//                         medicalHistory == true &&
//                         pregnancyHistory == true &&
//                         familyHistroy == true &&
//                         socialBehavior == true &&
//                         environmentalFactor == true &&
//                         parentAgreementTwo == true
//                     ) {
//                         // Reset the display for both images
//                         document.querySelector(".childhistory-tick").style.display = "none";
//                         document.querySelector(".childhistory-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".childhistory-tick").style.display =
//                             "block";
//                         statuscall = true;
//                     } else {
//                         // Reset the display for both images
//                         document.querySelector(".childhistory-tick").style.display = "none";
//                         document.querySelector(".childhistory-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".childhistory-circle").style.display =
//                             "block";
//                         statuscall = false;
//                     }
//                 }

//                 var inputs = document.querySelectorAll("#childandfamilyhistory input");

//                 inputs.forEach(function (input) {
//                     if (input.type === "checkbox" || input.type === "radio") {
//                         if (input.checked) {
//                             input.classList.remove("input-success");
//                             input.classList.remove("input-error");
//                         } 
//                     } else {
//                         if (input.value.trim() === "") {
//                             input.classList.add("input-error"); // Add a class to highlight empty input
//                             input.classList.remove("input-success");
//                         } else {
//                             input.classList.add("input-success");
//                             input.classList.remove("input-error"); // Remove error class if input is not empty
//                         }
//                     }

//                 });

//                 //immunization details
//                 let immunizationInstruction = false;
//                 if (document.getElementById("immunizationinstructions") != null) {
//                     if (response.do_you_agree_this_immunization_instructions == "on") {
//                         document.getElementById(
//                             "do_you_agree_this_immunization_instructions"
//                         ).checked = true;
//                         immunizationInstruction = true;
//                     } else {
//                         document.getElementById(
//                             "do_you_agree_this_immunization_instructions"
//                         ).checked = false;
//                         immunizationInstruction = false;
//                     }
//                     if (immunizationInstruction == true) {
//                         // Reset the display for both images
//                         document.querySelector(".immunization-tick").style.display = "none";
//                         document.querySelector(".immunization-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".immunization-tick").style.display =
//                             "block";
//                         statuscall = true;
//                     } else {
//                         // Reset the display for both images
//                         document.querySelector(".immunization-tick").style.display = "none";
//                         document.querySelector(".immunization-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".immunization-circle").style.display =
//                             "block";
//                         statuscall = false;
//                     }
//                 }

//                 var inputs = document.querySelectorAll(
//                     "#immunizationinstructions input"
//                 );

//                 inputs.forEach(function (input) {
//                     if (input.type === "checkbox" || input.type === "radio") {
//                         if (input.checked) {
//                             input.classList.remove("input-success");
//                             input.classList.remove("input-error");
//                         } 
//                     } else {
//                         if (input.value.trim() === "") {
//                             input.classList.add("input-error"); // Add a class to highlight empty input
//                             input.classList.remove("input-success");
//                         } else {
//                             input.classList.add("input-success");
//                             input.classList.remove("input-error"); // Remove error class if input is not empty
//                         }
//                     }
//                 });

//                 let childProfile= false;
//                 let nutritionDetails= false;
//                 let restDetails= false;
//                 let medicalDetails= false;
//                 let parentAgreementThree= false;
//                 //child profile details
//                 if (document.getElementById("childprofile") != null) {
//                     if (typeof response.important_fam_members !== "undefined")
//                         document.getElementsByName("important_fam_members")[0].value =
//                             response.important_fam_members;
//                     if (typeof response.about_family_celebrations !== "undefined")
//                         document.getElementsByName("about_family_celebrations")[0].value =
//                             response.about_family_celebrations;
//                     if (response.childcare_before == 1) {
//                         document.getElementById("childcare_before1").checked = true;
//                         // document.getElementById('childcare_before_reason_div').style.display = "block";
//                         document.getElementById('reason_for_childcare_before_label').style.display = "block";
//                         document.getElementById('reason_for_childcare_before').style.display = "block";
//                     } else if (response.childcare_before == 2) {
//                         document.getElementById("childcare_before2").checked = true;
//                         document.getElementById('reason_for_childcare_before_label').style.display = "none";
//                         document.getElementById('reason_for_childcare_before').style.display = "none";
//                     }
//                     if (typeof response.reason_for_childcare_before !== "undefined")
//                         document.getElementsByName("reason_for_childcare_before")[0].value =
//                             response.reason_for_childcare_before;
//                     if (typeof response.what_child_interests !== "undefined")
//                         document.getElementsByName("what_child_interests")[0].value =
//                             response.what_child_interests;
//                     if (typeof response.drop_off_time !== "undefined")
//                         document.getElementsByName("drop_off_time")[0].value =
//                             response.drop_off_time;
//                     if (typeof response.pick_up_time !== "undefined")
//                         document.getElementsByName("pick_up_time")[0].value =
//                             response.pick_up_time;

//                     if (
//                         response.important_fam_members &&
//                         response.about_family_celebrations &&
//                         response.childcare_before &&
//                         response.reason_for_childcare_before &&
//                         response.what_child_interests &&
//                         response.drop_off_time &&
//                         response.pick_up_time
//                     ) {
//                         // Reset the display for both images
//                         document.querySelector(".childprofiledetail-tick").style.display =
//                             "none";
//                         document.querySelector(".childprofiledetail-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".childprofiledetail-tick").style.display =
//                             "block";
//                         childProfile = true;
//                     } else {
//                         // Reset the display for both images
//                         document.querySelector(".childprofiledetail-tick").style.display =
//                             "none";
//                         document.querySelector(".childprofiledetail-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".childprofiledetail-circle").style.display =
//                             "block";
//                         childProfile = false;
//                     }

//                     if (response.restricted_diet == 1) {
//                         document.getElementById("restricted_diet1").checked = true;
//                         // document.getElementById('restricted_diet_reason_div').style.display = "block";
//                     } else if (response.restricted_diet == 2) {
//                         document.getElementById("restricted_diet2").checked = true;
//                         // document.getElementById('restricted_diet_reason_div').style.display = "none";
//                     }
//                     if (typeof response.restricted_diet_reason !== "undefined")
//                         document.getElementsByName("restricted_diet_reason")[0].value =
//                             response.restricted_diet_reason;
//                     if (response.eat_own == 1) {
//                         document.getElementById("eat_own1").checked = true;
//                         // document.getElementById('eat_own_reason_div').style.display = "block";
//                     } else if (response.eat_own == 2) {
//                         document.getElementById("eat_own2").checked = true;
//                         // document.getElementById('eat_own_reason_div').style.display = "none";
//                     }
//                     if (typeof response.eat_own_reason !== "undefined")
//                         document.getElementsByName("eat_own_reason")[0].value =
//                             response.eat_own_reason;
//                     if (typeof response.favorite_foods !== "undefined")
//                         document.getElementsByName("favorite_foods")[0].value =
//                             response.favorite_foods;

//                     if (
//                         response.restricted_diet &&
//                         response.eat_own &&
//                         response.favorite_foods
//                     ) {
//                         // Reset the display for both images
//                         document.querySelector(".nutrition-tick").style.display = "none";
//                         document.querySelector(".nutrition-circle").style.display = "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".nutrition-tick").style.display = "block";
//                         nutritionDetails = true;
//                     } else {
//                         // Reset the display for both images
//                         document.querySelector(".nutrition-tick").style.display = "none";
//                         document.querySelector(".nutrition-circle").style.display = "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".nutrition-circle").style.display = "block";
//                         nutritionDetails = false;
//                     }

//                     if (response.rest_in_the_middle_day == 1) {
//                         document.getElementById("rest_in_the_middle_day1").checked = true;
//                         // document.getElementById('reason_for_rest_in_the_middle_day_div').style.display = "block";
//                     } else if (response.rest_in_the_middle_day == 2) {
//                         document.getElementById("rest_in_the_middle_day2").checked = true;
//                         // document.getElementById('reason_for_rest_in_the_middle_day_div').style.display = "none";
//                     }
//                     if (typeof response.reason_for_rest_in_the_middle_day !== "undefined")
//                         document.getElementsByName(
//                             "reason_for_rest_in_the_middle_day"
//                         )[0].value = response.reason_for_rest_in_the_middle_day;
//                     if (typeof response.rest_routine !== "undefined")
//                         document.getElementsByName("rest_routine")[0].value =
//                             response.rest_routine;
//                     if (response.toilet_trained == 1) {
//                         document.getElementById("toilet_trained1").checked = true;
//                         // document.getElementById('reason_for_toilet_trained_div').style.display = "block";
//                     } else if (response.toilet_trained == 2) {
//                         document.getElementById("toilet_trained2").checked = true;
//                         // document.getElementById('reason_for_toilet_trained_div').style.display = "none";
//                     }
//                     if (typeof response.reason_for_toilet_trained !== "undefined")
//                         document.getElementsByName("reason_for_toilet_trained")[0].value =
//                             response.reason_for_toilet_trained;

//                     if (
//                         response.rest_in_the_middle_day &&
//                         response.rest_routine &&
//                         response.toilet_trained
//                     ) {
//                         // Reset the display for both images
//                         document.querySelector(".restdetails-tick").style.display = "none";
//                         document.querySelector(".restdetails-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".restdetails-tick").style.display = "block";
//                         restDetails = true;
//                     } else {
//                         // Reset the display for both images
//                         document.querySelector(".restdetails-tick").style.display = "none";
//                         document.querySelector(".restdetails-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".restdetails-circle").style.display =
//                             "block";
//                         restDetails = false;
//                     }

//                     if (response.existing_illness_allergy == 1) {
//                         document.getElementById("existing_illness_allergy1").checked = true;
//                         // document.getElementById('explain_for_existing_illness_allergy_div').style.display = "block";
//                     } else if (response.existing_illness_allergy == 2) {
//                         document.getElementById("existing_illness_allergy2").checked = true;
//                         // document.getElementById('explain_for_existing_illness_allergy_div').style.display = "none";
//                     }

//                     if (
//                         typeof response.explain_for_existing_illness_allergy !== "undefined"
//                     )
//                         document.getElementsByName(
//                             "explain_for_existing_illness_allergy"
//                         )[0].value = response.explain_for_existing_illness_allergy;

//                     if (response.functioning_at_age == 1) {
//                         document.getElementById("functioning_at_age1").checked = true;
//                         // document.getElementById('explain_for_functioning_at_age_div').style.display = "block";
//                     } else if (response.functioning_at_age == 2) {
//                         document.getElementById("functioning_at_age2").checked = true;
//                         // document.getElementById('explain_for_functioning_at_age_div').style.display = "none";
//                     }

//                     if (typeof response.explain_for_functioning_at_age !== "undefined")
//                         document.getElementsByName(
//                             "explain_for_functioning_at_age"
//                         )[0].value = response.explain_for_functioning_at_age;

//                     if (response.able_to_walk == 1) {
//                         document.getElementById("able_to_walk1").checked = true;
//                         // document.getElementById('explain_for_able_to_walk_div').style.display = "block";
//                     } else if (response.able_to_walk == 2) {
//                         document.getElementById("able_to_walk2").checked = true;
//                         // document.getElementById('explain_for_able_to_walk_div').style.display = "none";
//                     }

//                     if (typeof response.explain_for_able_to_walk !== "undefined")
//                         document.getElementsByName("explain_for_able_to_walk")[0].value =
//                             response.explain_for_able_to_walk;

//                     if (response.communicate_their_needs == 1) {
//                         document.getElementById("communicate_their_needs1").checked = true;
//                         // document.getElementById('explain_for_communicate_their_needs_div').style.display = "block";
//                     } else if (response.communicate_their_needs == 2) {
//                         document.getElementById("communicate_their_needs2").checked = true;
//                         // document.getElementById('explain_for_communicate_their_needs_div').style.display = "none";
//                     }

//                     if (
//                         typeof response.explain_for_communicate_their_needs !== "undefined"
//                     )
//                         document.getElementsByName(
//                             "explain_for_communicate_their_needs"
//                         )[0].value = response.explain_for_communicate_their_needs;

//                     if (response.any_medication == 1) {
//                         document.getElementById("any_medication1").checked = true;
//                         // document.getElementById('explain_for_any_medication_div').style.display = "block";
//                     } else if (response.any_medication == 2) {
//                         document.getElementById("any_medication2").checked = true;
//                         // document.getElementById('explain_for_any_medication_div').style.display = "none";
//                     }

//                     if (typeof response.explain_for_any_medication !== "undefined")
//                         document.getElementsByName("explain_for_any_medication")[0].value =
//                             response.explain_for_any_medication;

//                     if (response.utilize_special_equipment == 1) {
//                         document.getElementById(
//                             "utilize_special_equipment1"
//                         ).checked = true;
//                         // document.getElementById('explain_for_utilize_special_equipment_div').style.display = "block";
//                     } else if (response.utilize_special_equipment == 2) {
//                         document.getElementById(
//                             "utilize_special_equipment2"
//                         ).checked = true;
//                         // document.getElementById('explain_for_utilize_special_equipment_div').style.display = "none";
//                     }

//                     if (
//                         typeof response.explain_for_utilize_special_equipment !==
//                         "undefined"
//                     )
//                         document.getElementsByName(
//                             "explain_for_utilize_special_equipment"
//                         )[0].value = response.explain_for_utilize_special_equipment;

//                     if (response.significant_periods == 1) {
//                         document.getElementById("significant_periods1").checked = true;
//                         // document.getElementById('explain_for_significant_periods_div').style.display = "block";
//                     } else if (response.significant_periods == 2) {
//                         document.getElementById("significant_periods2").checked = true;
//                         // document.getElementById('explain_for_significant_periods_div').style.display = "none";
//                     }
//                     if (typeof response.explain_for_significant_periods !== "undefined")
//                         document.getElementsByName(
//                             "explain_for_significant_periods"
//                         )[0].value = response.explain_for_significant_periods;

//                     if (response.desire_any_accommodations == 1) {
//                         document.getElementById(
//                             "desire_any_accommodations1"
//                         ).checked = true;
//                         // document.getElementById('explain_for_desire_any_accommodations_div').style.display = "block";
//                     } else if (response.desire_any_accommodations == 2) {
//                         document.getElementById(
//                             "desire_any_accommodations2"
//                         ).checked = true;
//                         // document.getElementById('explain_for_desire_any_accommodations_div').style.display = "none";
//                     }
//                     if (
//                         typeof response.explain_for_desire_any_accommodations !==
//                         "undefined"
//                     )
//                         document.getElementsByName(
//                             "explain_for_desire_any_accommodations"
//                         )[0].value = response.explain_for_desire_any_accommodations;
//                     if (typeof response.additional_information !== "undefined")
//                         document.getElementsByName("additional_information")[0].value =
//                             response.additional_information;

//                     if (
//                         response.existing_illness_allergy &&
//                         response.explain_for_existing_illness_allergy &&
//                         response.functioning_at_age &&
//                         response.explain_for_functioning_at_age &&
//                         response.able_to_walk &&
//                         response.explain_for_able_to_walk &&
//                         response.communicate_their_needs &&
//                         response.explain_for_communicate_their_needs &&
//                         response.any_medication &&
//                         response.explain_for_any_medication &&
//                         response.utilize_special_equipment &&
//                         response.explain_for_utilize_special_equipment &&
//                         response.significant_periods &&
//                         response.explain_for_significant_periods &&
//                         response.desire_any_accommodations &&
//                         response.explain_for_desire_any_accommodations &&
//                         response.additional_information
//                     ) {
//                         // Reset the display for both images
//                         document.querySelector(".medicaldetails-tick").style.display =
//                             "none";
//                         document.querySelector(".medicaldetails-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".medicaldetails-tick").style.display =
//                             "block";
//                         medicalDetails = true;
//                     } else {
//                         // Reset the display for both images
//                         document.querySelector(".medicaldetails-tick").style.display =
//                             "none";
//                         document.querySelector(".medicaldetails-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".medicaldetails-circle").style.display =
//                             "block";
//                         medicalDetails = false;
//                     }

//                     if (response.do_you_agree_this == "on") {
//                         document.getElementById("do_you_agree_this").checked = true;
//                     } else {
//                         document.getElementById("do_you_agree_this").checked = false;
//                     }
//                     if (response.do_you_agree_this) {
//                         // Reset the display for both images
//                         document.querySelector(
//                             ".parentagreement-three-tick"
//                         ).style.display = "none";
//                         document.querySelector(
//                             ".parentagreement-three-circle"
//                         ).style.display = "none";
//                         // Update the display for the clicked card
//                         document.querySelector(
//                             ".parentagreement-three-tick"
//                         ).style.display = "block";
//                         parentAgreementThree = true;
//                     } else {
//                         // Reset the display for both images
//                         document.querySelector(
//                             ".parentagreement-three-tick"
//                         ).style.display = "none";
//                         document.querySelector(
//                             ".parentagreement-three-circle"
//                         ).style.display = "none";
//                         // Update the display for the clicked card
//                         document.querySelector(
//                             ".parentagreement-three-circle"
//                         ).style.display = "block";
//                         parentAgreementThree = false;
//                     }
//                     if (
//                         childProfile == true &&
//                         nutritionDetails == true &&
//                         restDetails == true &&
//                         medicalDetails == true &&
//                         parentAgreementThree == true
//                     ) {
//                         // Reset the display for both images
//                         document.querySelector(".childprofile-tick").style.display = "none";
//                         document.querySelector(".childprofile-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".childprofile-tick").style.display =
//                             "block";
//                     } else {
//                         // Reset the display for both images
//                         document.querySelector(".childprofile-tick").style.display = "none";
//                         document.querySelector(".childprofile-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".childprofile-circle").style.display =
//                             "block";
//                     }
//                 }

//                 var inputs = document.querySelectorAll("#childprofile input");

//                 inputs.forEach(function (input) {
//                     if (input.type === "checkbox" || input.type === "radio") {
//                         if (input.checked) {
//                             input.classList.remove("input-success");
//                             input.classList.remove("input-error");
//                         } 
//                     } else {
//                         if (input.value.trim() === "") {
//                             input.classList.add("input-error"); // Add a class to highlight empty input
//                             input.classList.remove("input-success");
//                         } else {
//                             input.classList.add("input-success");
//                             input.classList.remove("input-error"); // Remove error class if input is not empty
//                         }
//                     }
//                 });

//                 //pickup password details
//                 let pickupPassword= false;
//                 if (document.getElementById("pickuppassword") != null) {
//                     if (
//                         typeof response.child_password_pick_up_password_form !== "undefined"
//                     )
//                         document.getElementsByName(
//                             "child_password_pick_up_password_form"
//                         )[0].value = response.child_password_pick_up_password_form;
//                     if (response.do_you_agree_this_pick_up_password_form == "on") {
//                         document.getElementById(
//                             "do_you_agree_this_pick_up_password_form"
//                         ).checked = true;
//                     } else {
//                         document.getElementById(
//                             "do_you_agree_this_pick_up_password_form"
//                         ).checked = false;
//                     }

//                     if (
//                         response.child_password_pick_up_password_form &&
//                         response.do_you_agree_this_pick_up_password_form
//                     ) {
//                         // Reset the display for both images
//                         document.querySelector(".childpickup-tick").style.display = "none";
//                         document.querySelector(".childpickup-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".childpickup-tick").style.display = "block";
//                         pickupPassword = true;
//                     } else {
//                         // Reset the display for both images
//                         document.querySelector(".childpickup-tick").style.display = "none";
//                         document.querySelector(".childpickup-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".childpickup-circle").style.display =
//                             "block";
//                         pickupPassword = false;
//                     }
//                 }

//                 var inputs = document.querySelectorAll("#pickuppassword input");

//                 inputs.forEach(function (input) {
//                     if (input.type === "checkbox" || input.type === "radio") {
//                         if (input.checked) {
//                             input.classList.remove("input-success");
//                             input.classList.remove("input-error");
//                         } 
//                     } else {
//                         if (input.value.trim() === "") {
//                             input.classList.add("input-error"); // Add a class to highlight empty input
//                             input.classList.remove("input-success");
//                         } else {
//                             input.classList.add("input-success");
//                             input.classList.remove("input-error"); // Remove error class if input is not empty
//                         }
//                     }
//                 });

//                 //photo video permisiion details
//                 let photoVideoPermission= false;
//                 if (document.getElementById("photovideopermission") != null) {
//                     // if (typeof response.photo_usage_photo_video_permission_form  !== "undefined"){
//                     //         $('#photo_usage_photo_video_permission_form').append($("<option></option>").attr("value", response.photo_usage_photo_video_permission_form).text(response.photo_usage_photo_video_permission_form));
//                     //     }
//                     if (
//                         typeof response.photo_usage_photo_video_permission_form !==
//                         "undefined"
//                     )
//                         document.getElementsByName(
//                             "photo_usage_photo_video_permission_form"
//                         )[0].value = response.photo_usage_photo_video_permission_form;

//                     if (response.photo_permission_agree_group_photos_electronic == "on") {
//                         document.getElementById(
//                             "photo_permission_agree_group_photos_electronic"
//                         ).checked = true;
//                     } else {
//                         document.getElementById(
//                             "photo_permission_agree_group_photos_electronic"
//                         ).checked = false;
//                     }
//                     if (response.do_you_agree_this_photo_video_permission_form == "on") {
//                         document.getElementById(
//                             "do_you_agree_this_photo_video_permission_form"
//                         ).checked = true;
//                     } else {
//                         document.getElementById(
//                             "do_you_agree_this_photo_video_permission_form"
//                         ).checked = false;
//                     }

//                     if (
//                         response.photo_usage_photo_video_permission_form &&
//                         response.photo_permission_agree_group_photos_electronic &&
//                         response.do_you_agree_this_photo_video_permission_form
//                     ) {
//                         // Reset the display for both images
//                         document.querySelector(".childphotopermission-tick").style.display =
//                             "none";
//                         document.querySelector(
//                             ".childphotopermission-circle"
//                         ).style.display = "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".childphotopermission-tick").style.display =
//                             "block";
//                         photoVideoPermission = true;
//                     } else {
//                         // Reset the display for both images
//                         document.querySelector(".childphotopermission-tick").style.display =
//                             "none";
//                         document.querySelector(
//                             ".childphotopermission-circle"
//                         ).style.display = "none";
//                         // Update the display for the clicked card
//                         document.querySelector(
//                             ".childphotopermission-circle"
//                         ).style.display = "block";
//                         photoVideoPermission = false;
//                     }
//                 }

//                 var inputs = document.querySelectorAll("#photovideopermission input");

//                 inputs.forEach(function (input) {
//                     if (input.type === "checkbox" || input.type === "radio") {
//                         if (input.checked) {
//                             input.classList.remove("input-success");
//                             input.classList.remove("input-error");
//                         } 
//                     } else {
//                         if (input.value.trim() === "") {
//                             input.classList.add("input-error"); // Add a class to highlight empty input
//                             input.classList.remove("input-success");
//                         } else {
//                             input.classList.add("input-success");
//                             input.classList.remove("input-error"); // Remove error class if input is not empty
//                         }
//                     }
//                 });

//                 // security policy details
//                 let securityPolicy= false;
//                 if (document.getElementById("securitypolicy") != null) {
//                     if (response.security_release_policy_form == "on") {
//                         document.getElementById(
//                             "security_release_policy_form"
//                         ).checked = true;
//                     } else {
//                         document.getElementById(
//                             "security_release_policy_form"
//                         ).checked = false;
//                     }
//                     if (response.security_release_policy_form) {
//                         // Reset the display for both images
//                         document.querySelector(".childsecurity-tick").style.display =
//                             "none";
//                         document.querySelector(".childsecurity-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".childsecurity-tick").style.display =
//                             "block";
//                         securityPolicy = true;
//                     } else {
//                         // Reset the display for both images
//                         document.querySelector(".childsecurity-tick").style.display =
//                             "none";
//                         document.querySelector(".childsecurity-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".childsecurity-circle").style.display =
//                             "block";
//                         securityPolicy = false;
//                     }
//                 }

//                 var inputs = document.querySelectorAll("#securitypolicy input");

//                 inputs.forEach(function (input) {
//                     if (input.type === "checkbox" || input.type === "radio") {
//                         if (input.checked) {
//                             input.classList.remove("input-success");
//                             input.classList.remove("input-error");
//                         } 
//                     } else {
//                         if (input.value.trim() === "") {
//                             input.classList.add("input-error"); // Add a class to highlight empty input
//                             input.classList.remove("input-success");
//                         } else {
//                             input.classList.add("input-success");
//                             input.classList.remove("input-error"); // Remove error class if input is not empty
//                         }
//                     }
//                 });

//                 //medical transportation details
//                 let medicaltransportationWeiver= false;
//                 if (document.getElementById("medicaltransportation") != null) {
//                     if (
//                         typeof response.med_technicians_med_transportation_waiver !==
//                         "undefined"
//                     )
//                         document.getElementsByName(
//                             "med_technicians_med_transportation_waiver"
//                         )[0].value = response.med_technicians_med_transportation_waiver;

//                     if (response.medical_transportation_waiver == "on") {
//                         document.getElementById(
//                             "medical_transportation_waiver"
//                         ).checked = true;
//                     } else {
//                         document.getElementById(
//                             "medical_transportation_waiver"
//                         ).checked = false;
//                     }
//                     if (
//                         response.med_technicians_med_transportation_waiver &&
//                         response.medical_transportation_waiver
//                     ) {
//                         // Reset the display for both images
//                         document.querySelector(".childmedical-tick").style.display = "none";
//                         document.querySelector(".childmedical-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".childmedical-tick").style.display =
//                             "block";
//                         medicaltransportationWeiver = true;
//                     } else {
//                         // Reset the display for both images
//                         document.querySelector(".childmedical-tick").style.display = "none";
//                         document.querySelector(".childmedical-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".childmedical-circle").style.display =
//                             "block";
//                         medicaltransportationWeiver = false;
//                     }
//                 }

//                 var inputs = document.querySelectorAll("#medicaltransportation input");

//                 inputs.forEach(function (input) {
//                     if (input.type === "checkbox" || input.type === "radio") {
//                         if (input.checked) {
//                             input.classList.remove("input-success");
//                             input.classList.remove("input-error");
//                         } 
//                     } else {
//                         if (input.value.trim() === "") {
//                             input.classList.add("input-error"); // Add a class to highlight empty input
//                             input.classList.remove("input-success");
//                         } else {
//                             input.classList.add("input-success");
//                             input.classList.remove("input-error"); // Remove error class if input is not empty
//                         }
//                     }
//                 });

//                 // health policy details
//                 let healthPolicy= false;
//                 if (document.getElementById("healthpolicies") != null) {
//                     if (response.do_you_agree_this_health_policies == "on") {
//                         document.getElementById(
//                             "do_you_agree_this_health_policies"
//                         ).checked = true;
//                     } else {
//                         document.getElementById(
//                             "do_you_agree_this_health_policies"
//                         ).checked = false;
//                     }
//                     if (response.do_you_agree_this_health_policies) {
//                         // Reset the display for both images
//                         document.querySelector(".childhealth-tick").style.display = "none";
//                         document.querySelector(".childhealth-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".childhealth-tick").style.display = "block";
//                         healthPolicy = true;
//                     } else {
//                         // Reset the display for both images
//                         document.querySelector(".childhealth-tick").style.display = "none";
//                         document.querySelector(".childhealth-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".childhealth-circle").style.display =
//                             "block";
//                         healthPolicy = true;
//                     }
//                 }

//                 var inputs = document.querySelectorAll("#healthpolicies input");

//                 inputs.forEach(function (input) {
//                     if (input.type === "checkbox" || input.type === "radio") {
//                         if (input.checked) {
//                             input.classList.remove("input-success");
//                             input.classList.remove("input-error");
//                         } 
//                     } else {
//                         if (input.value.trim() === "") {
//                             input.classList.add("input-error"); // Add a class to highlight empty input
//                             input.classList.remove("input-success");
//                         } else {
//                             input.classList.add("input-success");
//                             input.classList.remove("input-error"); // Remove error class if input is not empty
//                         }
//                     }
//                 });

//                 // outside weiver details
//                 let outsideWeiver= false;
//                 if (document.getElementById("outsideengagements") != null) {
//                     if (response.parent_sign_outside_waiver == "on") {
//                         document.getElementById(
//                             "parent_sign_outside_waiver"
//                         ).checked = true;
//                     } else {
//                         document.getElementById(
//                             "parent_sign_outside_waiver"
//                         ).checked = false;
//                     }
//                     if (response.parent_sign_outside_waiver) {
//                         // Reset the display for both images
//                         document.querySelector(".childoutside-tick").style.display = "none";
//                         document.querySelector(".childoutside-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".childoutside-tick").style.display =
//                             "block";
//                         outsideWeiver = true;
//                     } else {
//                         // Reset the display for both images
//                         document.querySelector(".childoutside-tick").style.display = "none";
//                         document.querySelector(".childoutside-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".childoutside-circle").style.display =
//                             "block";
//                         outsideWeiver = false;
//                     }
//                 }

//                 var inputs = document.querySelectorAll("#outsideengagements input");

//                 inputs.forEach(function (input) {
//                     if (input.type === "checkbox" || input.type === "radio") {
//                         if (input.checked) {
//                             input.classList.remove("input-success");
//                             input.classList.remove("input-error");
//                         } 
//                     } else {
//                         if (input.value.trim() === "") {
//                             input.classList.add("input-error"); // Add a class to highlight empty input
//                             input.classList.remove("input-success");
//                         } else {
//                             input.classList.add("input-success");
//                             input.classList.remove("input-error"); // Remove error class if input is not empty
//                         }
//                     }
//                 });

//                 // social media details
//                 let socialMedia= false;
//                 if (document.getElementById("socialmediaapproval") != null) {
//                     if (response.approve_social_media_post == 1) {
//                         document.getElementById(
//                             "approve_social_media_post1"
//                         ).checked = true;
//                     } else if (response.approve_social_media_post == 2) {
//                         document.getElementById(
//                             "approve_social_media_post2"
//                         ).checked = true;
//                     } else {
//                         document.getElementById(
//                             "approve_social_media_post1"
//                         ).checked = false;
//                         document.getElementById(
//                             "approve_social_media_post2"
//                         ).checked = false;
//                     }
//                     if (typeof response.printed_name_social_media_post !== "undefined")
//                         document.getElementsByName(
//                             "printed_name_social_media_post"
//                         )[0].value = response.printed_name_social_media_post;
//                     if (response.do_you_agree_this_social_media_post == "on") {
//                         document.getElementById(
//                             "do_you_agree_this_social_media_post"
//                         ).checked = true;
//                     } else {
//                         document.getElementById(
//                             "do_you_agree_this_social_media_post"
//                         ).checked = false;
//                     }

//                     if (
//                         response.approve_social_media_post &&
//                         response.printed_name_social_media_post &&
//                         response.do_you_agree_this_social_media_post
//                     ) {
//                         // Reset the display for both images
//                         document.querySelector(".socialmedia-tick").style.display = "none";
//                         document.querySelector(".socialmedia-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".socialmedia-tick").style.display = "block";
//                         socialMedia = true;
//                     } else {
//                         // Reset the display for both images
//                         document.querySelector(".socialmedia-tick").style.display = "none";
//                         document.querySelector(".socialmedia-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".socialmedia-circle").style.display =
//                             "block";
//                         socialMedia = false;
//                     }
//                 }

//                 var inputs = document.querySelectorAll("#socialmediaapproval input");

//                 inputs.forEach(function (input) {
//                     if (input.type === "checkbox" || input.type === "radio") {
//                         if (input.checked) {
//                             input.classList.remove("input-success");
//                             input.classList.remove("input-error");
//                         } 
//                     } else {
//                         if (input.value.trim() === "") {
//                             input.classList.add("input-error"); // Add a class to highlight empty input
//                             input.classList.remove("input-success");
//                         } else {
//                             input.classList.add("input-success");
//                             input.classList.remove("input-error"); // Remove error class if input is not empty
//                         }
//                     }
//                 });

//                 // Admission form parent agreement
//                 let admissionparentsign= false;
//                 if (document.getElementById("parentsignature") != null) {
//                     if (typeof response.parent_sign_admission !== "undefined") {
//                         document.getElementsByName("parent_sign_admission")[0].value =
//                             response.parent_sign_admission;
//                     }

//                     if (response.parent_sign_date_admission === null || response.parent_sign_date_admission === undefined) {
//                         document.getElementsByName("parent_sign_date_admission")[0].value = new Date().toISOString().split('T')[0];
//                     } else {
//                         document.getElementsByName("parent_sign_date_admission")[0].value =
//                             response.parent_sign_date_admission;
//                     }

//                     if (
//                         response.parent_sign_admission &&
//                         response.parent_sign_date_admission
//                     ) {
//                         // Reset the display for both images
//                         document.querySelector(".childparent-tick").style.display = "none";
//                         document.querySelector(".childparent-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".childparent-tick").style.display = "block";
//                         admissionparentsign = true;
//                     } else {
//                         // Reset the display for both images
//                         document.querySelector(".childparent-tick").style.display = "none";
//                         document.querySelector(".childparent-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".childparent-circle").style.display =
//                             "block";
//                         admissionparentsign = false;
//                     }

//                     if (
//                         childbasicInfo == true &&
//                         childparentInfo == true &&
//                         childEmergencyContact == true &&
//                         childMedicalcare == true &&
//                         childParentAgreementOne == true &&
//                         childHistory == true &&
//                         medicalHistory == true &&
//                         pregnancyHistory == true &&
//                         familyHistroy == true &&
//                         socialBehavior == true &&
//                         environmentalFactor == true &&
//                         parentAgreementTwo == true &&
//                         immunizationInstruction == true &&
//                         childProfile == true &&
//                         nutritionDetails == true &&
//                         restDetails == true &&
//                         medicalDetails == true &&
//                         parentAgreementThree == true &&
//                         pickupPassword == true &&
//                         photoVideoPermission == true &&
//                         securityPolicy == true &&
//                         medicaltransportationWeiver == true &&
//                         healthPolicy == true &&
//                         outsideWeiver == true &&
//                         socialMedia == true
//                     ) {
//                         let parentFinalAgreement = document.getElementById(
//                             "parentFinalAgreement"
//                         );
//                         if(parentFinalAgreement){
//                         parentFinalAgreement.classList.remove("disabled");
//                         }
//                     } else {
//                         let parentFinalAgreement = document.getElementById(
//                             "parentFinalAgreement"
//                         );
//                         if(parentFinalAgreement){
//                         parentFinalAgreement.classList.add("disabled");
//                         }
//                     }
//                 }

//                 var inputs = document.querySelectorAll("#parentsignature input");

//                 inputs.forEach(function (input) {
//                     if (input.type === "checkbox" || input.type === "radio") {
//                         if (input.checked) {
//                             input.classList.remove("input-success");
//                             input.classList.remove("input-error");
//                         } 
//                     } else {
//                         if (input.value.trim() === "") {
//                             input.classList.add("input-error"); // Add a class to highlight empty input
//                             input.classList.remove("input-success");
//                         } else {
//                             input.classList.add("input-success");
//                             input.classList.remove("input-error"); // Remove error class if input is not empty
//                         }
//                     }
//                 });

//                 if (
//                     childbasicInfo == true &&
//                     childparentInfo == true &&
//                     childEmergencyContact == true &&
//                     childMedicalcare == true &&
//                     childParentAgreementOne == true &&
//                     childHistory == true &&
//                     medicalHistory == true &&
//                     pregnancyHistory == true &&
//                     familyHistroy == true &&
//                     socialBehavior == true &&
//                     environmentalFactor == true &&
//                     parentAgreementTwo == true &&
//                     immunizationInstruction == true &&
//                     childProfile == true &&
//                     nutritionDetails == true &&
//                     restDetails == true &&
//                     medicalDetails == true &&
//                     parentAgreementThree == true &&
//                     pickupPassword == true &&
//                     photoVideoPermission == true &&
//                     securityPolicy == true &&
//                     medicaltransportationWeiver == true &&
//                     healthPolicy == true &&
//                     outsideWeiver == true &&
//                     socialMedia == true &&
//                     admissionparentsign == true
//                 ) {
//                     // // Reset the display for both images
//                     // document.querySelector('.admission-tick').style.display = 'none';
//                     // document.querySelector('.admission-circle').style.display = 'none';
//                     // // Update the display for the clicked card
//                     // document.querySelector('.admission-tick').style.display = 'block';
//                     const admissionTick = document.querySelector(".admission-tick");
//                     const admissionCircle = document.querySelector(".admission-circle");

//                     // Check if both elements exist before changing their styles
//                     if (admissionTick && admissionCircle) {
//                         // Reset the display for both images
//                         admissionTick.style.display = "none";
//                         admissionCircle.style.display = "none";
//                         // Update the display for the clicked card
//                         admissionTick.style.display = "block";
//                     }
//                 } else {
//                     // // Reset the display for both images
//                     // document.querySelector('.admission-tick').style.display = 'none';
//                     // document.querySelector('.admission-circle').style.display = 'none';
//                     // // Update the display for the clicked card
//                     // document.querySelector('.admission-circle').style.display = 'block';
//                     const admissionTick = document.querySelector(".admission-tick");
//                     const admissionCircle = document.querySelector(".admission-circle");

//                     // Check if both elements exist before changing their styles
//                     if (admissionTick && admissionCircle) {
//                         // Reset the display for both images
//                         admissionTick.style.display = "none";
//                         admissionCircle.style.display = "none";
//                         // Update the display for the clicked card
//                         admissionCircle.style.display = "block";
//                     }
//                 }

//                 //Admission form admin restriction
//                 if (document.getElementById("adminsignature") != null) {
//                     if ( localStorage.getItem("logged_in_email") =="goddard01arjava@gmail.com") {
//                         let adminFinalAgreement = document.getElementById("adminFinalAgreement");
//                         if(adminFinalAgreement){
//                         adminFinalAgreement.classList.remove("disabled");
//                         }
//                     } else {
//                         let adminFinalAgreement = document.getElementById("adminFinalAgreement");
//                         if(adminFinalAgreement){
//                         adminFinalAgreement.classList.add("disabled");
//                         }
//                         // Reset the display for both images
//                         document.querySelector(".childadmin-tick").style.display = "none";
//                         document.querySelector(".childadmin-circle").style.display = "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".childadmin-circle").style.display =
//                             "block";
//                     }
//                 }

//                 //enrollment data
//                 let enrollmentDetails= false;
//                 let enrollmentparent= false;
//                 if (document.getElementById("childenrollmentagreement") != null) {
//                     document.getElementsByName("point_one_field_one")[0].value = new Date().toISOString().split('T')[0];
//                     // if (typeof response.point_one_field_one !== "undefined")
//                     //     document.getElementsByName("point_one_field_one")[0].value = response.point_one_field_one;
//                     // if (typeof response.point_one_field_two !== "undefined")
//                     //     document.getElementsByName("point_one_field_two")[0].value = response.point_one_field_two;
//                     if (typeof response.point_one_field_three !== "undefined")
//                         document.getElementsByName("point_one_field_three")[0].value =
//                             response.point_one_field_three;
//                     if (typeof response.point_two_initial_here !== "undefined")
//                         document.getElementsByName("point_two_initial_here")[0].value =
//                             response.point_two_initial_here;
//                     if (typeof response.point_three_initial_here !== "undefined")
//                         document.getElementsByName("point_three_initial_here")[0].value =
//                             response.point_three_initial_here;
//                     if (typeof response.point_four_initial_here !== "undefined")
//                         document.getElementsByName("point_four_initial_here")[0].value =
//                             response.point_four_initial_here;
//                     if (typeof response.point_five_initial_here !== "undefined")
//                         document.getElementsByName("point_five_initial_here")[0].value =
//                             response.point_five_initial_here;
//                     if (typeof response.point_six_initial_here !== "undefined")
//                         document.getElementsByName("point_six_initial_here")[0].value =
//                             response.point_six_initial_here;
//                     if (typeof response.point_seven_initial_here !== "undefined")
//                         document.getElementsByName("point_seven_initial_here")[0].value =
//                             response.point_seven_initial_here;
//                     if (typeof response.point_eight_initial_here !== "undefined")
//                         document.getElementsByName("point_eight_initial_here")[0].value =
//                             response.point_eight_initial_here;
//                     if (typeof response.point_nine_initial_here !== "undefined")
//                         document.getElementsByName("point_nine_initial_here")[0].value =
//                             response.point_nine_initial_here;
//                     if (typeof response.point_ten_initial_here !== "undefined")
//                         document.getElementsByName("point_ten_initial_here")[0].value =
//                             response.point_ten_initial_here;
//                     if (typeof response.point_eleven_initial_here !== "undefined")
//                         document.getElementsByName("point_eleven_initial_here")[0].value =
//                             response.point_eleven_initial_here;
//                     if (typeof response.point_twelve_initial_here !== "undefined")
//                         document.getElementsByName("point_twelve_initial_here")[0].value =
//                             response.point_twelve_initial_here;
//                     if (typeof response.point_thirteen_initial_here !== "undefined")
//                         document.getElementsByName("point_thirteen_initial_here")[0].value =
//                             response.point_thirteen_initial_here;
//                     if (typeof response.point_fourteen_initial_here !== "undefined")
//                         document.getElementsByName("point_fourteen_initial_here")[0].value =
//                             response.point_fourteen_initial_here;
//                     if (typeof response.point_fifteen_initial_here !== "undefined")
//                         document.getElementsByName("point_fifteen_initial_here")[0].value =
//                             response.point_fifteen_initial_here;
//                     if (typeof response.point_sixteen_initial_here !== "undefined")
//                         document.getElementsByName("point_sixteen_initial_here")[0].value =
//                             response.point_sixteen_initial_here;
//                     if (typeof response.point_seventeen_initial_here !== "undefined")
//                         document.getElementsByName(
//                             "point_seventeen_initial_here"
//                         )[0].value = response.point_seventeen_initial_here;
//                     if (typeof response.point_eighteen_initial_here !== "undefined")
//                         document.getElementsByName("point_eighteen_initial_here")[0].value =
//                             response.point_eighteen_initial_here;
//                     if (typeof response.point_ninteen_initial_here !== "undefined")
//                         document.getElementsByName("point_ninteen_initial_here")[0].value =
//                             response.point_ninteen_initial_here;
//                     if (typeof response.preferred_start_date !== "undefined")
//                         document.getElementsByName("preferred_start_date")[0].value =
//                             response.preferred_start_date;
//                     if (typeof response.preferred_schedule !== "undefined")
//                         document.getElementsByName("preferred_schedule")[0].value =
//                             response.preferred_schedule;
//                     if (response.full_day == "on") {
//                         document.getElementById("full_day").checked = true;
//                     } else {
//                         document.getElementById("full_day").checked = false;
//                     }
//                     if (response.half_day == "on") {
//                         document.getElementById("half_day").checked = true;
//                     } else {
//                         document.getElementById("half_day").checked = false;
//                     }

//                     if (
//                         response.point_one_field_three &&
//                         response.point_two_initial_here &&
//                         response.point_three_initial_here &&
//                         response.point_four_initial_here &&
//                         response.point_five_initial_here &&
//                         response.point_six_initial_here &&
//                         response.point_seven_initial_here &&
//                         response.point_eight_initial_here &&
//                         response.point_nine_initial_here &&
//                         response.point_ten_initial_here &&
//                         response.point_eleven_initial_here &&
//                         response.point_twelve_initial_here &&
//                         response.point_thirteen_initial_here &&
//                         response.point_fourteen_initial_here &&
//                         response.point_fifteen_initial_here &&
//                         response.point_sixteen_initial_here &&
//                         response.point_seventeen_initial_here &&
//                         response.point_eighteen_initial_here &&
//                         response.point_ninteen_initial_here &&
//                         response.preferred_start_date &&
//                         response.preferred_schedule
//                     ) {
//                         let enrollmentFinalAgreement = document.getElementById(
//                             "enrollmentFinalAgreement"
//                         );
//                         if(enrollmentFinalAgreement){
//                         enrollmentFinalAgreement.classList.remove("disabled");
//                         }
//                         // Reset the display for both images
//                         document.querySelector(
//                             ".childenrollmentagreement-tick"
//                         ).style.display = "none";
//                         document.querySelector(
//                             ".childenrollmentagreement-circle"
//                         ).style.display = "none";
//                         // Update the display for the clicked card
//                         document.querySelector(
//                             ".childenrollmentagreement-tick"
//                         ).style.display = "block";
//                         enrollmentDetails = true;
//                     } else {
//                         let enrollmentFinalAgreement = document.getElementById(
//                             "enrollmentFinalAgreement"
//                         );
//                         if(enrollmentFinalAgreement){
//                         enrollmentFinalAgreement.classList.add("disabled");
//                         }
//                         // Reset the display for both images
//                         document.querySelector(
//                             ".childenrollmentagreement-tick"
//                         ).style.display = "none";
//                         document.querySelector(
//                             ".childenrollmentagreement-circle"
//                         ).style.display = "none";
//                         // Update the display for the clicked card
//                         document.querySelector(
//                             ".childenrollmentagreement-circle"
//                         ).style.display = "block";
//                         enrollmentDetails = false;
//                     }
//                     document.getElementsByName("parent_sign_date_enroll")[0].value = new Date().toISOString().split('T')[0];
//                 }
//                 var inputs = document.querySelectorAll(
//                     "#childenrollmentagreement input"
//                 );

//                 inputs.forEach(function (input) {
//                     if (input.type === "checkbox" || input.type === "radio") {
//                         if (input.checked) {
//                             input.classList.remove("input-success");
//                             input.classList.remove("input-error");
//                         } 
//                     } else {
//                         if (input.value.trim() === "") {
//                             input.classList.add("input-error"); // Add a class to highlight empty input
//                             input.classList.remove("input-success");
//                         } else {
//                             input.classList.add("input-success");
//                             input.classList.remove("input-error"); // Remove error class if input is not empty
//                         }
//                     }
//                 });

//                 if (document.getElementById("childenrollmentagreementparentsign") != null) {
//                     if (typeof response.parent_sign_enroll !== "undefined") {
//                         document.getElementsByName("parent_sign_enroll")[0].value =
//                             response.parent_sign_enroll;
//                     }
//                     if (response.parent_sign_date_enroll === null || response.parent_sign_date_enroll === undefined) {
//                         document.getElementsByName("parent_sign_date_enroll")[0].value = new Date().toISOString().split('T')[0];
//                     } else {
//                         document.getElementsByName("parent_sign_date_enroll")[0].value =
//                             response.parent_sign_date_enroll;
//                     }

//                     if (response.parent_sign_enroll && response.parent_sign_date_enroll) {
//                         // Reset the display for both images
//                         document.querySelector(
//                             ".childenrollmentagreementparentsign-tick"
//                         ).style.display = "none";
//                         document.querySelector(
//                             ".childenrollmentagreementparentsign-circle"
//                         ).style.display = "none";
//                         // Update the display for the clicked card
//                         document.querySelector(
//                             ".childenrollmentagreementparentsign-tick"
//                         ).style.display = "block";
//                         enrollmentparent = true;
//                     } else {
//                         // Reset the display for both images
//                         document.querySelector(
//                             ".childenrollmentagreementparentsign-tick"
//                         ).style.display = "none";
//                         document.querySelector(
//                             ".childenrollmentagreementparentsign-circle"
//                         ).style.display = "none";
//                         // Update the display for the clicked card
//                         document.querySelector(
//                             ".childenrollmentagreementparentsign-circle"
//                         ).style.display = "block";
//                         enrollmentparent = false;
//                     }
//                     if (enrollmentDetails == true && enrollmentparent == true) {
//                         // Reset the display for both images
//                         document.querySelector(".childenrollment-tick").style.display =
//                             "none";
//                         document.querySelector(".childenrollment-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".childenrollment-tick").style.display =
//                             "block";
//                     } else {
//                         // Reset the display for both images
//                         document.querySelector(".childenrollment-tick").style.display =
//                             "none";
//                         document.querySelector(".childenrollment-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".childenrollment-circle").style.display =
//                             "block";
//                     }
//                 }

//                 var inputs = document.querySelectorAll(
//                     "#childenrollmentagreementparentsign input"
//                 );

//                 inputs.forEach(function (input) {
//                     if (input.type === "checkbox" || input.type === "radio") {
//                         if (input.checked) {
//                             input.classList.remove("input-success");
//                             input.classList.remove("input-error");
//                         } 
//                     } else {
//                         if (input.value.trim() === "") {
//                             input.classList.add("input-error"); // Add a class to highlight empty input
//                             input.classList.remove("input-success");
//                         } else {
//                             input.classList.add("input-success");
//                             input.classList.remove("input-error"); // Remove error class if input is not empty
//                         }
//                     }
//                 });

//                 //enrollment form admin restriction
//                 if (
//                     document.getElementById("childenrollmentagreementadminsign") != null
//                 ) {
//                     if (
//                         localStorage.getItem("logged_in_email") !==
//                         "goddard01arjava@gmail.com"
//                     ) {
//                         let adminFinalAgreement = document.getElementById(
//                             "enrollmentAdminFinalAgreement"
//                         );
//                         if(adminFinalAgreement){
//                         adminFinalAgreement.classList.add("disabled");
//                         }
//                         // Reset the display for both images
//                         document.querySelector(
//                             ".childenrollmentagreementadminsign-tick"
//                         ).style.display = "none";
//                         document.querySelector(
//                             ".childenrollmentagreementadminsign-circle"
//                         ).style.display = "none";
//                         // Update the display for the clicked card
//                         document.querySelector(
//                             ".childenrollmentagreementadminsign-circle"
//                         ).style.display = "block";
//                     } else {
//                         let adminFinalAgreement = document.getElementById(
//                             "enrollmentAdminFinalAgreement"
//                         );
//                         if(adminFinalAgreement){
//                         adminFinalAgreement.classList.remove("disabled");
//                         }
//                     }
//                 }

//                 //authorization form
//                 let authorizationDetails= false;
//                 let achparentsign= false;
//                 if (document.getElementById("authorizationach") != null) {
//                     if (typeof response.bank_routing !== "undefined")
//                         document.getElementById("bank_routing").value =
//                             response.bank_routing;
//                     if (typeof response.bank_account !== "undefined")
//                         document.getElementById("bank_account").value =
//                             response.bank_account;
//                     if (typeof response.driver_license !== "undefined")
//                         document.getElementById("driver_license").value =
//                             response.driver_license;
//                     if (typeof response.state !== "undefined")
//                         document.getElementById("state").value = response.state;
//                     // if (typeof response.email !== "undefined")
//                     //     document.getElementById("email").value = response.email;
//                     if (typeof response.i !== "undefined")
//                         document.getElementById("i").value = response.i;

//                     if (
//                         response.bank_routing &&
//                         response.bank_account &&
//                         response.driver_license &&
//                         response.state &&
//                         response.i
//                     ) {
//                         let achFinalAgreement =
//                             document.getElementById("achFinalAgreement");
//                             if(achFinalAgreement){
//                         achFinalAgreement.classList.remove("disabled");
//                             }
//                         // Reset the display for both images
//                         document.querySelector(".authorizationach-tick").style.display =
//                             "none";
//                         document.querySelector(".authorizationach-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".authorizationach-tick").style.display =
//                             "block";
//                         authorizationDetails = true;
//                     } else {
//                         let achFinalAgreement =
//                             document.getElementById("achFinalAgreement");
//                             if(achFinalAgreement){
//                         achFinalAgreement.classList.add("disabled");
//                             }
//                         // Reset the display for both images
//                         document.querySelector(".authorizationach-tick").style.display =
//                             "none";
//                         document.querySelector(".authorizationach-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".authorizationach-circle").style.display =
//                             "block";
//                         authorizationDetails = false;
//                     }
//                 }

//                 var inputs = document.querySelectorAll("#authorizationach input");

//                 inputs.forEach(function (input) {
//                     if (input.type === "checkbox" || input.type === "radio") {
//                         if (input.checked) {
//                             input.classList.remove("input-success");
//                             input.classList.remove("input-error");
//                         } 
//                     } else {
//                         if (input.value.trim() === "") {
//                             input.classList.add("input-error"); // Add a class to highlight empty input
//                             input.classList.remove("input-success");
//                         } else {
//                             input.classList.add("input-success");
//                             input.classList.remove("input-error"); // Remove error class if input is not empty
//                         }
//                     }
//                 });

//                 if (document.getElementById("authorizationparentsign") != null) {
//                     if (typeof response.parent_sign_ach !== "undefined") {
//                         document.getElementsByName("parent_sign_ach")[0].value =
//                             response.parent_sign_ach;
//                     }

//                     if (response.parent_sign_date_ach === null || response.parent_sign_date_ach === undefined) {
//                         document.getElementsByName("parent_sign_date_ach")[0].value = new Date().toISOString().split('T')[0];
//                     } else {
//                         document.getElementsByName("parent_sign_date_ach")[0].value =
//                             response.parent_sign_date_ach;
//                     }

//                     if (response.parent_sign_ach && response.parent_sign_date_ach) {
//                         // Reset the display for both images
//                         document.querySelector(
//                             ".authorizationparentsign-tick"
//                         ).style.display = "none";
//                         document.querySelector(
//                             ".authorizationparentsign-circle"
//                         ).style.display = "none";
//                         // Update the display for the clicked card
//                         document.querySelector(
//                             ".authorizationparentsign-tick"
//                         ).style.display = "block";
//                         achparentsign = true;
//                     } else {
//                         // Reset the display for both images
//                         document.querySelector(
//                             ".authorizationparentsign-tick"
//                         ).style.display = "none";
//                         document.querySelector(
//                             ".authorizationparentsign-circle"
//                         ).style.display = "none";
//                         // Update the display for the clicked card
//                         document.querySelector(
//                             ".authorizationparentsign-circle"
//                         ).style.display = "block";
//                         achparentsign = false;
//                     }

//                     if (authorizationDetails == true && achparentsign == true) {
//                         // Reset the display for both images
//                         document.querySelector(".authorization-tick").style.display =
//                             "none";
//                         document.querySelector(".authorization-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".authorization-tick").style.display =
//                             "block";
//                     } else {
//                         // Reset the display for both images
//                         document.querySelector(".authorization-tick").style.display =
//                             "none";
//                         document.querySelector(".authorization-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".authorization-circle").style.display =
//                             "block";
//                     }
//                 }

//                 var inputs = document.querySelectorAll(
//                     "#authorizationparentsign input"
//                 );

//                 inputs.forEach(function (input) {
//                     if (input.type === "checkbox" || input.type === "radio") {
//                         if (input.checked) {
//                             input.classList.remove("input-success");
//                             input.classList.remove("input-error");
//                         } 
//                     } else {
//                         if (input.value.trim() === "") {
//                             input.classList.add("input-error"); // Add a class to highlight empty input
//                             input.classList.remove("input-success");
//                         } else {
//                             input.classList.add("input-success");
//                             input.classList.remove("input-error"); // Remove error class if input is not empty
//                         }
//                     }
//                 });
//                 //authorization form admin restriction
//                 if (document.getElementById("authorizationadminsign") != null) {
//                     if (
//                         localStorage.getItem("logged_in_email") !==
//                         "goddard01arjava@gmail.com"
//                     ) {
//                         let adminFinalAgreement = document.getElementById(
//                             "achAdminFinalAgreement"
//                         );
//                         if(adminFinalAgreement){
//                         adminFinalAgreement.classList.add("disabled");
//                         }
//                         // Reset the display for both images
//                         document.querySelector(
//                             ".authorizationadminsign-tick"
//                         ).style.display = "none";
//                         document.querySelector(
//                             ".authorizationadminsign-circle"
//                         ).style.display = "none";
//                         // Update the display for the clicked card
//                         document.querySelector(
//                             ".authorizationadminsign-circle"
//                         ).style.display = "block";
//                     } else {
//                         let adminFinalAgreement = document.getElementById(
//                             "achAdminFinalAgreement"
//                         );
//                         if(adminFinalAgreement){
//                         adminFinalAgreement.classList.remove("disabled");
//                         }
//                     }
//                 }

//                 //parent Handbook form
//                 let welcome_goddard_agreement= false;
//                 let parentHandBook= false;
//                 if (document.getElementById("volumeone") != null) {
//                     if (response.welcome_goddard_agreement == "on") {
//                         document.getElementById("welcome_goddard_agreement").checked = true;
//                     } else {
//                         document.getElementById(
//                             "welcome_goddard_agreement"
//                         ).checked = false;
//                     }

//                     if (response.welcome_goddard_agreement) {
//                         // Reset the display for both images
//                         document.querySelector(".goddard-tick").style.display = "none";
//                         document.querySelector(".goddard-circle").style.display = "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".goddard-tick").style.display = "block";
//                         welcome_goddard_agreement = true;
//                     } else {
//                         // Reset the display for both images
//                         document.querySelector(".goddard-tick").style.display = "none";
//                         document.querySelector(".goddard-circle").style.display = "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".goddard-circle").style.display = "block";
//                         welcome_goddard_agreement = false;
//                     }

//                     let mission_statement_agreement= false;
//                     if (response.mission_statement_agreement == "on") {
//                         document.getElementById(
//                             "mission_statement_agreement"
//                         ).checked = true;
//                     } else {
//                         document.getElementById(
//                             "mission_statement_agreement"
//                         ).checked = false;
//                     }
//                     if (response.mission_statement_agreement) {
//                         // Reset the display for both images
//                         document.querySelector(".mission-tick").style.display = "none";
//                         document.querySelector(".mission-circle").style.display = "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".mission-tick").style.display = "block";
//                         mission_statement_agreement = true;
//                     } else {
//                         // Reset the display for both images
//                         document.querySelector(".mission-tick").style.display = "none";
//                         document.querySelector(".mission-circle").style.display = "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".mission-circle").style.display = "block";
//                         mission_statement_agreement = false;
//                     }

//                     let general_information_agreement= false;
//                     if (response.general_information_agreement == "on") {
//                         document.getElementById(
//                             "general_information_agreement"
//                         ).checked = true;
//                     } else {
//                         document.getElementById(
//                             "general_information_agreement"
//                         ).checked = false;
//                     }
//                     if (response.general_information_agreement) {
//                         // Reset the display for both images
//                         document.querySelector(".generalinfo-tick").style.display = "none";
//                         document.querySelector(".generalinfo-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".generalinfo-tick").style.display = "block";
//                         general_information_agreement = true;
//                     } else {
//                         // Reset the display for both images
//                         document.querySelector(".generalinfo-tick").style.display = "none";
//                         document.querySelector(".generalinfo-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".generalinfo-circle").style.display =
//                             "block";
//                         general_information_agreement = false;
//                     }

//                     let medical_care_provider_agreement= false;
//                     if (response.medical_care_provider_agreement == "on") {
//                         document.getElementById(
//                             "medical_care_provider_agreement"
//                         ).checked = true;
//                     } else {
//                         document.getElementById(
//                             "medical_care_provider_agreement"
//                         ).checked = false;
//                     }
//                     if (response.medical_care_provider_agreement) {
//                         // Reset the display for both images
//                         document.querySelector(".statement-tick").style.display = "none";
//                         document.querySelector(".statement-circle").style.display = "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".statement-tick").style.display = "block";
//                         medical_care_provider_agreement = true;
//                     } else {
//                         // Reset the display for both images
//                         document.querySelector(".statement-tick").style.display = "none";
//                         document.querySelector(".statement-circle").style.display = "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".statement-circle").style.display = "block";
//                         medical_care_provider_agreement = false;
//                     }

//                     let parent_access_agreement= false;
//                     if (response.parent_access_agreement == "on") {
//                         document.getElementById("parent_access_agreement").checked = true;
//                     } else {
//                         document.getElementById("parent_access_agreement").checked = false;
//                     }
//                     if (response.parent_access_agreement) {
//                         // Reset the display for both images
//                         document.querySelector(".parentaccess-tick").style.display = "none";
//                         document.querySelector(".parentaccess-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".parentaccess-tick").style.display =
//                             "block";
//                         parent_access_agreement = true;
//                     } else {
//                         // Reset the display for both images
//                         document.querySelector(".parentaccess-tick").style.display = "none";
//                         document.querySelector(".parentaccess-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".parentaccess-circle").style.display =
//                             "block";
//                         parent_access_agreement = false;
//                     }
//                     let release_of_children_agreement= false;
//                     if (response.release_of_children_agreement == "on") {
//                         document.getElementById(
//                             "release_of_children_agreement"
//                         ).checked = true;
//                     } else {
//                         document.getElementById(
//                             "release_of_children_agreement"
//                         ).checked = false;
//                     }
//                     if (response.release_of_children_agreement) {
//                         // Reset the display for both images
//                         document.querySelector(".releasechild-tick").style.display = "none";
//                         document.querySelector(".releasechild-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".releasechild-tick").style.display =
//                             "block";
//                         release_of_children_agreement = true;
//                     } else {
//                         // Reset the display for both images
//                         document.querySelector(".releasechild-tick").style.display = "none";
//                         document.querySelector(".releasechild-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".releasechild-circle").style.display =
//                             "block";
//                         release_of_children_agreement = false;
//                     }

//                     let registration_fees_agreement= false;
//                     if (response.registration_fees_agreement == "on") {
//                         document.getElementById(
//                             "registration_fees_agreement"
//                         ).checked = true;
//                     } else {
//                         document.getElementById(
//                             "registration_fees_agreement"
//                         ).checked = false;
//                     }
//                     if (response.registration_fees_agreement) {
//                         // Reset the display for both images
//                         document.querySelector(".fees-tick").style.display = "none";
//                         document.querySelector(".fees-circle").style.display = "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".fees-tick").style.display = "block";
//                         registration_fees_agreement = true;
//                     } else {
//                         // Reset the display for both images
//                         document.querySelector(".fees-tick").style.display = "none";
//                         document.querySelector(".fees-circle").style.display = "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".fees-circle").style.display = "block";
//                         registration_fees_agreement = false;
//                     }

//                     let outside_engagements_agreement= false;
//                     if (response.outside_engagements_agreement == "on") {
//                         document.getElementById(
//                             "outside_engagements_agreement"
//                         ).checked = true;
//                     } else {
//                         document.getElementById(
//                             "outside_engagements_agreement"
//                         ).checked = false;
//                     }
//                     if (response.outside_engagements_agreement) {
//                         // Reset the display for both images
//                         document.querySelector(".outsideengagement-tick").style.display =
//                             "none";
//                         document.querySelector(".outsideengagement-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".outsideengagement-tick").style.display =
//                             "block";
//                         outside_engagements_agreement = true;
//                     } else {
//                         // Reset the display for both images
//                         document.querySelector(".outsideengagement-tick").style.display =
//                             "none";
//                         document.querySelector(".outsideengagement-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".outsideengagement-circle").style.display =
//                             "block";
//                         outside_engagements_agreement = false;
//                     }

//                     let health_policies_agreement= false;
//                     if (response.health_policies_agreement == "on") {
//                         document.getElementById("health_policies_agreement").checked = true;
//                     } else {
//                         document.getElementById(
//                             "health_policies_agreement"
//                         ).checked = false;
//                     }
//                     if (response.health_policies_agreement) {
//                         // Reset the display for both images
//                         document.querySelector(".healthpolicies-tick").style.display =
//                             "none";
//                         document.querySelector(".healthpolicies-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".healthpolicies-tick").style.display =
//                             "block";
//                         health_policies_agreement = true;
//                     } else {
//                         // Reset the display for both images
//                         document.querySelector(".healthpolicies-tick").style.display =
//                             "none";
//                         document.querySelector(".healthpolicies-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".healthpolicies-circle").style.display =
//                             "block";
//                         health_policies_agreement = false;
//                     }

//                     let medication_procedures_agreement= false;
//                     if (response.medication_procedures_agreement == "on") {
//                         document.getElementById(
//                             "medication_procedures_agreement"
//                         ).checked = true;
//                     } else {
//                         document.getElementById(
//                             "medication_procedures_agreement"
//                         ).checked = false;
//                     }
//                     if (response.medication_procedures_agreement) {
//                         // Reset the display for both images
//                         document.querySelector(".medicationprocedures-tick").style.display =
//                             "none";
//                         document.querySelector(
//                             ".medicationprocedures-circle"
//                         ).style.display = "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".medicationprocedures-tick").style.display =
//                             "block";
//                         medication_procedures_agreement = true;
//                     } else {
//                         // Reset the display for both images
//                         document.querySelector(".medicationprocedures-tick").style.display =
//                             "none";
//                         document.querySelector(
//                             ".medicationprocedures-circle"
//                         ).style.display = "none";
//                         // Update the display for the clicked card
//                         document.querySelector(
//                             ".medicationprocedures-circle"
//                         ).style.display = "block";
//                         medication_procedures_agreement = false;
//                     }

//                     let bring_to_school_agreement= false;
//                     if (response.bring_to_school_agreement == "on") {
//                         document.getElementById("bring_to_school_agreement").checked = true;
//                     } else {
//                         document.getElementById(
//                             "bring_to_school_agreement"
//                         ).checked = false;
//                     }
//                     if (response.bring_to_school_agreement) {
//                         // Reset the display for both images
//                         document.querySelector(".toysfromhome-tick").style.display = "none";
//                         document.querySelector(".toysfromhome-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".toysfromhome-tick").style.display =
//                             "block";
//                         bring_to_school_agreement = true;
//                     } else {
//                         // Reset the display for both images
//                         document.querySelector(".toysfromhome-tick").style.display = "none";
//                         document.querySelector(".toysfromhome-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".toysfromhome-circle").style.display =
//                             "block";
//                         bring_to_school_agreement = false;
//                     }

//                     let rest_time_agreement= false;
//                     if (response.rest_time_agreement == "on") {
//                         document.getElementById("rest_time_agreement").checked = true;
//                     } else {
//                         document.getElementById("rest_time_agreement").checked = false;
//                     }
//                     if (response.rest_time_agreement) {
//                         // Reset the display for both images
//                         document.querySelector(".restmealssnacks-tick").style.display =
//                             "none";
//                         document.querySelector(".restmealssnacks-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".restmealssnacks-tick").style.display =
//                             "block";
//                         rest_time_agreement = true;
//                     } else {
//                         // Reset the display for both images
//                         document.querySelector(".restmealssnacks-tick").style.display =
//                             "none";
//                         document.querySelector(".restmealssnacks-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".restmealssnacks-circle").style.display =
//                             "block";
//                         rest_time_agreement = false;
//                     }

//                     let training_philosophy_agreement= false;
//                     if (response.training_philosophy_agreement == "on") {
//                         document.getElementById(
//                             "training_philosophy_agreement"
//                         ).checked = true;
//                     } else {
//                         document.getElementById(
//                             "training_philosophy_agreement"
//                         ).checked = false;
//                     }
//                     if (response.training_philosophy_agreement) {
//                         // Reset the display for both images
//                         document.querySelector(".transition-tick").style.display = "none";
//                         document.querySelector(".transition-circle").style.display = "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".transition-tick").style.display = "block";
//                         training_philosophy_agreement = true;
//                     } else {
//                         // Reset the display for both images
//                         document.querySelector(".transition-tick").style.display = "none";
//                         document.querySelector(".transition-circle").style.display = "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".transition-circle").style.display =
//                             "block";
//                         training_philosophy_agreement = false;
//                     }

//                     let affiliation_policy_agreement= false;
//                     if (response.affiliation_policy_agreement == "on") {
//                         document.getElementById(
//                             "affiliation_policy_agreement"
//                         ).checked = true;
//                     } else {
//                         document.getElementById(
//                             "affiliation_policy_agreement"
//                         ).checked = false;
//                     }
//                     if (response.affiliation_policy_agreement) {
//                         // Reset the display for both images
//                         document.querySelector(".emergencyclosings-tick").style.display =
//                             "none";
//                         document.querySelector(".emergencyclosings-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".emergencyclosings-tick").style.display =
//                             "block";
//                         affiliation_policy_agreement = true;
//                     } else {
//                         // Reset the display for both images
//                         document.querySelector(".emergencyclosings-tick").style.display =
//                             "none";
//                         document.querySelector(".emergencyclosings-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".emergencyclosings-circle").style.display =
//                             "block";
//                         affiliation_policy_agreement = false;
//                     }

//                     let security_issue_agreement= false;
//                     if (response.security_issue_agreement == "on") {
//                         document.getElementById("security_issue_agreement").checked = true;
//                     } else {
//                         document.getElementById("security_issue_agreement").checked = false;
//                     }
//                     if (response.security_issue_agreement) {
//                         // Reset the display for both images
//                         document.querySelector(".websitesblogs-tick").style.display =
//                             "none";
//                         document.querySelector(".websitesblogs-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".websitesblogs-tick").style.display =
//                             "block";
//                         security_issue_agreement = true;
//                     } else {
//                         // Reset the display for both images
//                         document.querySelector(".websitesblogs-tick").style.display =
//                             "none";
//                         document.querySelector(".websitesblogs-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".websitesblogs-circle").style.display =
//                             "block";
//                         security_issue_agreement = false;
//                     }

//                     let expulsion_policy_agreement= false;
//                     if (response.expulsion_policy_agreement == "on") {
//                         document.getElementById(
//                             "expulsion_policy_agreement"
//                         ).checked = true;
//                     } else {
//                         document.getElementById(
//                             "expulsion_policy_agreement"
//                         ).checked = false;
//                     }
//                     if (response.expulsion_policy_agreement) {
//                         // Reset the display for both images
//                         document.querySelector(".expulsionpolicy-tick").style.display =
//                             "none";
//                         document.querySelector(".expulsionpolicy-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".expulsionpolicy-tick").style.display =
//                             "block";
//                         expulsion_policy_agreement = true;
//                     } else {
//                         // Reset the display for both images
//                         document.querySelector(".expulsionpolicy-tick").style.display =
//                             "none";
//                         document.querySelector(".expulsionpolicy-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".expulsionpolicy-circle").style.display =
//                             "block";
//                         expulsion_policy_agreement = false;
//                     }

//                     let addressing_individual_child_agreement= false;
//                     if (response.addressing_individual_child_agreement == "on") {
//                         document.getElementById(
//                             "addressing_individual_child_agreement"
//                         ).checked = true;
//                     } else {
//                         document.getElementById(
//                             "addressing_individual_child_agreement"
//                         ).checked = false;
//                     }
//                     if (response.addressing_individual_child_agreement) {
//                         // Reset the display for both images
//                         document.querySelector(".addressing-tick").style.display = "none";
//                         document.querySelector(".addressing-circle").style.display = "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".addressing-tick").style.display = "block";
//                         addressing_individual_child_agreement = true;
//                     } else {
//                         // Reset the display for both images
//                         document.querySelector(".addressing-tick").style.display = "none";
//                         document.querySelector(".addressing-circle").style.display = "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".addressing-circle").style.display =
//                             "block";
//                         addressing_individual_child_agreement = false;
//                     }

//                     let finalword_agreement= false;
//                     if (response.finalword_agreement == "on") {
//                         document.getElementById("finalword_agreement").checked = true;
//                     } else {
//                         document.getElementById("finalword_agreement").checked = false;
//                     }
//                     if (response.finalword_agreement) {
//                         // Reset the display for both images
//                         document.querySelector(".finalword-tick").style.display = "none";
//                         document.querySelector(".finalword-circle").style.display = "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".finalword-tick").style.display = "block";
//                         finalword_agreement = true;
//                     } else {
//                         // Reset the display for both images
//                         document.querySelector(".finalword-tick").style.display = "none";
//                         document.querySelector(".finalword-circle").style.display = "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".finalword-circle").style.display = "block";
//                         finalword_agreement = false;
//                     }

//                     if (
//                         welcome_goddard_agreement == true &&
//                         mission_statement_agreement == true &&
//                         general_information_agreement == true &&
//                         medical_care_provider_agreement == true &&
//                         parent_access_agreement == true &&
//                         release_of_children_agreement == true &&
//                         registration_fees_agreement == true &&
//                         outside_engagements_agreement == true &&
//                         health_policies_agreement == true &&
//                         medication_procedures_agreement == true &&
//                         bring_to_school_agreement == true &&
//                         rest_time_agreement == true &&
//                         training_philosophy_agreement == true &&
//                         affiliation_policy_agreement == true &&
//                         security_issue_agreement == true &&
//                         expulsion_policy_agreement == true &&
//                         addressing_individual_child_agreement == true &&
//                         finalword_agreement == true
//                     ) {
//                         let handbookFinalAgreement = document.getElementById(
//                             "handbookFinalAgreement"
//                         );
//                         if(handbookFinalAgreement){
//                         handbookFinalAgreement.classList.remove("disabled");
//                         }
//                         // Reset the display for both images
//                         document.querySelector(".goddardschool1-tick").style.display =
//                             "none";
//                         document.querySelector(".goddardschool1-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".goddardschool1-tick").style.display =
//                             "block";
//                         parentHandBook = true;
//                     } else {
//                         let handbookFinalAgreement = document.getElementById(
//                             "handbookFinalAgreement"
//                         );
//                         if(handbookFinalAgreement){
//                         handbookFinalAgreement.classList.add("disabled");
//                         }
//                         // Reset the display for both images
//                         document.querySelector(".goddardschool1-tick").style.display =
//                             "none";
//                         document.querySelector(".goddardschool1-circle").style.display =
//                             "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".goddardschool1-circle").style.display =
//                             "block";
//                         parentHandBook = false;
//                     }
//                 }
//                 var inputs = document.querySelectorAll("#volumeone input");

//                 inputs.forEach(function (input) {
//                     if (input.type === "checkbox" || input.type === "radio") {
//                         if (input.checked) {
//                             input.classList.remove("input-success");
//                             input.classList.remove("input-error");
//                         } 
//                     } else {
//                         if (input.value.trim() === "") {
//                             input.classList.add("input-error"); // Add a class to highlight empty input
//                             input.classList.remove("input-success");
//                         } else {
//                             input.classList.add("input-success");
//                             input.classList.remove("input-error"); // Remove error class if input is not empty
//                         }
//                     }
//                 });
//                 if (document.getElementById("parentsignaturehandbook") != null) {
//                     if (typeof response.parent_sign_handbook !== "undefined") {
//                         document.getElementsByName("parent_sign_handbook")[0].value =
//                             response.parent_sign_handbook;
//                     }

//                     if (response.parent_sign_date_handbook === null || response.parent_sign_date_handbook === undefined) {
//                         document.getElementsByName("parent_sign_date_handbook")[0].value = new Date().toISOString().split('T')[0];
//                     } else {
//                         document.getElementsByName("parent_sign_date_handbook")[0].value = response.parent_sign_date_handbook;
//                     }

//                     let parenthandbookparentsign= false;
//                     if (
//                         response.parent_sign_handbook &&
//                         response.parent_sign_date_handbook
//                     ) {
//                         // Reset the display for both images
//                         document.querySelector(".childparenthandbook-tick").style.display =
//                             "none";
//                         document.querySelector(
//                             ".childparenthandbook-circle"
//                         ).style.display = "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".childparenthandbook-tick").style.display =
//                             "block";
//                         parenthandbookparentsign = true;
//                     } else {
//                         // Reset the display for both images
//                         document.querySelector(".childparenthandbook-tick").style.display =
//                             "none";
//                         document.querySelector(
//                             ".childparenthandbook-circle"
//                         ).style.display = "none";
//                         // Update the display for the clicked card
//                         document.querySelector(
//                             ".childparenthandbook-circle"
//                         ).style.display = "block";
//                         parenthandbookparentsign = false;
//                     }
//                     if (parentHandBook == true && parenthandbookparentsign == true) {
//                         // Reset the display for both images
//                         document.querySelector(".handbook-tick").style.display = "none";
//                         document.querySelector(".handbook-circle").style.display = "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".handbook-tick").style.display = "block";
//                     } else {
//                         // Reset the display for both images
//                         document.querySelector(".handbook-tick").style.display = "none";
//                         document.querySelector(".handbook-circle").style.display = "none";
//                         // Update the display for the clicked card
//                         document.querySelector(".handbook-circle").style.display = "block";
//                     }
//                 }

//                 var inputs = document.querySelectorAll(
//                     "#parentsignaturehandbook input"
//                 );

//                 inputs.forEach(function (input) {
//                     if (input.type === "checkbox" || input.type === "radio") {
//                         if (input.checked) {
//                             input.classList.remove("input-success");
//                             input.classList.remove("input-error");
//                         } 
//                     } else {
//                         if (input.value.trim() === "") {
//                             input.classList.add("input-error"); // Add a class to highlight empty input
//                             input.classList.remove("input-success");
//                         } else {
//                             input.classList.add("input-success");
//                             input.classList.remove("input-error"); // Remove error class if input is not empty
//                         }
//                     }
//                 });

//                 //parent handbook form admin restriction
//                 if (document.getElementById("adminsignaturehandbook") != null) {
//                     if (
//                         localStorage.getItem("logged_in_email") !==
//                         "goddard01arjava@gmail.com"
//                     ) {
//                         let adminFinalAgreement = document.getElementById(
//                             "handbookAdminFinalAgreement"
//                         );
//                         if(adminFinalAgreement){
//                         adminFinalAgreement.classList.add("disabled");
//                         }
//                         // Reset the display for both images
//                         document.querySelector(".parentHandbookadmin-tick").style.display =
//                             "none";
//                         document.querySelector(
//                             ".parentHandbookadmin-circle"
//                         ).style.display = "none";
//                         // Update the display for the clicked card
//                         document.querySelector(
//                             ".parentHandbookadmin-circle"
//                         ).style.display = "block";
//                     } else {
//                         let adminFinalAgreement = document.getElementById(
//                             "handbookAdminFinalAgreement"
//                         );
//                         if(adminFinalAgreement){
//                         adminFinalAgreement.classList.remove("disabled");
//                         console.log("else book");}
//                     }
//                 }
//                 //to set all response value into local storage variable
//                 window.localStorage.setItem("responseData", JSON.stringify(response));
//             },
//         });
//     }
//     // spinner.style.display = "none"; // Hide spinner
// }

var popoverTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="popover"]')
);

var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl);
});

$(document).ready(function () {
    if (!isAuthenticated()) {
        window.location.href = "login.html";
    } else {
        let editID = window.location.search.slice(4);
        // checks the parent info table to see if parent entry is present
        checkParentAuthentication(editID, function () {
            responseToAuthenticationCheck();
            // Checks the admission info table
            getAllInfo(editID, function () {
                welcomeText();
            });
        });
        $("#basic_child_button").on("click", function (e) {
            e.preventDefault(); // Prevent the default form submission
            submitForm();
        });
    }
});