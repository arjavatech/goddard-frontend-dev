import { isAuthenticated } from "./authentication_verify.js";

let child_response = null;

function clearLocalStorageExcept(keysToKeep) {
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key) && !keysToKeep.includes(key)) {
            localStorage.removeItem(key);
        }
    }
}

function checkParentAuthentication(editID, callback) {
    const logged_in_email = localStorage.getItem('logged_in_email');
    // const is_admin = localStorage.getItem('is_admin');
    let url;
    if (editID == logged_in_email || logged_in_email == 'goddard01arjava@gmail.com' || editID == '') {
        // (stop user to see other kids || check admin login || default parent login)
        if (editID != '') {
            url = `https://ijz2b76zn8.execute-api.ap-south-1.amazonaws.com/test/admission_child_personal/parent_email/${editID}`
        } else {
            url = `https://ijz2b76zn8.execute-api.ap-south-1.amazonaws.com/test/admission_child_personal/parent_email/${logged_in_email}`
        }
        $.ajax({
            url: url,
            type: 'get',
            success: function (response) {
                let keysToKeep = ['logged_in_email'];
                clearLocalStorageExcept(keysToKeep);
                // localStorage.clear()
                if (response['parent_name']) {
                    localStorage.setItem('parent_name', response['parent_name'])
                    //    localStorage.setItem('parent_id', response[0].id)
                }
                if (typeof callback === 'function') {
                    callback();
                }
            }
        });
    } else {
        window.location.href = "login.html";
    }


}

function getAllInfo(editID, callback) {
    const logged_in_email = localStorage.getItem('logged_in_email');
    let url;
    if (editID != '') {
        url = `https://ijz2b76zn8.execute-api.ap-south-1.amazonaws.com/test/admission_child_personal/parent_email/${editID}`
    } else {
        url = `https://ijz2b76zn8.execute-api.ap-south-1.amazonaws.com/test/admission_child_personal/parent_email/${logged_in_email}`
    }

    $.ajax({
        url: url,
        type: 'get',
        success: function (response) {
            console.log(response);
            // localStorage.clear()
            if (response['children']) {
                // Iterate through all the child and store the response
                child_response = response['children'];
                localStorage.setItem('number_of_children', response['children'].length.toString());
            }
            if (typeof callback === 'function') {
                callback();
            }
        }
    })
}

function responseToAuthenticationCheck() {
    const parentName = localStorage.getItem('logged_in_email');
    if (parentName !== 'undefined' && parentName !== null) {
        document.body.style.visibility = 'visible';
    } else {
        document.getElementById('welcomeText').innerHTML = 'Parent not found';
        window.alert("Parent Not found");
        window.history.back();
    }
}


function loadDynamicCards() {
    let responseSize = parseInt(localStorage.getItem('number_of_children'), 10);
    console.log(responseSize);
    let parentContainer = document.getElementById('dynamicChildCards');
    let putcallId = sessionStorage.getItem('putcallId');

    for (let i = 0; i < responseSize; i++) {
        let on_process = child_response[i].on_process;

        let div = document.createElement('li');
        div.setAttribute('class', 'nav-item');

        let anchor = document.createElement('a');
        anchor.setAttribute('class', 'nav-link');
        anchor.setAttribute('data-child-id', child_response[i].child_id);

        let card = document.createElement('div');
        card.setAttribute('style', 'height:40px');

        anchor.addEventListener('click', function () {
            let allTabs = document.querySelectorAll('.nav-link');
            allTabs.forEach(tab => tab.classList.remove('active'));
            anchor.classList.add('active');

            const selectedChildName = child_response[i].child_first_name;
            const selectedChildId = child_response[i].child_id;
            localStorage.setItem('child_name', selectedChildName);
            localStorage.setItem('child_id', selectedChildId);
            checking(selectedChildId);
        });

        let cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        let childName = document.createElement('h6');
        childName.id = child_response[i].child_id;
        childName.classList.add('text-center', 'dashboard_card_text', 'h6');
        childName.innerHTML = child_response[i].child_first_name;

        cardBody.appendChild(childName);
        card.appendChild(cardBody);
        anchor.appendChild(card);
        div.appendChild(anchor);
        parentContainer.appendChild(div);
    }

    if (!putcallId) {
        if (responseSize > 0) {
            let firstAnchor = parentContainer.querySelector('a.nav-link');
            if (firstAnchor) {
                firstAnchor.classList.add('active');
                const selectedChildName = child_response[0].child_first_name;
                const selectedChildId = child_response[0].child_id;
                localStorage.setItem('child_name', selectedChildName);
                localStorage.setItem('child_id', selectedChildId);
                checking(selectedChildId);
            }
        }
    } else {
        let selectedAnchor = parentContainer.querySelector(`a.nav-link[data-child-id='${putcallId}']`);
        if (selectedAnchor) {
            selectedAnchor.classList.add('active');
        }
        localStorage.setItem('child_id', putcallId);
        checking(putcallId);
    }
}

function welcomeText() {
    const parentName = localStorage.getItem('parent_name');

    if (localStorage.getItem('logged_in_email') == 'goddard01arjava@gmail.com') {
        document.getElementById('welcomeText').innerHTML = 'Welcome Admin';
        loadDynamicCards();
    } else {
        document.getElementById('welcomeText').innerHTML = 'Welcome ' + parentName;
        loadDynamicCards();
    }
    // createAddChildButton();
    // additionalHtmlContainer.style.display = 'block';
}

function checking(editID) {
    window.localStorage.setItem('editChildId', editID);
    console.log(editID);
    // var tab_content = document.querySelector(".tab-content");
    // tab_content.reset();
    $.ajax({
        url: `https://ijz2b76zn8.execute-api.ap-south-1.amazonaws.com/test/admission_child_personal/incomplete_form_status/${editID}`,
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            console.log(response);
            let mainTopics = [];
            // iterate over the values of incompletedformstatus
            for (let value of Object.values(response['InCompletedFormStatus'])) {
                mainTopics.push(value);
            }
            // sort the array alphabetically
            mainTopics.sort();
            document.getElementById('admissionFormMenu').innerHTML = '';
            document.getElementById('authorizationMenu').innerHTML = '';
            document.getElementById('enrollmentMenu').innerHTML = '';
            document.getElementById('parentHandbookMenu').innerHTML = '';
            document.getElementById('admissionforms').innerHTML = '';
            document.getElementById('authorization').innerHTML = '';
            document.getElementById('enrollmentagreement').innerHTML = '';
            document.getElementById('parenthandbook').innerHTML = '';

            for (let i = 0; i < mainTopics.length; i++) {
                let mainTopic = mainTopics[i];
                let trimValues = mainTopic.replace(/\s+/g, '_').toLowerCase();

                // $.get(trimValues + "ListItem.html", function(data) {
                //     $("#menu").append(data);
                // });

                if (trimValues == 'admission_form' || trimValues == 'authorization' ||
                    trimValues == 'enrollment_agreement' || trimValues == 'parent_handbook') {
                    $(`.menu.${trimValues}`).load(trimValues + "_list_item.html");

                }

                if (trimValues == 'admission_form' || trimValues == 'authorization' ||
                    trimValues == 'enrollment_agreement' || trimValues == 'parent_handbook') {
                    $(`.tab-content.${trimValues}`).load(trimValues + ".html");
                    $('.svg').append('<svg width="12px" height="10px" viewbox="0 0 12 10"><polyline points="1.5 6 4.5 9 10.5 1"></polyline></svg>');
                }
            }
        }
    });
    let childName = localStorage.getItem('child_name');
    document.getElementById('childName').innerHTML = childName;
    // Find the anchor tag with class "nav-link"
    var link = document.querySelector(".completedforms");
    let year = new Date().getFullYear();
    // Add click event listener
    link.addEventListener("click", function (event) {
        // Prevent the default behavior of the anchor tag
        event.preventDefault();
        // parentDashBoardDetails(editID,year);
    });

    $.fn.dataTable.ext.errMode = 'none';
    // Clearing the DataTable
    // clearDataTable();

    //destroy datatable
    $('#example').DataTable().destroy();

    $('#example').on('click', '.download-btn', function () {
        let url = $(this).data('url');
        console.log(url);
        let fileName = $(this).data('name');
        console.log(fileName);
        let editID = extractEditIDFromURL(url);

        localStorage.setItem('form_name', fileName);
        fetch(url)
            .then(response => response.text())
            .then(text => {
                let hiddenDiv = document.createElement('div');
                hiddenDiv.id = 'formContent';
                hiddenDiv.style.display = 'none';
                hiddenDiv.innerHTML = text;
                document.body.appendChild(hiddenDiv);

                populateFormData(editID, fileName).then(() => {
                    setTimeout(() => {
                        generatePDFContent().then(doc => {
                            doc.save(fileName);
                            document.body.removeChild(hiddenDiv);
                            // window.location.reload();
                        }).catch(error => {
                            document.body.removeChild(hiddenDiv);
                        });
                    }, 1000); // Adjust timeout as needed
                }).catch(error => {
                    document.body.removeChild(hiddenDiv);
                });
            })
            .catch(error => {
                console.error('Error downloading the document:', error);
            });
    });

    function generatePDFContent() {
        return new Promise((resolve) => {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF('p', 'mm', [1500, 1400]);
            let formContent = document.querySelector('#formContent');
            formContent.style.display = 'block';

            formContent.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                checkbox.defaultChecked = checkbox.checked;
            });

            doc.html(formContent, {
                callback: function () {
                    formContent.style.display = 'none';
                    resolve(doc);
                },
                x: 12,
                y: 12
            });
        });
    }

    $('#example').on('click', '.print-btn', function () {
        let url = $(this).data('url');
        let formName = $(this).data('name');
        let editID = extractEditIDFromURL(url);
        localStorage.setItem('form_name', formName);

        console.log('URL:', url);
        console.log('Form Name:', formName);
        console.log('Edit ID:', editID);

        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.text();
            })
            .then(text => {
                console.log('Fetched text:', text);
                let hiddenDiv = document.createElement('div');
                hiddenDiv.id = 'formContent';
                hiddenDiv.style.display = 'none';
                hiddenDiv.innerHTML = text;
                document.body.appendChild(hiddenDiv);

                return populateFormData(editID, formName);
            })
            .then(() => {
                let hiddenDiv = document.getElementById('formContent');
                if (hiddenDiv) {
                    console.log('Form content div found:', hiddenDiv);
                    printContent(hiddenDiv);
                } else {
                    throw new Error('Form content div not found');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                let hiddenDiv = document.getElementById('formContent');
                if (hiddenDiv) {
                    document.body.removeChild(hiddenDiv);
                }
            });
    });

    function printContent(hiddenDiv) {
        console.log('Hidden div to print:', hiddenDiv);
        let printWindow = window.open('', '', 'height=1400,width=1500');
        let formContent = hiddenDiv.innerHTML;

        printWindow.document.write('<html><head><title>Print Form</title>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(formContent);
        printWindow.document.write('</body></html>');
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



    function extractEditIDFromURL(url) {
        let params = new URLSearchParams(url.split('?')[1]);
        let editID = params.get('id');
        return editID;
    }

    function populateFormData(editID, formName) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `https://ijz2b76zn8.execute-api.ap-south-1.amazonaws.com/test/child_all_details/fetch/${editID}`,
                type: 'GET',
                success: function (response) {
                    console.log(response);
                    console.log(response.primary_parent_email);
                    let form = document.querySelector('#formContent');
                    if (!form) {
                        reject('Form content not found');
                        return;
                    }

                    if (formName === 'Authorization.pdf') {
                        const authFields = ['bank_routing', 'bank_account', 'driver_license', 'state', 'i', 'parent_sign_ach', 'parent_sign_date_ach'];

                        authFields.forEach(field => {
                            let element = form.querySelector(`[name='${field}']`);
                            if (element) {
                                element.setAttribute('value', response[field]);
                            }
                        });
                    } else if (formName === 'Enrollment Agreement.pdf') {
                        const fields = [
                            'point_one_field_one', 'point_one_field_two', 'point_one_field_three',
                            'point_two_initial_here', 'point_three_initial_here', 'point_four_initial_here',
                            'point_five_initial_here', 'point_six_initial_here', 'point_seven_initial_here',
                            'point_eight_initial_here', 'point_nine_initial_here', 'point_ten_initial_here',
                            'point_eleven_initial_here', 'point_twelve_initial_here', 'point_thirteen_initial_here',
                            'point_fourteen_initial_here', 'point_fifteen_initial_here', 'point_sixteen_initial_here',
                            'point_seventeen_initial_here', 'point_eighteen_initial_here', 'point_nineteen_initial_here',
                            'parent_sign_enroll', 'parent_sign_date_enroll', 'preferred_start_date', 'preferred_schedule'
                        ];

                        fields.forEach(field => {
                            if (response[field] !== undefined) {
                                let element = form.querySelector(`input[name='${field}']`);
                                if (element) {
                                    element.setAttribute('value', response[field]);
                                }
                            }
                        });
                        // Checkbox handling
                        const checkboxFields = [
                            'full_day', 'half_day',
                        ];

                        checkboxFields.forEach(field => {
                            let element = form.querySelector(`[name='${field}']`);
                            if (element && response[field] == 1) {
                                element.setAttribute('checked', true);
                            }
                        });
                    } else if (formName === 'Parent HandBook.pdf') {
                        const checkboxFields = [
                            'welcome_goddard_agreement', 'mission_statement_agreement', 'general_information_agreement',
                            'medical_care_provider_agreement', 'parent_access_agreement', 'release_of_children_agreement',
                            'registration_fees_agreement', 'outside_engagements_agreement', 'health_policies_agreement',
                            'medication_procedures_agreement', 'bring_to_school_agreement', 'rest_time_agreement',
                            'training_philosophy_agreement', 'affiliation_policy_agreement', 'security_issue_agreement',
                            'expulsion_policy_agreement', 'addressing_individual_child_agreement', 'finalword_agreement'
                        ];

                        checkboxFields.forEach(field => {
                            if (response.parent_hand_book[field] === 1) {
                                let element = form.querySelector(`input[name='${field}']`);
                                if (element) {
                                    element.setAttribute('checked', true);
                                }
                            } else {
                                let element = form.querySelector(`input[name='${field}']`);
                                if (element) {
                                    element.setAttribute('checked', false);
                                }
                            }
                        });

                        const parentHandBookFields = ['parent_sign_handbook', 'parent_sign_date_handbook'];

                        parentHandBookFields.forEach(field => {
                            if (response.parent_hand_book[field] !== undefined) {
                                let element = form.querySelector(`input[name='${field}']`);
                                if (element) {
                                    element.setAttribute('value', response.parent_hand_book[field]);
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
                        //         'language_used_at_home', 'changes_at_home_situation', 'educational_expectations_of_child', 'other_important_family_members',
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
                        //         'do_you_agree_this_health_policies','outside_waiver_parent_sign_outside_engagements_waiver'
                        //     ];

                        //     checkboxFields.forEach(field => {
                        //         let element = form.querySelector(`[name='${field}']`);
                        //         if (element && response[field] == 1) {
                        //             element.setAttribute('checked', true);
                        //         }
                        //     });

                        //     inputFields.forEach(field => {
                        //         if (response[field] === "Yes") {
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
                    } else if (formName === 'Admission Forms.pdf') {
                        const inputFields = [
                            'child_first_name', 'child_last_name', 'nick_name', 'dob', 'gender', 'do_relevant_custody_papers_apply', 'primary_language', 'school_age_child_school',
                            'parent_name', 'parent_street_address', 'parent_city_address', 'parent_state_address', 'parent_zip_address',
                            'home_telephone_number', 'business_name', 'work_hours', 'business_telephone_number', 'business_street_address',
                            'business_city_address', 'business_state_address', 'business_zip_address', 'business_cell_number',
                            'primary_parent_email', 'parent_two_name', 'parent_two_street_address', 'parent_two_city_address',
                            'parent_two_state_address', 'parent_two_zip_address', 'parent_two_home_telephone_number', 'parent_two_business_name',
                            'parent_two_work_hours', 'parent_two_business_telephone_number', 'parent_two_business_street_address',
                            'parent_two_business_city_address', 'parent_two_business_state_address', 'parent_two_business_zip_address',
                            'parent_two_business_cell_number', 'parent_email', 'child_emergency_contact_name', 'child_emergency_contact_full_address',
                            'child_emergency_contact_relationship', 'child_emergency_contact_telephone_number', 'child_care_provider_name',
                            'child_care_provider_telephone_number', 'child_hospital_affiliation', 'child_care_provider_street_address',
                            'child_care_provider_city_address', 'child_care_provider_state_address', 'child_care_provider_zip_address',
                            'child_dentist_name', 'dentist_telephone_number', 'dentist_address', 'special_diabilities', 'allergies_medication_reaction',
                            'additional_info', 'medication', 'health_insurance', 'policy_number', 'obtaining_emergency_medical_care',
                            'administration_first_aid_procedures', 'physical_exam_last_date', 'dental_exam_last_date', 'age_group_friends',
                            'neighborhood_friends', 'relationship_with_mother', 'allergies', 'asthma', 'bleeding_problems', 'diabetes',
                            'epilepsy', 'frequent_ear_infections', 'frequent_illnesses', 'hearing_problems',
                            'high_fevers', 'hospitalization', 'rheumatic_fever', 'seizures_convulsions',
                            'serious_injuries_accidents', 'surgeries', 'vision_problems', 'medical_other',
                            'illness_during_pregnancy', 'condition_of_newborn', 'duration_of_pregnancy', 'birth_weight_lbs',
                            'birth_weight_oz', 'complications', 'bottle_fed', 'breast_fed', 'other_siblings_name', 'other_siblings_age',
                            'relationship_with_father', 'relationship_with_siblings', 'relationship_with_extended_family', 'fears_conflicts',
                            'child_response_frustration', 'favorite_activities', 'last_five_years_moved', 'things_used_at_home', 'hours_of_television_daily',
                            'language_used_at_home', 'changes_at_home_situation', 'educational_expectations_of_child', 'other_important_family_members',
                            'about_family_celebrations', 'reason_for_childcare_before', 'what_child_interests', 'drop_off_time', 'pick_up_time',
                            'restricted_diet_reason', 'eat_own_reason', 'favorite_foods', 'reason_for_rest_in_the_middle_day', 'rest_routine',
                            'reason_for_toilet_trained', 'explain_for_existing_illness_allergy', 'explain_for_functioning_at_age', 'explain_for_able_to_walk',
                            'explain_for_communicate_their_needs', 'explain_for_any_medication', 'explain_for_utilize_special_equipment',
                            'explain_for_significant_periods', 'explain_for_desire_any_accommodations', 'additional_information',
                            'child_password_pick_up_password_form', 'photo_usage_photo_video_permission_form', 'contact_emergency_medical_technicians_medical_transportation_waiver',
                            'parent_sign_admission', 'parent_sign_date_admission', 'printed_name_social_media_post'
                        ];

                        inputFields.forEach(field => {
                            let element = form.querySelector(`[name='${field}']`);
                            if (element && response[field] !== undefined) {
                                element.setAttribute('value', response[field]);
                            }
                        });

                        // Checkbox handling
                        const checkboxFields = [
                            'agree_all_above_information_is_correct', 'family_history_allergies', 'family_history_heart_problems', 'family_history_tuberculosis',
                            'family_history_asthma', 'family_history_high_blood_pressure', 'family_history_vision_problems', 'family_history_diabetes',
                            'family_history_hyperactivity', 'family_history_epilepsy', 'no_illnesses_for_this_child', 'agree_all_above_info_is_correct',
                            'do_you_agree_this_immunization_instructions', 'childcare_before', 'restricted_diet', 'eat_own', 'rest_in_the_middle_day', 'toilet_trained',
                            'existing_illness_allergy', 'functioning_at_age', 'able_to_walk', 'communicate_their_needs', 'any_medication', 'utilize_special_equipment',
                            'significant_periods', 'desire_any_accommodations', 'do_you_agree_this', 'do_you_agree_this_pick_up_password_form',
                            'photo_permission_agree_group_photos_electronic', 'do_you_agree_this_photo_video_permission_form', 'do_you_agree_this_security_release_policy_form',
                            'do_you_agree_this_medical_transportation_waiver', 'do_you_agree_this_health_policies', 'outside_waiver_parent_sign_outside_engagements_waiver',
                            'do_you_agree_this_social_media_post'
                        ];

                        checkboxFields.forEach(field => {
                            let element = form.querySelector(`[name='${field}']`);
                            if (element && response[field] == 1) {
                                element.setAttribute('checked', true);
                            }
                        });

                        inputFields.forEach(field => {
                            let element = form.querySelector(`input[name='${field}']`);
                            if (element) {
                                element.checked = response[field] === "Yes";
                            }
                        });

                        const relatedFieldsMapping = {
                            'childcare_before': 'reason_for_childcare_before',
                            'restricted_diet': 'restricted_diet_reason',
                            'eat_own': 'eat_own_reason',
                            'rest_in_the_middle_day': 'reason_for_rest_in_the_middle_day',
                            'toilet_trained': 'reason_for_toilet_trained',
                            'existing_illness_allergy': 'explain_for_existing_illness_allergy',
                            'functioning_at_age': 'explain_for_functioning_at_age',
                            'able_to_walk': 'explain_for_able_to_walk',
                            'communicate_their_needs': 'explain_for_communicate_their_needs',
                            'any_medication': 'explain_for_any_medication',
                            'utilize_special_equipment': 'explain_for_utilize_special_equipment',
                            'significant_periods': 'explain_for_significant_periods',
                            'desire_any_accommodations': 'explain_for_desire_any_accommodations'
                        };

                        // Handle related fields based on Yes/No values
                        Object.entries(relatedFieldsMapping).forEach(([keyField, relatedField]) => {
                            let keyElement = form.querySelector(`input[name='${keyField}']`);
                            let relatedElement = form.querySelector(`[name='${relatedField}']`);

                            if (keyElement) {
                                if (response[keyField] === "Yes") {
                                    if (relatedElement) {
                                        relatedElement.setAttribute('value', response[relatedField] || '');
                                    } else {
                                        // Create a new input field if it doesn't exist
                                        let newInput = document.createElement('input');
                                        newInput.setAttribute('type', 'text');
                                        newInput.setAttribute('name', relatedField);
                                        newInput.setAttribute('value', response[relatedField] || '');
                                        form.appendChild(newInput);
                                    }
                                } else {
                                    if (relatedElement) {
                                        relatedElement.setAttribute('value', 'No');
                                    } else {
                                        // Create a new input field if it doesn't exist
                                        let newInput = document.createElement('input');
                                        newInput.setAttribute('type', 'text');
                                        newInput.setAttribute('name', relatedField);
                                        newInput.setAttribute('value', 'No');
                                        form.appendChild(newInput);
                                    }
                                }
                            }
                        });


                        if (response.gender === "Male") {
                            let element = form.querySelector(`input[id='gender1']`);
                            if (element) {
                                element.setAttribute('checked', true);
                            }
                        } else if (response.gender === "Female") {
                            let element = form.querySelector(`input[id='gender2']`);
                            if (element) {
                                element.setAttribute('checked', true);
                            }
                        } else {
                            let element = form.querySelector(`input[id='gender3']`);
                            if (element) {
                                element.setAttribute('checked', true);
                            }
                        }
                        if (response.approve_social_media_post === "approve_social_media_post") {
                            let element = form.querySelector(`input[id='approve_social_media_post1']`);
                            if (element) {
                                element.setAttribute('checked', true);
                            }
                        } else {
                            let element = form.querySelector(`input[id='approve_social_media_post2']`);
                            if (element) {
                                element.setAttribute('checked', true);
                            }
                        }
                    }
                    resolve();
                },
                error: function (error) {
                    reject(error);
                }
            });
        });
    }

    // DataTable initialization
    $('#example').DataTable({
        // scrollX: true,
        info: false,
        dom: 'Qlfrtip',
        lengthChange: false,
        ajax: {
            url: `https://ijz2b76zn8.execute-api.ap-south-1.amazonaws.com/test/admission_child_personal/completed_form_status/${editID}?year=${year}`,
            dataSrc: function (json) {
                // Format the timestamp in the JSON data before using it in the DataTable
                json.CompletedFormStatus.forEach(function (item) {
                    const date = new Date(item.completedTimestamp);
                    if (!isNaN(date)) {
                        item.completedTimestamp = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
                    } else {
                        item.completedTimestamp = 'Invalid Date';
                    }
                });
                return json.CompletedFormStatus;
            }
        },
        columns: [
            {
                data: 'formName',
                render: function (data, type, full, meta) {
                    return full.formName;
                }
            },
            {
                data: 'completedTimestamp',
                render: function (data, type, full, meta) {
                    return data; // It's already formatted in dataSrc function
                }
            },
            {
                data: 'edit',
                render: function (data, type, full, meta) {
                    let url = '';
                    switch (full.formName) {
                        case 'Admission Forms':
                            url = `${window.location.origin}/goddard-frontend-test/admission_form_completed.html?id=${editID}`;
                            break;
                        case 'Authorization':
                            url = `${window.location.origin}/goddard-frontend-test/authorization_completed.html?id=${editID}`;
                            break;
                        case 'Enrollment Agreement':
                            url = `${window.location.origin}/goddard-frontend-test/enrollment_agreement_completed.html?id=${editID}`;
                            break;
                        case 'Parent HandBook':
                            url = `${window.location.origin}/goddard-frontend-test/parent_handbook_completed.html?id=${editID}`;
                            break;
                        default:
                            return '';
                    }
                    return `
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="18" height="18" class="action-icons m-2 download-btn" data-url="${url}" data-name="${full.formName}.pdf" name="downbutton"><path fill="#0F2D52" d="M256 0a256 256 0 1 0 0 512A256 256 0 1 0 256 0zM376.9 294.6L269.8 394.5c-3.8 3.5-8.7 5.5-13.8 5.5s-10.1-2-13.8-5.5L135.1 294.6c-4.5-4.2-7.1-10.1-7.1-16.3c0-12.3 10-22.3 22.3-22.3l57.7 0 0-96c0-17.7 14.3-32 32-32l32 0c17.7 0 32 14.3 32 32l0 96 57.7 0c12.3 0 22.3 10 22.3 22.3c0 6.2-2.6 12.1-7.1 16.3z"/></svg>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="18" height="18" class="action-icons m-2 print-btn" data-url="${url}" data-name="${full.formName}.pdf" name="printbutton"><path fill="#0F2D52" d="M128 0C92.7 0 64 28.7 64 64v96h64V64H354.7L384 93.3V160h64V93.3c0-17-6.7-33.3-18.7-45.3L400 18.7C388 6.7 371.7 0 354.7 0H128zM384 352v32 64H128V384 368 352H384zm64 32h32c17.7 0 32-14.3 32-32V256c0-35.3-28.7-64-64-64H64c-35.3 0-64 28.7-64 64v96c0 17.7 14.3 32 32 32H64v64c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V384zM432 248a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"/></svg>
                        </div>`;
                }
            }
        ],
        pageLength: 25,
    });


    // Click event handler for the print button

    if (editID != '') {
        // formdiv.classList.remove('hide');
        // addChildDiv.style.display = 'none';
        //for waking up the aws lambda server  
        $.ajax({
            url: `https://ijz2b76zn8.execute-api.ap-south-1.amazonaws.com/test/child_all_form_details/fetch/${editID}`,
            type: 'GET',
            //this is used to get the response and return the result
            success: function (response) {
                let childbasicInfo;
                let childparentInfo;
                let additionalChildparentInfo;
                let childEmergencyContact;
                let childMedicalcare;
                let childParentAgreementOne;
                let statuscall;
                if (document.getElementById('childinformation') !== null) {
                    //child information details
                    if (typeof response.child_first_name !== "undefined")
                        document.getElementsByClassName('child_first_name')[0].value = response.child_first_name;
                    if (typeof response.child_last_name !== "undefined")
                        document.getElementsByClassName('child_last_name')[0].value = response.child_last_name;
                    if (typeof response.nick_name !== "undefined")
                        document.getElementsByName('nick_name')[0].value = response.nick_name;
                    if (typeof response.dob !== "undefined")
                        document.getElementsByClassName('dob')[0].value = response.dob;
                    if (typeof response.primary_language !== "undefined")
                        document.getElementsByName('primary_language')[0].value = response.primary_language;
                    if (typeof response.school_age_child_school !== "undefined")
                        document.getElementsByName('school_age_child_school')[0].value = response.school_age_child_school;
                    if (response.do_relevant_custody_papers_apply === "Yes") {
                        document.getElementById('do_relevant_custody_papers_apply1').checked = true;
                    } else {
                        document.getElementById('do_relevant_custody_papers_apply2').checked = true;
                    }
                    if (response.gender == "Male") {
                        document.getElementById('gender1').checked = true;
                    } else if (response.gender == "Female") {
                        document.getElementById('gender2').checked = true;
                    } else {
                        document.getElementById('gender3').checked = true;
                    }

                    if (typeof response.child_first_name !== "undefined" &&
                        typeof response.child_last_name !== "undefined" &&
                        typeof response.nick_name !== "undefined" &&
                        typeof response.dob !== "undefined" &&
                        typeof response.primary_language !== "undefined" &&
                        typeof response.school_age_child_school !== "undefined" &&
                        typeof response.gender !== "undefined") {
                        // Reset the display for both images
                        document.querySelector('.childdetails-tick').style.display = 'none';
                        document.querySelector('.childdetails-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.childdetails-tick').style.display = 'block';
                        childbasicInfo = true;

                    } else {
                        // Reset the display for both images
                        document.querySelector('.childdetails-tick').style.display = 'none';
                        document.querySelector('.childdetails-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.childdetails-circle').style.display = 'block';
                        childbasicInfo = false;
                    }

                    // parent one details div
                    if (typeof response.parent_name !== "undefined")
                        document.getElementsByName('parent_name')[0].value = response.parent_name;
                    if (typeof response.parent_street_address !== "undefined")
                        document.getElementsByName('parent_street_address')[0].value = response.parent_street_address;
                    if (typeof response.parent_city_address !== "undefined")
                        document.getElementsByName('parent_city_address')[0].value = response.parent_city_address;
                    if (typeof response.parent_state_address !== "undefined")
                        document.getElementsByName('parent_state_address')[0].value = response.parent_state_address;
                    if (typeof response.parent_zip_address !== "undefined")
                        document.getElementsByName('parent_zip_address')[0].value = response.parent_zip_address;
                    if (typeof response.home_telephone_number !== "undefined")
                        document.getElementsByName('home_telephone_number')[0].value = response.home_telephone_number;
                    if (typeof response.business_name !== "undefined")
                        document.getElementsByName('business_name')[0].value = response.business_name;
                    if (typeof response.work_hours !== "undefined")
                        document.getElementsByName('work_hours')[0].value = response.work_hours;
                    if (typeof response.business_telephone_number !== "undefined")
                        document.getElementsByName('business_telephone_number')[0].value = response.business_telephone_number;
                    if (typeof response.business_street_address !== "undefined")
                        document.getElementsByName('business_street_address')[0].value = response.business_street_address;
                    if (typeof response.business_city_address !== "undefined")
                        document.getElementsByName('business_city_address')[0].value = response.business_city_address;
                    if (typeof response.business_state_address !== "undefined")
                        document.getElementsByName('business_state_address')[0].value = response.business_state_address;
                    if (typeof response.business_zip_address !== "undefined")
                        document.getElementsByName('business_zip_address')[0].value = response.business_zip_address;
                    if (typeof response.business_cell_number !== "undefined")
                        document.getElementsByName('business_cell_number')[0].value = response.business_cell_number;
                    if (typeof response.primary_parent_email !== "undefined")
                        document.getElementsByName('primary_parent_email')[0].value = response.primary_parent_email;

                    if (typeof response.parent_name !== "undefined" &&
                        typeof response.parent_street_address !== "undefined" &&
                        typeof response.parent_city_address !== "undefined" &&
                        typeof response.parent_state_address !== "undefined" &&
                        typeof response.parent_zip_address !== "undefined" &&
                        typeof response.home_telephone_number !== "undefined" &&
                        typeof response.business_name !== "undefined" &&
                        typeof response.work_hours !== "undefined" &&
                        typeof response.business_telephone_number !== "undefined" &&
                        typeof response.business_street_address !== "undefined" &&
                        typeof response.business_city_address !== "undefined" &&
                        typeof response.business_zip_address !== "undefined" &&
                        typeof response.business_cell_number !== "undefined" &&
                        typeof response.primary_parent_email !== "undefined"
                    ) {
                        // Reset the display for both images
                        document.querySelector('.parentdetails-tick').style.display = 'none';
                        document.querySelector('.parentdetails-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.parentdetails-tick').style.display = 'block';
                        childparentInfo = true;
                    } else {
                        // Reset the display for both images
                        document.querySelector('.parentdetails-tick').style.display = 'none';
                        document.querySelector('.parentdetails-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.parentdetails-circle').style.display = 'block';
                        childparentInfo = false;
                    }

                    // additional parent details div
                    if (typeof response.parent_two_name !== "undefined")
                        document.getElementsByName('parent_two_name')[0].value = response.parent_two_name;
                    if (typeof response.parent_two_street_address !== "undefined")
                        document.getElementsByName('parent_two_street_address')[0].value = response.parent_two_street_address;
                    if (typeof response.parent_two_city_address !== "undefined")
                        document.getElementsByName('parent_two_city_address')[0].value = response.parent_two_city_address;
                    if (typeof response.parent_two_state_address !== "undefined")
                        document.getElementsByName('parent_two_state_address')[0].value = response.parent_two_state_address;
                    if (typeof response.parent_two_zip_address !== "undefined")
                        document.getElementsByName('parent_two_zip_address')[0].value = response.parent_two_zip_address;
                    if (typeof response.parent_two_home_telephone_number !== "undefined")
                        document.getElementsByName('parent_two_home_telephone_number')[0].value = response.parent_two_home_telephone_number;
                    if (typeof response.parent_two_business_name !== "undefined")
                        document.getElementsByName('parent_two_business_name')[0].value = response.parent_two_business_name;
                    if (typeof response.parent_two_work_hours !== "undefined")
                        document.getElementsByName('parent_two_work_hours')[0].value = response.parent_two_work_hours;
                    if (typeof response.parent_two_business_telephone_number !== "undefined")
                        document.getElementsByName('parent_two_business_telephone_number')[0].value = response.parent_two_business_telephone_number;
                    // if (typeof response.parent_two_business_street_address !== "undefined")
                    //     document.getElementsByName('parent_two_business_street_address')[0].value = response.parent_two_business_street_address;
                    // if (typeof response.parent_two_business_city_address !== "undefined")
                    //     document.getElementsByName('parent_two_business_city_address')[0].value = response.parent_two_business_city_address;
                    // if (typeof response.parent_two_business_state_address !== "undefined")
                    //     document.getElementsByName('parent_two_business_state_address')[0].value = response.parent_two_business_state_address;
                    // if (typeof response.parent_two_business_zip_address !== "undefined")
                    //     document.getElementsByName('parent_two_business_zip_address')[0].value = response.parent_two_business_zip_address;
                    // if (typeof response.parent_two_business_cell_number !== "undefined")
                    //     document.getElementsByName('parent_two_business_cell_number')[0].value = response.parent_two_business_cell_number;
                    if (typeof response.parent_email !== "undefined")
                        document.getElementsByName('parent_email')[0].value = response.parent_email;

                    if (typeof response.parent_two_name !== "undefined" &&
                        typeof response.parent_two_street_address !== "undefined" &&
                        typeof response.parent_two_city_address !== "undefined" &&
                        typeof response.parent_two_state_address !== "undefined" &&
                        typeof response.parent_two_zip_address !== "undefined" &&
                        typeof response.parent_two_home_telephone_number !== "undefined" &&
                        typeof response.parent_two_business_name !== "undefined" &&
                        typeof response.parent_two_work_hours !== "undefined" &&
                        typeof response.parent_two_business_telephone_number !== "undefined" &&
                        typeof response.parent_two_business_street_address !== "undefined" &&
                        typeof response.parent_two_business_city_address !== "undefined" &&
                        typeof response.parent_two_business_zip_address !== "undefined" &&
                        typeof response.parent_two_business_cell_number !== "undefined" &&
                        typeof response.parent_email !== "undefined") {
                        document.querySelector('.parent_twodetails-tick').style.display = 'block';
                        additionalChildparentInfo = true;
                    } else {
                        document.querySelector('.parent_twodetails-circle').style.display = 'block';
                        additionalChildparentInfo = false;
                    }

                    // emergency Contact Information
                    if (typeof response.child_emergency_contact_name !== "undefined")
                        document.getElementsByName('child_emergency_contact_name')[0].value = response.child_emergency_contact_name;
                    if (typeof response.child_emergency_contact_full_address !== "undefined")
                        document.getElementsByName('child_emergency_contact_full_address')[0].value = response.child_emergency_contact_full_address;
                    if (typeof response.child_emergency_contact_relationship !== "undefined")
                        document.getElementsByName('child_emergency_contact_relationship')[0].value = response.child_emergency_contact_relationship;
                    if (typeof response.child_emergency_contact_telephone_number !== "undefined")
                        document.getElementsByName('child_emergency_contact_telephone_number')[0].value = response.child_emergency_contact_telephone_number;
                    if (typeof response.child_emergency_contact_name !== "undefined" &&
                        typeof response.child_emergency_contact_full_address !== "undefined" &&
                        typeof response.child_emergency_contact_relationship !== "undefined" &&
                        typeof response.child_emergency_contact_telephone_number !== "undefined"
                    ) {
                        // Reset the display for both images
                        document.querySelector('.emergencycontact-tick').style.display = 'none';
                        document.querySelector('.emergencycontact-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.emergencycontact-tick').style.display = 'block';
                        childEmergencyContact = true;
                    } else {
                        // Reset the display for both images
                        document.querySelector('.emergencycontact-tick').style.display = 'none';
                        document.querySelector('.emergencycontact-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.emergencycontact-circle').style.display = 'block';
                        childEmergencyContact = false;
                    }

                    // Child care provider Information
                    if (typeof response.child_care_provider_name !== "undefined")
                        document.getElementsByName('child_care_provider_name')[0].value = response.child_care_provider_name;
                    if (typeof response.child_care_provider_telephone_number !== "undefined")
                        document.getElementsByName('child_care_provider_telephone_number')[0].value = response.child_care_provider_telephone_number;
                    if (typeof response.child_hospital_affiliation !== "undefined")
                        document.getElementsByName('child_hospital_affiliation')[0].value = response.child_hospital_affiliation;
                    if (typeof response.child_care_provider_street_address !== "undefined")
                        document.getElementsByName('child_care_provider_street_address')[0].value = response.child_care_provider_street_address;
                    if (typeof response.child_care_provider_city_address !== "undefined")
                        document.getElementsByName('child_care_provider_city_address')[0].value = response.child_care_provider_city_address;
                    if (typeof response.child_care_provider_state_address !== "undefined")
                        document.getElementsByName('child_care_provider_state_address')[0].value = response.child_care_provider_state_address;
                    if (typeof response.child_care_provider_zip_address !== "undefined")
                        document.getElementsByName('child_care_provider_zip_address')[0].value = response.child_care_provider_zip_address;
                    if (typeof response.child_dentist_name !== "undefined")
                        document.getElementsByName('child_dentist_name')[0].value = response.child_dentist_name;
                    if (typeof response.dentist_telephone_number !== "undefined")
                        document.getElementsByName('dentist_telephone_number')[0].value = response.dentist_telephone_number;
                    if (typeof response.dentist_address !== "undefined")
                        document.getElementsByName('dentist_address')[0].value = response.dentist_address;
                    if (typeof response.special_diabilities !== "undefined")
                        document.getElementsByName('special_diabilities')[0].value = response.special_diabilities;
                    if (typeof response.allergies_medication_reaction !== "undefined")
                        document.getElementsByName('allergies_medication_reaction')[0].value = response.allergies_medication_reaction;
                    if (typeof response.additional_info !== "undefined")
                        document.getElementsByName('additional_info')[0].value = response.additional_info;
                    if (typeof response.medication !== "undefined")
                        document.getElementsByName('medication')[0].value = response.medication;
                    if (typeof response.health_insurance !== "undefined")
                        document.getElementsByName('health_insurance')[0].value = response.health_insurance;
                    if (typeof response.policy_number !== "undefined")
                        document.getElementsByName('policy_number')[0].value = response.policy_number;

                    if (typeof response.child_care_provider_name !== "undefined" &&
                        typeof response.child_care_provider_telephone_number !== "undefined" &&
                        typeof response.child_hospital_affiliation !== "undefined" &&
                        typeof response.child_care_provider_street_address !== "undefined" &&
                        typeof response.child_care_provider_city_address !== "undefined" &&
                        typeof response.child_care_provider_state_address !== "undefined" &&
                        typeof response.child_care_provider_zip_address !== "undefined" &&
                        typeof response.child_dentist_name !== "undefined" &&
                        typeof response.dentist_telephone_number !== "undefined" &&
                        typeof response.dentist_address !== "undefined" &&
                        typeof response.special_diabilities !== "undefined" &&
                        typeof response.allergies_medication_reaction !== "undefined" &&
                        typeof response.additional_info !== "undefined" &&
                        typeof response.medication !== "undefined" &&
                        typeof response.health_insurance !== "undefined" &&
                        typeof response.policy_number !== "undefined"
                    ) {
                        // Reset the display for both images
                        document.querySelector('.medicalcare-tick').style.display = 'none';
                        document.querySelector('.medicalcare-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.medicalcare-tick').style.display = 'block';
                        childMedicalcare = true;
                    } else {
                        // Reset the display for both images
                        document.querySelector('.medicalcare-tick').style.display = 'none';
                        document.querySelector('.medicalcare-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.medicalcare-circle').style.display = 'block';
                        childMedicalcare = false;
                    }

                    // parent agreement one information
                    if (typeof response.obtaining_emergency_medical_care !== "undefined")
                        document.getElementsByName('obtaining_emergency_medical_care')[0].value = response.obtaining_emergency_medical_care;
                    if (typeof response.administration_first_aid_procedures !== "undefined")
                        document.getElementsByName('administration_first_aid_procedures')[0].value = response.administration_first_aid_procedures;
                    if (response.agree_all_above_information_is_correct == 1) {
                        document.getElementById('agree_all_above_information_is_correct').checked = true;

                    } else {
                        document.getElementById('agree_all_above_information_is_correct').checked = false;

                    }
                    if (typeof response.obtaining_emergency_medical_care !== "undefined" &&
                        typeof response.administration_first_aid_procedures !== "undefined" &&
                        typeof response.agree_all_above_information_is_correct !== "undefined"
                    ) {
                        // Reset the display for both images
                        document.querySelector('.parentagreement-tick').style.display = 'none';
                        document.querySelector('.parentagreement-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.parentagreement-tick').style.display = 'block';
                        childParentAgreementOne = true;
                    } else {
                        // Reset the display for both images
                        document.querySelector('.parentagreement-tick').style.display = 'none';
                        document.querySelector('.parentagreement-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.parentagreement-circle').style.display = 'block';
                        childParentAgreementOne = false;
                    }

                    if (childbasicInfo == true && childparentInfo == true && additionalChildparentInfo == true &&
                        childMedicalcare == true && childEmergencyContact == true && childParentAgreementOne == true
                    ) {
                        // Reset the display for both images
                        document.querySelector('.childinfo-tick').style.display = 'none';
                        document.querySelector('.childinfo-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.childinfo-tick').style.display = 'block';
                        statuscall = true;
                    } else {
                        // Reset the display for both images
                        document.querySelector('.childinfo-tick').style.display = 'none';
                        document.querySelector('.childinfo-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.childinfo-circle').style.display = 'block';
                        statuscall = false;
                    }
                }

                var inputs = document.querySelectorAll('#childinformation input');
            
                inputs.forEach(function(input) {
                    if (input.value.trim() === '') {
                        input.classList.add('input-error'); // Add a class to highlight empty input
                        
                    } else {
                        input.classList.remove('input-error'); // Remove error class if input is not empty
                    }
                });

                // child family and history
                let childHistory;
                let medicalHistory;
                let pregnancyHistory;
                let familyHistroy;
                let socialBehavior;
                let environmentalFactor;
                let parentAgreementTwo;
                if (document.getElementById('childandfamilyhistory') != null) {
                    if (typeof response.physical_exam_last_date !== "undefined")
                        document.getElementsByName('physical_exam_last_date')[0].value = response.physical_exam_last_date;
                    if (typeof response.dental_exam_last_date !== "undefined")
                        document.getElementsByName('dental_exam_last_date')[0].value = response.dental_exam_last_date;
                    if (typeof response.physical_exam_last_date !== "undefined" &&
                        typeof response.dental_exam_last_date !== "undefined"
                    ) {
                        // Reset the display for both images
                        document.querySelector('.childhistoryDetails-tick').style.display = 'none';
                        document.querySelector('.childhistoryDetails-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.childhistoryDetails-tick').style.display = 'block';
                        childHistory = true;
                    } else {
                        // Reset the display for both images
                        document.querySelector('.childhistoryDetails-tick').style.display = 'none';
                        document.querySelector('.childhistoryDetails-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.childhistoryDetails-circle').style.display = 'block';
                        childHistory = false;
                    }

                    if (typeof response.allergies !== "undefined")
                        document.getElementsByName('allergies')[0].value = response.allergies;
                    if (typeof response.asthma !== "undefined")
                        document.getElementsByName('asthma')[0].value = response.asthma;
                    if (typeof response.bleeding_problems !== "undefined")
                        document.getElementsByName('bleeding_problems')[0].value = response.bleeding_problems;
                    if (typeof response.diabetes !== "undefined")
                        document.getElementsByName('diabetes')[0].value = response.diabetes;
                    if (typeof response.epilepsy !== "undefined")
                        document.getElementsByName('epilepsy')[0].value = response.epilepsy;
                    if (typeof response.frequent_ear_infections !== "undefined")
                        document.getElementsByName('frequent_ear_infections')[0].value = response.frequent_ear_infections;
                    if (typeof response.frequent_illnesses !== "undefined")
                        document.getElementsByName('frequent_illnesses')[0].value = response.frequent_illnesses;
                    if (typeof response.hearing_problems !== "undefined")
                        document.getElementsByName('hearing_problems')[0].value = response.hearing_problems;
                    if (typeof response.high_fevers !== "undefined")
                        document.getElementsByName('high_fevers')[0].value = response.high_fevers;
                    if (typeof response.hospitalization !== "undefined")
                        document.getElementsByName('hospitalization')[0].value = response.hospitalization;
                    if (typeof response.rheumatic_fever !== "undefined")
                        document.getElementsByName('rheumatic_fever')[0].value = response.rheumatic_fever;
                    if (typeof response.seizures_convulsions !== "undefined")
                        document.getElementsByName('seizures_convulsions')[0].value = response.seizures_convulsions;
                    if (typeof response.serious_injuries_accidents !== "undefined")
                        document.getElementsByName('serious_injuries_accidents')[0].value = response.serious_injuries_accidents;
                    if (typeof response.surgeries !== "undefined")
                        document.getElementsByName('surgeries')[0].value = response.surgeries;
                    if (typeof response.vision_problems !== "undefined")
                        document.getElementsByName('vision_problems')[0].value = response.vision_problems;
                    if (typeof response.medical_other !== "undefined")
                        document.getElementsByName('medical_other')[0].value = response.medical_other;

                    if (typeof response.allergies !== "undefined" &&
                        typeof response.asthma !== "undefined" &&
                        typeof response.bleeding_problems !== "undefined" &&
                        typeof response.diabetes !== "undefined" &&
                        typeof response.epilepsy !== "undefined" &&
                        typeof response.frequent_ear_infections !== "undefined" &&
                        typeof response.hearing_problems !== "undefined" &&
                        typeof response.hospitalization !== "undefined" &&
                        typeof response.rheumatic_fever !== "undefined" &&
                        typeof response.seizures_convulsions !== "undefined" &&
                        typeof response.serious_injuries_accidents !== "undefined" &&
                        typeof response.surgeries !== "undefined" &&
                        typeof response.vision_problems !== "undefined" &&
                        typeof response.medical_other !== "undefined"
                    ) {
                        // Reset the display for both images
                        document.querySelector('.medicalhistory-tick').style.display = 'none';
                        document.querySelector('.medicalhistory-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.medicalhistory-tick').style.display = 'block';
                        medicalHistory = true;
                    } else {
                        // Reset the display for both images
                        document.querySelector('.medicalhistory-tick').style.display = 'none';
                        document.querySelector('.medicalhistory-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.medicalhistory-circle').style.display = 'block';
                        medicalHistory = false;
                    }


                    if (typeof response.illness_during_pregnancy !== "undefined")
                        document.getElementsByName('illness_during_pregnancy')[0].value = response.illness_during_pregnancy;
                    if (typeof response.condition_of_newborn !== "undefined")
                        document.getElementsByName('condition_of_newborn')[0].value = response.condition_of_newborn;
                    if (typeof response.duration_of_pregnancy !== "undefined")
                        document.getElementsByName('duration_of_pregnancy')[0].value = response.duration_of_pregnancy;
                    if (typeof response.birth_weight_lbs !== "undefined")
                        document.getElementsByName('birth_weight_lbs')[0].value = response.birth_weight_lbs;
                    if (typeof response.birth_weight_oz !== "undefined")
                        document.getElementsByName('birth_weight_oz')[0].value = response.birth_weight_oz;
                    if (typeof response.complications !== "undefined")
                        document.getElementsByName('complications')[0].value = response.complications;
                    if (typeof response.bottle_fed !== "undefined")
                        document.getElementsByName('bottle_fed')[0].value = response.bottle_fed;
                    if (typeof response.breast_fed !== "undefined")
                        document.getElementsByName('breast_fed')[0].value = response.breast_fed;
                    if (typeof response.other_siblings_name !== "undefined")
                        document.getElementsByName('other_siblings_name')[0].value = response.other_siblings_name;
                    if (typeof response.other_siblings_age !== "undefined")
                        document.getElementsByName('other_siblings_age')[0].value = response.other_siblings_age;

                    if (typeof response.illness_during_pregnancy !== "undefined" &&
                        typeof response.condition_of_newborn !== "undefined" &&
                        typeof response.duration_of_pregnancy !== "undefined" &&
                        typeof response.birth_weight_lbs !== "undefined" &&
                        typeof response.birth_weight_oz !== "undefined" &&
                        typeof response.complications !== "undefined" &&
                        typeof response.bottle_fed !== "undefined" &&
                        typeof response.breast_fed !== "undefined" &&
                        typeof response.other_siblings_name !== "undefined" &&
                        typeof response.other_siblings_age !== "undefined"
                    ) {
                        // Reset the display for both images
                        document.querySelector('.pregnancyhistory-tick').style.display = 'none';
                        document.querySelector('.pregnancyhistory-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.pregnancyhistory-tick').style.display = 'block';
                        pregnancyHistory = true;
                    } else {
                        // Reset the display for both images
                        document.querySelector('.pregnancyhistory-tick').style.display = 'none';
                        document.querySelector('.pregnancyhistory-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.pregnancyhistory-circle').style.display = 'block';
                        pregnancyHistory = false;
                    }


                    if (response.family_history_allergies == 1) {
                        document.getElementById('family_history_allergies').checked = true;
                    } else {
                        document.getElementById('family_history_allergies').checked = false;
                    }
                    if (response.family_history_heart_problems == 1) {
                        document.getElementById('family_history_heart_problems').checked = true;
                    } else {
                        document.getElementById('family_history_heart_problems').checked = false;
                    }
                    if (response.family_history_tuberculosis == 1) {
                        document.getElementById('family_history_tuberculosis').checked = true;
                    } else {
                        document.getElementById('family_history_tuberculosis').checked = false;
                    }
                    if (response.family_history_asthma == 1) {
                        document.getElementById('family_history_asthma').checked = true;
                    } else {
                        document.getElementById('family_history_asthma').checked = false;
                    }
                    if (response.family_history_high_blood_pressure == 1) {
                        document.getElementById('family_history_high_blood_pressure').checked = true;
                    } else {
                        document.getElementById('family_history_high_blood_pressure').checked = false;
                    }
                    if (response.family_history_vision_problems == 1) {
                        document.getElementById('family_history_vision_problems').checked = true;
                    } else {
                        document.getElementById('family_history_vision_problems').checked = false;
                    }
                    if (response.family_history_diabetes == 1) {
                        document.getElementById('family_history_diabetes').checked = true;
                    } else {
                        document.getElementById('family_history_diabetes').checked = false;
                    }
                    if (response.family_history_hyperactivity == 1) {
                        document.getElementById('family_history_hyperactivity').checked = true;
                    } else {
                        document.getElementById('family_history_hyperactivity').checked = false;
                    }
                    if (response.family_history_epilepsy == 1) {
                        document.getElementById('family_history_epilepsy').checked = true;
                    } else {
                        document.getElementById('family_history_epilepsy').checked = false;
                    }
                    // if ( response.no_illnesses_for_this_child == 1){
                    //     document.getElementById('no_illnesses_for_this_child').checked = true;
                    // }else{
                    //     document.getElementById('no_illnesses_for_this_child').checked = false;
                    // }

                    if (response.family_history_allergies == 1 ||
                        response.family_history_heart_problems == 1 ||
                        response.family_history_tuberculosis == 1 ||
                        response.family_history_asthma == 1 ||
                        response.family_history_high_blood_pressure == 1 ||
                        response.family_history_vision_problems == 1 ||
                        response.family_history_diabetes == 1 ||
                        response.family_history_hyperactivity == 1 ||
                        response.family_history_epilepsy == 1
                    ) {
                        document.getElementById('no_illnesses_for_this_child').checked = false;
                    } else {
                        document.getElementById('no_illnesses_for_this_child').checked = true;
                    }

                    if (typeof response.family_history_allergies !== "undefined" ||
                        typeof response.family_history_heart_problems !== "undefined" ||
                        typeof response.family_history_tuberculosis !== "undefined" ||
                        typeof response.family_history_asthma !== "undefined" ||
                        typeof response.family_history_high_blood_pressure !== "undefined" ||
                        typeof response.family_history_vision_problems !== "undefined" ||
                        typeof response.family_history_diabetes !== "undefined" ||
                        typeof response.family_history_hyperactivity !== "undefined" ||
                        typeof response.family_history_epilepsy !== "undefined" ||
                        typeof response.no_illnesses_for_this_child !== "undefined"
                    ) {

                        // Reset the display for both images
                        document.querySelector('.familyhistory-tick').style.display = 'none';
                        document.querySelector('.familyhistory-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.familyhistory-tick').style.display = 'block';
                        familyHistroy = true;
                    } else {
                        // Reset the display for both images
                        document.querySelector('.familyhistory-tick').style.display = 'none';
                        document.querySelector('.familyhistory-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.familyhistory-circle').style.display = 'block';
                        familyHistroy = false;
                    }


                    if (typeof response.age_group_friends !== "undefined")
                        document.getElementsByName('age_group_friends')[0].value = response.age_group_friends;
                    if (typeof response.neighborhood_friends !== "undefined")
                        document.getElementsByName('neighborhood_friends')[0].value = response.neighborhood_friends;
                    if (typeof response.relationship_with_mother !== "undefined")
                        document.getElementsByName('relationship_with_mother')[0].value = response.relationship_with_mother;
                    if (typeof response.relationship_with_father !== "undefined")
                        document.getElementsByName('relationship_with_father')[0].value = response.relationship_with_father;
                    if (typeof response.relationship_with_siblings !== "undefined")
                        document.getElementsByName('relationship_with_siblings')[0].value = response.relationship_with_siblings;
                    if (typeof response.relationship_with_extended_family !== "undefined")
                        document.getElementsByName('relationship_with_extended_family')[0].value = response.relationship_with_extended_family;
                    if (typeof response.fears_conflicts !== "undefined")
                        document.getElementsByName('fears_conflicts')[0].value = response.fears_conflicts;
                    if (typeof response.child_response_frustration !== "undefined")
                        document.getElementsByName('child_response_frustration')[0].value = response.child_response_frustration;
                    if (typeof response.favorite_activities !== "undefined")
                        document.getElementsByName('favorite_activities')[0].value = response.favorite_activities;

                    if (typeof response.age_group_friends !== "undefined" &&
                        typeof response.neighborhood_friends !== "undefined" &&
                        typeof response.relationship_with_mother !== "undefined" &&
                        typeof response.relationship_with_father !== "undefined" &&
                        typeof response.relationship_with_siblings !== "undefined" &&
                        typeof response.relationship_with_extended_family !== "undefined" &&
                        typeof response.fears_conflicts !== "undefined" &&
                        typeof response.child_response_frustration !== "undefined" &&
                        typeof response.favorite_activities !== "undefined"
                    ) {
                        // Reset the display for both images
                        document.querySelector('.socialbehavior-tick').style.display = 'none';
                        document.querySelector('.socialbehavior-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.socialbehavior-tick').style.display = 'block';
                        socialBehavior = true;
                    } else {
                        // Reset the display for both images
                        document.querySelector('.socialbehavior-tick').style.display = 'none';
                        document.querySelector('.socialbehavior-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.socialbehavior-circle').style.display = 'block';
                        socialBehavior = false;
                    }


                    if (typeof response.last_five_years_moved !== "undefined")
                        document.getElementsByName('last_five_years_moved')[0].value = response.last_five_years_moved;
                    if (typeof response.things_used_at_home !== "undefined")
                        document.getElementsByName('things_used_at_home')[0].value = response.things_used_at_home;
                    if (typeof response.hours_of_television_daily !== "undefined")
                        document.getElementsByName('hours_of_television_daily')[0].value = response.hours_of_television_daily;
                    if (typeof response.language_used_at_home !== "undefined")
                        document.getElementsByName('language_used_at_home')[0].value = response.language_used_at_home;
                    if (typeof response.changes_at_home_situation !== "undefined")
                        document.getElementsByName('changes_at_home_situation')[0].value = response.changes_at_home_situation;
                    if (typeof response.educational_expectations_of_child !== "undefined")
                        document.getElementsByName('educational_expectations_of_child')[0].value = response.educational_expectations_of_child;

                    if (typeof response.last_five_years_moved !== "undefined" &&
                        typeof response.things_used_at_home !== "undefined" &&
                        typeof response.hours_of_television_daily !== "undefined" &&
                        typeof response.language_used_at_home !== "undefined" &&
                        typeof response.changes_at_home_situation !== "undefined" &&
                        typeof response.educational_expectations_of_child !== "undefined"
                    ) {
                        // Reset the display for both images
                        document.querySelector('.environmentalfactor-tick').style.display = 'none';
                        document.querySelector('.environmentalfactor-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.environmentalfactor-tick').style.display = 'block';
                        environmentalFactor = true;
                    } else {
                        // Reset the display for both images
                        document.querySelector('.environmentalfactor-tick').style.display = 'none';
                        document.querySelector('.environmentalfactor-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.environmentalfactor-circle').style.display = 'block';
                        environmentalFactor = false;
                    }

                    if (response.agree_all_above_info_is_correct == 1) {
                        document.getElementById('agree_all_above_info_is_correct').checked = true;
                    } else {
                        document.getElementById('agree_all_above_info_is_correct').checked = false;
                    }

                    if (typeof response.agree_all_above_info_is_correct !== "undefined") {
                        // Reset the display for both images
                        document.querySelector('.parentagreement-two-tick').style.display = 'none';
                        document.querySelector('.parentagreement-two-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.parentagreement-two-tick').style.display = 'block';
                        parentAgreementTwo = true;
                    } else {
                        // Reset the display for both images
                        document.querySelector('.parentagreement-two-tick').style.display = 'none';
                        document.querySelector('.parentagreement-two-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.parentagreement-two-circle').style.display = 'block';
                        parentAgreementTwo = false;
                    }

                    if (childHistory == true && medicalHistory == true && pregnancyHistory == true &&
                        familyHistroy == true && socialBehavior == true && environmentalFactor == true &&
                        parentAgreementTwo == true
                    ) {
                        // Reset the display for both images
                        document.querySelector('.childhistory-tick').style.display = 'none';
                        document.querySelector('.childhistory-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.childhistory-tick').style.display = 'block';
                        statuscall = true;
                    } else {
                        // Reset the display for both images
                        document.querySelector('.childhistory-tick').style.display = 'none';
                        document.querySelector('.childhistory-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.childhistory-circle').style.display = 'block';
                        statuscall = false;
                    }
                }

                var inputs = document.querySelectorAll('#childandfamilyhistory input');
            
                inputs.forEach(function(input) {
                    if (input.value.trim() === '') {
                        input.classList.add('input-error'); // Add a class to highlight empty input
                        
                    } else {
                        input.classList.remove('input-error'); // Remove error class if input is not empty
                    }
                });

                //immunization details
                let immunizationInstruction;
                if (document.getElementById('immunizationinstructions') != null) {
                    if (response.do_you_agree_this_immunization_instructions == 1) {
                        document.getElementById('do_you_agree_this_immunization_instructions').checked = true;
                        immunizationInstruction = true;
                    } else {
                        document.getElementById('do_you_agree_this_immunization_instructions').checked = false;
                        immunizationInstruction = false;
                    }
                    if (immunizationInstruction == true) {
                        // Reset the display for both images
                        document.querySelector('.immunization-tick').style.display = 'none';
                        document.querySelector('.immunization-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.immunization-tick').style.display = 'block';
                        statuscall = true;
                    } else {
                        // Reset the display for both images
                        document.querySelector('.immunization-tick').style.display = 'none';
                        document.querySelector('.immunization-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.immunization-circle').style.display = 'block';
                        statuscall = false;
                    }
                }

                var inputs = document.querySelectorAll('#immunizationinstructions input');
            
                inputs.forEach(function(input) {
                    if (input.value.trim() === '') {
                        input.classList.add('input-error'); // Add a class to highlight empty input
                        
                    } else {
                        input.classList.remove('input-error'); // Remove error class if input is not empty
                    }
                });

                let childProfile;
                let nutritionDetails;
                let restDetails;
                let medicalDetails;
                let parentAgreementThree;
                //child profile details
                if (document.getElementById('childprofile') != null) {

                    if (typeof response.other_important_family_members !== "undefined")
                        document.getElementsByName('other_important_family_members')[0].value = response.other_important_family_members;
                    if (typeof response.about_family_celebrations !== "undefined")
                        document.getElementsByName('about_family_celebrations')[0].value = response.about_family_celebrations;
                    if (response.childcare_before == "Yes") {
                        document.getElementById('childcare_before1').checked = true;
                        // document.getElementById('childcare_before_reason_div').style.display = "block";
                    } else if (response.childcare_before == "No") {
                        document.getElementById('childcare_before2').checked = true;
                        // document.getElementById('childcare_before_reason_div').style.display = "none";
                    }
                    if (typeof response.reason_for_childcare_before !== "undefined")
                        document.getElementsByName('reason_for_childcare_before')[0].value = response.reason_for_childcare_before;
                    if (typeof response.what_child_interests !== "undefined")
                        document.getElementsByName('what_child_interests')[0].value = response.what_child_interests;
                    if (typeof response.drop_off_time !== "undefined")
                        document.getElementsByName('drop_off_time')[0].value = response.drop_off_time;
                    if (typeof response.pick_up_time !== "undefined")
                        document.getElementsByName('pick_up_time')[0].value = response.pick_up_time;

                    if (typeof response.other_important_family_members !== "undefined" &&
                        typeof response.about_family_celebrations !== "undefined" &&
                        typeof response.childcare_before !== "undefined" &&
                        typeof response.reason_for_childcare_before !== "undefined" &&
                        typeof response.what_child_interests !== "undefined" &&
                        typeof response.drop_off_time !== "undefined" &&
                        typeof response.pick_up_time !== "undefined"
                    ) {
                        // Reset the display for both images
                        document.querySelector('.childprofiledetail-tick').style.display = 'none';
                        document.querySelector('.childprofiledetail-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.childprofiledetail-tick').style.display = 'block';
                        childProfile = true;
                    } else {
                        // Reset the display for both images
                        document.querySelector('.childprofiledetail-tick').style.display = 'none';
                        document.querySelector('.childprofiledetail-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.childprofiledetail-circle').style.display = 'block';
                        childProfile = false;
                    }


                    if (response.restricted_diet == "Yes") {
                        document.getElementById('restricted_diet1').checked = true;
                        // document.getElementById('restricted_diet_reason_div').style.display = "block";
                    } else if (response.restricted_diet == "No") {
                        document.getElementById('restricted_diet2').checked = true;
                        // document.getElementById('restricted_diet_reason_div').style.display = "none";
                    }
                    if (typeof response.restricted_diet_reason !== "undefined")
                        document.getElementsByName('restricted_diet_reason')[0].value = response.restricted_diet_reason;
                    if (response.eat_own == "Yes") {
                        document.getElementById('eat_own1').checked = true;
                        // document.getElementById('eat_own_reason_div').style.display = "block";
                    } else if (response.eat_own == "No") {
                        document.getElementById('eat_own2').checked = true;
                        // document.getElementById('eat_own_reason_div').style.display = "none";
                    }
                    if (typeof response.eat_own_reason !== "undefined")
                        document.getElementsByName('eat_own_reason')[0].value = response.eat_own_reason;
                    if (typeof response.favorite_foods !== "undefined")
                        document.getElementsByName('favorite_foods')[0].value = response.favorite_foods;

                    if (typeof response.restricted_diet !== "undefined" &&
                        typeof response.eat_own !== "undefined" &&
                        typeof response.favorite_foods !== "undefined"
                    ) {
                        // Reset the display for both images
                        document.querySelector('.nutrition-tick').style.display = 'none';
                        document.querySelector('.nutrition-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.nutrition-tick').style.display = 'block';
                        nutritionDetails = true;
                    } else {
                        // Reset the display for both images
                        document.querySelector('.nutrition-tick').style.display = 'none';
                        document.querySelector('.nutrition-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.nutrition-circle').style.display = 'block';
                        nutritionDetails = false;
                    }


                    if (response.rest_in_the_middle_day == "Yes") {
                        document.getElementById('rest_in_the_middle_day1').checked = true;
                        // document.getElementById('reason_for_rest_in_the_middle_day_div').style.display = "block";
                    } else if (response.rest_in_the_middle_day == "No") {
                        document.getElementById('rest_in_the_middle_day2').checked = true;
                        // document.getElementById('reason_for_rest_in_the_middle_day_div').style.display = "none";
                    }
                    if (typeof response.reason_for_rest_in_the_middle_day !== "undefined")
                        document.getElementsByName('reason_for_rest_in_the_middle_day')[0].value = response.reason_for_rest_in_the_middle_day;
                    if (typeof response.rest_routine !== "undefined")
                        document.getElementsByName('rest_routine')[0].value = response.rest_routine;
                    if (response.toilet_trained == "Yes") {
                        document.getElementById('toilet_trained1').checked = true;
                        // document.getElementById('reason_for_toilet_trained_div').style.display = "block";
                    } else if (response.toilet_trained == "No") {
                        document.getElementById('toilet_trained2').checked = true;
                        // document.getElementById('reason_for_toilet_trained_div').style.display = "none";
                    }
                    if (typeof response.reason_for_toilet_trained !== "undefined")
                        document.getElementsByName('reason_for_toilet_trained')[0].value = response.reason_for_toilet_trained;

                    if (typeof response.rest_in_the_middle_day !== "undefined" &&
                        typeof response.rest_routine !== "undefined" &&
                        typeof response.toilet_trained !== "undefined"
                    ) {
                        // Reset the display for both images
                        document.querySelector('.restdetails-tick').style.display = 'none';
                        document.querySelector('.restdetails-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.restdetails-tick').style.display = 'block';
                        restDetails = true;
                    } else {
                        // Reset the display for both images
                        document.querySelector('.restdetails-tick').style.display = 'none';
                        document.querySelector('.restdetails-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.restdetails-circle').style.display = 'block';
                        restDetails = false;
                    }


                    if (response.existing_illness_allergy == "Yes") {
                        document.getElementById('existing_illness_allergy1').checked = true;
                        // document.getElementById('explain_for_existing_illness_allergy_div').style.display = "block";
                    } else if (response.existing_illness_allergy == "No") {
                        document.getElementById('existing_illness_allergy2').checked = true;
                        // document.getElementById('explain_for_existing_illness_allergy_div').style.display = "none";
                    }

                    if (typeof response.explain_for_existing_illness_allergy !== "undefined")
                        document.getElementsByName('explain_for_existing_illness_allergy')[0].value = response.explain_for_existing_illness_allergy;

                    if (response.functioning_at_age == "Yes") {
                        document.getElementById('functioning_at_age1').checked = true;
                        // document.getElementById('explain_for_functioning_at_age_div').style.display = "block";
                    } else if (response.functioning_at_age == "No") {
                        document.getElementById('functioning_at_age2').checked = true;
                        // document.getElementById('explain_for_functioning_at_age_div').style.display = "none";
                    }

                    if (typeof response.explain_for_functioning_at_age !== "undefined")
                        document.getElementsByName('explain_for_functioning_at_age')[0].value = response.explain_for_functioning_at_age;

                    if (response.able_to_walk == "Yes") {
                        document.getElementById('able_to_walk1').checked = true;
                        // document.getElementById('explain_for_able_to_walk_div').style.display = "block";
                    } else if (response.able_to_walk == "No") {
                        document.getElementById('able_to_walk2').checked = true;
                        // document.getElementById('explain_for_able_to_walk_div').style.display = "none";
                    }

                    if (typeof response.explain_for_able_to_walk !== "undefined")
                        document.getElementsByName('explain_for_able_to_walk')[0].value = response.explain_for_able_to_walk;

                    if (response.communicate_their_needs == "Yes") {
                        document.getElementById('communicate_their_needs1').checked = true;
                        // document.getElementById('explain_for_communicate_their_needs_div').style.display = "block";
                    } else if (response.communicate_their_needs == "No") {
                        document.getElementById('communicate_their_needs2').checked = true;
                        // document.getElementById('explain_for_communicate_their_needs_div').style.display = "none";
                    }

                    if (typeof response.explain_for_communicate_their_needs !== "undefined")
                        document.getElementsByName('explain_for_communicate_their_needs')[0].value = response.explain_for_communicate_their_needs;

                    if (response.any_medication == "Yes") {
                        document.getElementById('any_medication1').checked = true;
                        // document.getElementById('explain_for_any_medication_div').style.display = "block";
                    } else if (response.any_medication == "No") {
                        document.getElementById('any_medication2').checked = true;
                        // document.getElementById('explain_for_any_medication_div').style.display = "none";
                    }

                    if (typeof response.explain_for_any_medication !== "undefined")
                        document.getElementsByName('explain_for_any_medication')[0].value = response.explain_for_any_medication;

                    if (response.utilize_special_equipment == "Yes") {
                        document.getElementById('utilize_special_equipment1').checked = true;
                        // document.getElementById('explain_for_utilize_special_equipment_div').style.display = "block";
                    } else if (response.utilize_special_equipment == "No") {
                        document.getElementById('utilize_special_equipment2').checked = true;
                        // document.getElementById('explain_for_utilize_special_equipment_div').style.display = "none";
                    }

                    if (typeof response.explain_for_utilize_special_equipment !== "undefined")
                        document.getElementsByName('explain_for_utilize_special_equipment')[0].value = response.explain_for_utilize_special_equipment;

                    if (response.significant_periods == "Yes") {
                        document.getElementById('significant_periods1').checked = true;
                        // document.getElementById('explain_for_significant_periods_div').style.display = "block";
                    } else if (response.significant_periods == "No") {
                        document.getElementById('significant_periods2').checked = true;
                        // document.getElementById('explain_for_significant_periods_div').style.display = "none";
                    }
                    if (typeof response.explain_for_significant_periods !== "undefined")
                        document.getElementsByName('explain_for_significant_periods')[0].value = response.explain_for_significant_periods;

                    if (response.desire_any_accommodations == "Yes") {
                        document.getElementById('desire_any_accommodations1').checked = true;
                        // document.getElementById('explain_for_desire_any_accommodations_div').style.display = "block";
                    } else if (response.desire_any_accommodations == "No") {
                        document.getElementById('desire_any_accommodations2').checked = true;
                        // document.getElementById('explain_for_desire_any_accommodations_div').style.display = "none";
                    }
                    if (typeof response.explain_for_desire_any_accommodations !== "undefined")
                        document.getElementsByName('explain_for_desire_any_accommodations')[0].value = response.explain_for_desire_any_accommodations;
                    if (typeof response.additional_information !== "undefined")
                        document.getElementsByName('additional_information')[0].value = response.additional_information;

                    if (typeof response.existing_illness_allergy !== "undefined" &&
                        typeof response.functioning_at_age !== "undefined" &&
                        typeof response.able_to_walk !== "undefined" &&
                        typeof response.communicate_their_needs !== "undefined" &&
                        typeof response.any_medication !== "undefined" &&
                        typeof response.utilize_special_equipment !== "undefined" &&
                        typeof response.significant_periods !== "undefined" &&
                        typeof response.desire_any_accommodations !== "undefined" &&
                        typeof response.additional_information !== "undefined"
                    ) {
                        // Reset the display for both images
                        document.querySelector('.medicaldetails-tick').style.display = 'none';
                        document.querySelector('.medicaldetails-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.medicaldetails-tick').style.display = 'block';
                        medicalDetails = true;
                    } else {
                        // Reset the display for both images
                        document.querySelector('.medicaldetails-tick').style.display = 'none';
                        document.querySelector('.medicaldetails-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.medicaldetails-circle').style.display = 'block';
                        medicalDetails = false;
                    }

                    if (response.do_you_agree_this == 1) {
                        document.getElementById('do_you_agree_this').checked = true;
                    } else {
                        document.getElementById('do_you_agree_this').checked = false;
                    }
                    if (typeof response.do_you_agree_this !== "undefined") {
                        // Reset the display for both images
                        document.querySelector('.parentagreement-three-tick').style.display = 'none';
                        document.querySelector('.parentagreement-three-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.parentagreement-three-tick').style.display = 'block';
                        parentAgreementThree = true;
                    } else {
                        // Reset the display for both images
                        document.querySelector('.parentagreement-three-tick').style.display = 'none';
                        document.querySelector('.parentagreement-three-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.parentagreement-three-circle').style.display = 'block';
                        parentAgreementThree = false;
                    }
                    if (childProfile == true && nutritionDetails == true && restDetails == true &&
                        medicalDetails == true && parentAgreementThree == true
                    ) {
                        // Reset the display for both images
                        document.querySelector('.childprofile-tick').style.display = 'none';
                        document.querySelector('.childprofile-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.childprofile-tick').style.display = 'block';
                    } else {
                        // Reset the display for both images
                        document.querySelector('.childprofile-tick').style.display = 'none';
                        document.querySelector('.childprofile-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.childprofile-circle').style.display = 'block';
                    }
                }

                var inputs = document.querySelectorAll('#childprofile input');
            
                inputs.forEach(function(input) {
                    if (input.value.trim() === '') {
                        input.classList.add('input-error'); // Add a class to highlight empty input
                        
                    } else {
                        input.classList.remove('input-error'); // Remove error class if input is not empty
                    }
                });

                //pickup password details
                let pickupPassword;
                if (document.getElementById('pickuppassword') != null) {
                    if (typeof response.child_password_pick_up_password_form !== "undefined")
                        document.getElementsByName('child_password_pick_up_password_form')[0].value = response.child_password_pick_up_password_form;
                    if (response.do_you_agree_this_pick_up_password_form == 1) {
                        document.getElementById('do_you_agree_this_pick_up_password_form').checked = true;
                    } else {
                        document.getElementById('do_you_agree_this_pick_up_password_form').checked = false;
                    }

                    if (typeof response.child_password_pick_up_password_form !== "undefined" &&
                        typeof response.do_you_agree_this_pick_up_password_form !== "undefined"
                    ) {
                        // Reset the display for both images
                        document.querySelector('.childpickup-tick').style.display = 'none';
                        document.querySelector('.childpickup-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.childpickup-tick').style.display = 'block';
                        pickupPassword = true;
                    } else {
                        // Reset the display for both images
                        document.querySelector('.childpickup-tick').style.display = 'none';
                        document.querySelector('.childpickup-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.childpickup-circle').style.display = 'block';
                        pickupPassword = false;

                    }
                }

                var inputs = document.querySelectorAll('#pickuppassword input');
            
                inputs.forEach(function(input) {
                    if (input.value.trim() === '') {
                        input.classList.add('input-error'); // Add a class to highlight empty input
                        
                    } else {
                        input.classList.remove('input-error'); // Remove error class if input is not empty
                    }
                });

                //photo video permisiion details
                let photoVideoPermission;
                if (document.getElementById('photovideopermission') != null) {
                    // if (typeof response.photo_usage_photo_video_permission_form  !== "undefined"){
                    //         $('#photo_usage_photo_video_permission_form').append($("<option></option>").attr("value", response.photo_usage_photo_video_permission_form).text(response.photo_usage_photo_video_permission_form));
                    //     }
                    if (typeof response.photo_usage_photo_video_permission_form !== "undefined")
                        document.getElementsByName('photo_usage_photo_video_permission_form')[0].value = response.photo_usage_photo_video_permission_form;

                    if (response.photo_permission_agree_group_photos_electronic == 1) {
                        document.getElementById('photo_permission_agree_group_photos_electronic').checked = true;
                    } else {
                        document.getElementById('photo_permission_agree_group_photos_electronic').checked = false;
                    }
                    if (response.do_you_agree_this_photo_video_permission_form == 1) {
                        document.getElementById('do_you_agree_this_photo_video_permission_form').checked = true;
                    } else {
                        document.getElementById('do_you_agree_this_photo_video_permission_form').checked = false;
                    }

                    if (typeof response.photo_usage_photo_video_permission_form !== "undefined" &&
                        typeof response.photo_permission_agree_group_photos_electronic !== "undefined" &&
                        typeof response.do_you_agree_this_photo_video_permission_form !== "undefined"
                    ) {
                        // Reset the display for both images
                        document.querySelector('.childphotopermission-tick').style.display = 'none';
                        document.querySelector('.childphotopermission-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.childphotopermission-tick').style.display = 'block';
                        photoVideoPermission = true;
                    } else {
                        // Reset the display for both images
                        document.querySelector('.childphotopermission-tick').style.display = 'none';
                        document.querySelector('.childphotopermission-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.childphotopermission-circle').style.display = 'block';
                        photoVideoPermission = false;
                    }
                }

                var inputs = document.querySelectorAll('#photovideopermission input');
            
                inputs.forEach(function(input) {
                    if (input.value.trim() === '') {
                        input.classList.add('input-error'); // Add a class to highlight empty input
                        
                    } else {
                        input.classList.remove('input-error'); // Remove error class if input is not empty
                    }
                });

                // security policy details
                let securityPolicy;
                if (document.getElementById('securitypolicy') != null) {
                    if (response.do_you_agree_this_security_release_policy_form == 1) {
                        document.getElementById('do_you_agree_this_security_release_policy_form').checked = true;
                    } else {
                        document.getElementById('do_you_agree_this_security_release_policy_form').checked = false;
                    }
                    if (typeof response.do_you_agree_this_security_release_policy_form !== "undefined") {
                        // Reset the display for both images
                        document.querySelector('.childsecurity-tick').style.display = 'none';
                        document.querySelector('.childsecurity-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.childsecurity-tick').style.display = 'block';
                        securityPolicy = true;
                    } else {
                        // Reset the display for both images
                        document.querySelector('.childsecurity-tick').style.display = 'none';
                        document.querySelector('.childsecurity-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.childsecurity-circle').style.display = 'block';
                        securityPolicy = false;
                    }
                }

                var inputs = document.querySelectorAll('#securitypolicy input');
            
                inputs.forEach(function(input) {
                    if (input.value.trim() === '') {
                        input.classList.add('input-error'); // Add a class to highlight empty input
                        
                    } else {
                        input.classList.remove('input-error'); // Remove error class if input is not empty
                    }
                });

                //medical transportation details
                let medicaltransportationWeiver;
                if (document.getElementById('medicaltransportation') != null) {
                    if (typeof response.contact_emergency_medical_technicians_medical_transportation_waiver !== "undefined")
                        document.getElementsByName('contact_emergency_medical_technicians_medical_transportation_waiver')[0].value = response.contact_emergency_medical_technicians_medical_transportation_waiver;

                    if (response.do_you_agree_this_medical_transportation_waiver == 1) {
                        document.getElementById('do_you_agree_this_medical_transportation_waiver').checked = true;
                    } else {
                        document.getElementById('do_you_agree_this_medical_transportation_waiver').checked = false;
                    }
                    if (typeof response.contact_emergency_medical_technicians_medical_transportation_waiver !== "undefined" &&
                        typeof response.do_you_agree_this_medical_transportation_waiver !== "undefined") {
                        // Reset the display for both images
                        document.querySelector('.childmedical-tick').style.display = 'none';
                        document.querySelector('.childmedical-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.childmedical-tick').style.display = 'block';
                        medicaltransportationWeiver = true;
                    } else {
                        // Reset the display for both images
                        document.querySelector('.childmedical-tick').style.display = 'none';
                        document.querySelector('.childmedical-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.childmedical-circle').style.display = 'block';
                        medicaltransportationWeiver = false;
                    }
                }

                var inputs = document.querySelectorAll('#medicaltransportation input');
            
                inputs.forEach(function(input) {
                    if (input.value.trim() === '') {
                        input.classList.add('input-error'); // Add a class to highlight empty input
                        
                    } else {
                        input.classList.remove('input-error'); // Remove error class if input is not empty
                    }
                });

                // health policy details
                let healthPolicy;
                if (document.getElementById('healthpolicies') != null) {
                    if (response.do_you_agree_this_health_policies == 1) {
                        document.getElementById('do_you_agree_this_health_policies').checked = true;
                    } else {
                        document.getElementById('do_you_agree_this_health_policies').checked = false;
                    }
                    if (typeof response.do_you_agree_this_health_policies !== "undefined") {
                        // Reset the display for both images
                        document.querySelector('.childhealth-tick').style.display = 'none';
                        document.querySelector('.childhealth-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.childhealth-tick').style.display = 'block';
                        healthPolicy = true;
                    } else {
                        // Reset the display for both images
                        document.querySelector('.childhealth-tick').style.display = 'none';
                        document.querySelector('.childhealth-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.childhealth-circle').style.display = 'block';
                        healthPolicy = true;
                    }
                }

                var inputs = document.querySelectorAll('#healthpolicies input');
            
                inputs.forEach(function(input) {
                    if (input.value.trim() === '') {
                        input.classList.add('input-error'); // Add a class to highlight empty input
                        
                    } else {
                        input.classList.remove('input-error'); // Remove error class if input is not empty
                    }
                });

                // outside weiver details
                let outsideWeiver;
                if (document.getElementById('outsideengagements') != null) {
                    if (response.outside_waiver_parent_sign_outside_engagements_waiver == 1) {
                        document.getElementById('outside_waiver_parent_sign_outside_engagements_waiver').checked = true;
                    } else {
                        document.getElementById('outside_waiver_parent_sign_outside_engagements_waiver').checked = false;
                    }
                    if (typeof response.outside_waiver_parent_sign_outside_engagements_waiver !== "undefined") {
                        // Reset the display for both images
                        document.querySelector('.childoutside-tick').style.display = 'none';
                        document.querySelector('.childoutside-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.childoutside-tick').style.display = 'block';
                        outsideWeiver = true;
                    } else {
                        // Reset the display for both images
                        document.querySelector('.childoutside-tick').style.display = 'none';
                        document.querySelector('.childoutside-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.childoutside-circle').style.display = 'block';
                        outsideWeiver = false;
                    }
                }

                var inputs = document.querySelectorAll('#outsideengagements input');
            
                inputs.forEach(function(input) {
                    if (input.value.trim() === '') {
                        input.classList.add('input-error'); // Add a class to highlight empty input
                        
                    } else {
                        input.classList.remove('input-error'); // Remove error class if input is not empty
                    }
                });

                // social media details
                let socialMedia;
                if (document.getElementById('socialmediaapproval') != null) {

                    if (response.approve_social_media_post == "approve_social_media_post") {
                        document.getElementById('approve_social_media_post1').checked = true;
                    } else {
                        document.getElementById('approve_social_media_post2').checked = true;
                    }
                    if (typeof response.printed_name_social_media_post !== "undefined")
                        document.getElementsByName('printed_name_social_media_post')[0].value = response.administration_first_aid_procedures;
                    if (response.do_you_agree_this_social_media_post == 1) {
                        document.getElementById('do_you_agree_this_social_media_post').checked = true;
                    } else {
                        document.getElementById('do_you_agree_this_social_media_post').checked = false;
                    }

                    if (typeof response.approve_social_media_post !== "undefined" &&
                        typeof response.printed_name_social_media_post !== "undefined" &&
                        typeof response.do_you_agree_this_social_media_post !== "undefined"
                    ) {
                        // Reset the display for both images
                        document.querySelector('.socialmedia-tick').style.display = 'none';
                        document.querySelector('.socialmedia-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.socialmedia-tick').style.display = 'block';
                        socialMedia = true;

                    } else {
                        // Reset the display for both images
                        document.querySelector('.socialmedia-tick').style.display = 'none';
                        document.querySelector('.socialmedia-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.socialmedia-circle').style.display = 'block';
                        socialMedia = false;
                    }

                }

                var inputs = document.querySelectorAll('#socialmediaapproval input');
            
                inputs.forEach(function(input) {
                    if (input.value.trim() === '') {
                        input.classList.add('input-error'); // Add a class to highlight empty input
                        
                    } else {
                        input.classList.remove('input-error'); // Remove error class if input is not empty
                    }
                });

                // Admission form parent agreement
                let admissionparentsign;
                if (document.getElementById('parentsignature') != null) {
                    if (typeof response.parent_sign_admission !== "undefined") {
                        document.getElementsByName('parent_sign_admission')[0].value = response.parent_sign_admission;
                    }
                    if (typeof response.parent_sign_date_admission !== "undefined") {
                        document.getElementsByName('parent_sign_date_admission')[0].value = response.parent_sign_date_admission;
                    }

                    if (typeof response.parent_sign_admission !== "undefined" &&
                        typeof response.parent_sign_date_admission !== "undefined") {
                        // Reset the display for both images
                        document.querySelector('.childparent-tick').style.display = 'none';
                        document.querySelector('.childparent-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.childparent-tick').style.display = 'block';
                        admissionparentsign = true;

                    } else {
                        // Reset the display for both images
                        document.querySelector('.childparent-tick').style.display = 'none';
                        document.querySelector('.childparent-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.childparent-circle').style.display = 'block';
                        admissionparentsign = false;
                    }

                    if (childbasicInfo == true && childparentInfo == true &&
                        childEmergencyContact == true && childMedicalcare == true &&
                        childParentAgreementOne == true && childHistory == true &&
                        medicalHistory == true && pregnancyHistory == true &&
                        familyHistroy == true && socialBehavior == true &&
                        environmentalFactor == true && parentAgreementTwo == true &&
                        immunizationInstruction == true && childProfile == true &&
                        nutritionDetails == true && restDetails == true &&
                        medicalDetails == true && parentAgreementThree == true &&
                        pickupPassword == true && photoVideoPermission == true &&
                        securityPolicy == true && medicaltransportationWeiver == true &&
                        healthPolicy == true && outsideWeiver == true && socialMedia == true

                    ) {
                        let parentFinalAgreement = document.getElementById('parentFinalAgreement');
                        parentFinalAgreement.classList.remove('disabled');
                    } else {
                        let parentFinalAgreement = document.getElementById('parentFinalAgreement');
                        parentFinalAgreement.classList.add('disabled');
                    }
                }

                var inputs = document.querySelectorAll('#parentsignature input');
            
                inputs.forEach(function(input) {
                    if (input.value.trim() === '') {
                        input.classList.add('input-error'); // Add a class to highlight empty input
                        
                    } else {
                        input.classList.remove('input-error'); // Remove error class if input is not empty
                    }
                });

                if (childbasicInfo == true && childparentInfo == true &&
                    childEmergencyContact == true && childMedicalcare == true &&
                    childParentAgreementOne == true && childHistory == true &&
                    medicalHistory == true && pregnancyHistory == true &&
                    familyHistroy == true && socialBehavior == true &&
                    environmentalFactor == true && parentAgreementTwo == true &&
                    immunizationInstruction == true && childProfile == true &&
                    nutritionDetails == true && restDetails == true &&
                    medicalDetails == true && parentAgreementThree == true &&
                    pickupPassword == true && photoVideoPermission == true &&
                    securityPolicy == true && medicaltransportationWeiver == true &&
                    healthPolicy == true && outsideWeiver == true && socialMedia == true
                    && admissionparentsign == true) {
                    // Reset the display for both images
                    document.querySelector('.admission-tick').style.display = 'none';
                    document.querySelector('.admission-circle').style.display = 'none';
                    // Update the display for the clicked card
                    document.querySelector('.admission-tick').style.display = 'block';
                } else {
                    // Reset the display for both images
                    document.querySelector('.admission-tick').style.display = 'none';
                    document.querySelector('.admission-circle').style.display = 'none';
                    // Update the display for the clicked card
                    document.querySelector('.admission-circle').style.display = 'block';
                }


                //Admission form admin restriction
                if (document.getElementById('adminsignature') != null) {
                    if (localStorage.getItem('logged_in_email') == 'goddard01arjava@gmail.com') {
                        let adminFinalAgreement = document.getElementById('adminFinalAgreement');
                        adminFinalAgreement.classList.remove('disabled');
                    } else {
                        let adminFinalAgreement = document.getElementById('adminFinalAgreement');
                        adminFinalAgreement.classList.add('disabled');
                    }
                }

                //enrollment data
                let enrollmentDetails;
                let enrollmentparent;
                if (document.getElementById('childenrollmentagreement') != null) {
                    // if (typeof response.point_one_field_one !== "undefined")
                    //     document.getElementsByName("point_one_field_one")[0].value = response.point_one_field_one;
                    // if (typeof response.point_one_field_two !== "undefined")
                    //     document.getElementsByName("point_one_field_two")[0].value = response.point_one_field_two;
                    if (typeof response.point_one_field_three !== "undefined")
                        document.getElementsByName("point_one_field_three")[0].value = response.point_one_field_three;
                    if (typeof response.point_two_initial_here !== "undefined")
                        document.getElementsByName("point_two_initial_here")[0].value = response.point_two_initial_here;
                    if (typeof response.point_three_initial_here !== "undefined")
                        document.getElementsByName("point_three_initial_here")[0].value = response.point_three_initial_here;
                    if (typeof response.point_four_initial_here !== "undefined")
                        document.getElementsByName("point_four_initial_here")[0].value = response.point_four_initial_here;
                    if (typeof response.point_five_initial_here !== "undefined")
                        document.getElementsByName("point_five_initial_here")[0].value = response.point_five_initial_here;
                    if (typeof response.point_six_initial_here !== "undefined")
                        document.getElementsByName("point_six_initial_here")[0].value = response.point_six_initial_here;
                    if (typeof response.point_seven_initial_here !== "undefined")
                        document.getElementsByName("point_seven_initial_here")[0].value = response.point_seven_initial_here;
                    if (typeof response.point_eight_initial_here !== "undefined")
                        document.getElementsByName("point_eight_initial_here")[0].value = response.point_eight_initial_here;
                    if (typeof response.point_nine_initial_here !== "undefined")
                        document.getElementsByName("point_nine_initial_here")[0].value = response.point_nine_initial_here;
                    if (typeof response.point_ten_initial_here !== "undefined")
                        document.getElementsByName("point_ten_initial_here")[0].value = response.point_ten_initial_here;
                    if (typeof response.point_eleven_initial_here !== "undefined")
                        document.getElementsByName("point_eleven_initial_here")[0].value = response.point_eleven_initial_here;
                    if (typeof response.point_twelve_initial_here !== "undefined")
                        document.getElementsByName("point_twelve_initial_here")[0].value = response.point_twelve_initial_here;
                    if (typeof response.point_thirteen_initial_here !== "undefined")
                        document.getElementsByName("point_thirteen_initial_here")[0].value = response.point_thirteen_initial_here;
                    if (typeof response.point_fourteen_initial_here !== "undefined")
                        document.getElementsByName("point_fourteen_initial_here")[0].value = response.point_fourteen_initial_here;
                    if (typeof response.point_fifteen_initial_here !== "undefined")
                        document.getElementsByName("point_fifteen_initial_here")[0].value = response.point_fifteen_initial_here;
                    if (typeof response.point_sixteen_initial_here !== "undefined")
                        document.getElementsByName("point_sixteen_initial_here")[0].value = response.point_sixteen_initial_here;
                    if (typeof response.point_seventeen_initial_here !== "undefined")
                        document.getElementsByName("point_seventeen_initial_here")[0].value = response.point_seventeen_initial_here;
                    if (typeof response.point_eighteen_initial_here !== "undefined")
                        document.getElementsByName("point_eighteen_initial_here")[0].value = response.point_eighteen_initial_here;
                    if (typeof response.point_nineteen_initial_here !== "undefined")
                        document.getElementsByName("point_nineteen_initial_here")[0].value = response.point_nineteen_initial_here;
                    if (typeof response.preferred_start_date !== "undefined")
                        document.getElementsByName("preferred_start_date")[0].value = response.preferred_start_date;
                    if (typeof response.preferred_schedule !== "undefined")
                        document.getElementsByName("preferred_schedule")[0].value = response.preferred_schedule;
                    if (response.full_day == 1) {
                        document.getElementById('full_day').checked = true;
                    } else {
                        document.getElementById('full_day').checked = false;
                    }
                    if (response.half_day == 1) {
                        document.getElementById('half_day').checked = true;
                    } else {
                        document.getElementById('half_day').checked = false;
                    }

                    if (typeof response.point_one_field_three !== "undefined" &&
                        typeof response.point_two_initial_here !== "undefined" &&
                        typeof response.point_three_initial_here !== "undefined" &&
                        typeof response.point_four_initial_here !== "undefined" &&
                        typeof response.point_five_initial_here !== "undefined" &&
                        typeof response.point_six_initial_here !== "undefined" &&
                        typeof response.point_seven_initial_here !== "undefined" &&
                        typeof response.point_eight_initial_here !== "undefined" &&
                        typeof response.point_nine_initial_here !== "undefined" &&
                        typeof response.point_ten_initial_here !== "undefined" &&
                        typeof response.point_eleven_initial_here !== "undefined" &&
                        typeof response.point_twelve_initial_here !== "undefined" &&
                        typeof response.point_thirteen_initial_here !== "undefined" &&
                        typeof response.point_fourteen_initial_here !== "undefined" &&
                        typeof response.point_fifteen_initial_here !== "undefined" &&
                        typeof response.point_sixteen_initial_here !== "undefined" &&
                        typeof response.point_seventeen_initial_here !== "undefined" &&
                        typeof response.point_eighteen_initial_here !== "undefined" &&
                        typeof response.point_nineteen_initial_here !== "undefined" &&
                        typeof response.preferred_start_date !== "undefined" &&
                        typeof response.preferred_schedule !== "undefined"
                    ) {

                        let enrollmentFinalAgreement = document.getElementById('enrollmentFinalAgreement');
                        enrollmentFinalAgreement.classList.remove('disabled');
                        // Reset the display for both images
                        document.querySelector('.childenrollmentagreement-tick').style.display = 'none';
                        document.querySelector('.childenrollmentagreement-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.childenrollmentagreement-tick').style.display = 'block';
                        enrollmentDetails = true;
                    } else {
                        let enrollmentFinalAgreement = document.getElementById('enrollmentFinalAgreement');
                        enrollmentFinalAgreement.classList.add('disabled');
                        // Reset the display for both images
                        document.querySelector('.childenrollmentagreement-tick').style.display = 'none';
                        document.querySelector('.childenrollmentagreement-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.childenrollmentagreement-circle').style.display = 'block';
                        enrollmentDetails = false;
                    }
                }
                var inputs = document.querySelectorAll('#childenrollmentagreement input');
            
                inputs.forEach(function(input) {
                    if (input.value.trim() === '') {
                        input.classList.add('input-error'); // Add a class to highlight empty input
                        
                    } else {
                        input.classList.remove('input-error'); // Remove error class if input is not empty
                    }
                });

                if (document.getElementById('childenrollmentagreementparentsign') != null) {
                    if (typeof response.parent_sign_enroll !== "undefined") {
                        document.getElementsByName('parent_sign_enroll')[0].value = response.parent_sign_enroll;
                    }
                    if (typeof response.parent_sign_date_enroll !== "undefined") {
                        document.getElementsByName('parent_sign_date_enroll')[0].value = response.parent_sign_date_enroll;
                    }

                    if (typeof response.parent_sign_enroll !== "undefined" &&
                        typeof response.parent_sign_date_enroll !== "undefined") {
                        // Reset the display for both images
                        document.querySelector('.childenrollmentagreementparentsign-tick').style.display = 'none';
                        document.querySelector('.childenrollmentagreementparentsign-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.childenrollmentagreementparentsign-tick').style.display = 'block';
                        enrollmentparent = true;
                    } else {
                        // Reset the display for both images
                        document.querySelector('.childenrollmentagreementparentsign-tick').style.display = 'none';
                        document.querySelector('.childenrollmentagreementparentsign-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.childenrollmentagreementparentsign-circle').style.display = 'block';
                        enrollmentparent = false;
                    }
                    if (enrollmentDetails == true && enrollmentparent == true
                    ) {
                        // Reset the display for both images
                        document.querySelector('.childenrollment-tick').style.display = 'none';
                        document.querySelector('.childenrollment-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.childenrollment-tick').style.display = 'block';
                    } else {
                        // Reset the display for both images
                        document.querySelector('.childenrollment-tick').style.display = 'none';
                        document.querySelector('.childenrollment-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.childenrollment-circle').style.display = 'block';
                    }
                }

                var inputs = document.querySelectorAll('#childenrollmentagreementparentsign input');
            
                inputs.forEach(function(input) {
                    if (input.value.trim() === '') {
                        input.classList.add('input-error'); // Add a class to highlight empty input
                        
                    } else {
                        input.classList.remove('input-error'); // Remove error class if input is not empty
                    }
                });

                //enrollment form admin restriction
                if (document.getElementById('childenrollmentagreementadminsign') != null) {
                    if (localStorage.getItem('logged_in_email') !== 'goddard01arjava@gmail.com') {
                        let adminFinalAgreement = document.getElementById('enrollmentAdminFinalAgreement');
                        adminFinalAgreement.classList.add('disabled');

                    } else {
                        let adminFinalAgreement = document.getElementById('enrollmentAdminFinalAgreement');
                        adminFinalAgreement.classList.remove('disabled');
                    }
                }

                //authorization form
                let authorizationDetails;
                let achparentsign;
                if (document.getElementById('authorizationach') != null) {
                    if (typeof response.bank_routing !== "undefined")
                        document.getElementById("bank_routing").value = response.bank_routing;
                    if (typeof response.bank_account !== "undefined")
                        document.getElementById("bank_account").value = response.bank_account;
                    if (typeof response.driver_license !== "undefined")
                        document.getElementById("driver_license").value = response.driver_license;
                    if (typeof response.state !== "undefined")
                        document.getElementById("state").value = response.state;
                    // if (typeof response.email !== "undefined")
                    //     document.getElementById("email").value = response.email;
                    if (typeof response.i !== "undefined")
                        document.getElementById("i").value = response.i;

                    if (typeof response.bank_routing !== "undefined" && typeof response.bank_account !== "undefined"
                        && typeof response.driver_license !== "undefined" && typeof response.state !== "undefined"
                        && typeof response.i !== "undefined") {
                        let achFinalAgreement = document.getElementById('achFinalAgreement');
                        achFinalAgreement.classList.remove('disabled');
                        // Reset the display for both images
                        document.querySelector('.authorizationach-tick').style.display = 'none';
                        document.querySelector('.authorizationach-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.authorizationach-tick').style.display = 'block';
                        authorizationDetails = true;
                    } else {
                        let achFinalAgreement = document.getElementById('achFinalAgreement');
                        achFinalAgreement.classList.add('disabled');
                        // Reset the display for both images
                        document.querySelector('.authorizationach-tick').style.display = 'none';
                        document.querySelector('.authorizationach-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.authorizationach-circle').style.display = 'block';
                        authorizationDetails = false;
                    }
                }

                var inputs = document.querySelectorAll('#authorizationach input');
            
                inputs.forEach(function(input) {
                    if (input.value.trim() === '') {
                        input.classList.add('input-error'); // Add a class to highlight empty input
                        
                    } else {
                        input.classList.remove('input-error'); // Remove error class if input is not empty
                    }
                });

                if (document.getElementById('authorizationparentsign') != null) {
                    if (typeof response.parent_sign_ach !== "undefined") {
                        document.getElementsByName('parent_sign_ach')[0].value = response.parent_sign_ach;
                    }
                    if (typeof response.parent_sign_date_ach !== "undefined") {
                        document.getElementsByName('parent_sign_date_ach')[0].value = response.parent_sign_date_ach;
                    }

                    if (typeof response.parent_sign_ach !== "undefined" &&
                        typeof response.parent_sign_date_ach !== "undefined") {
                        // Reset the display for both images
                        document.querySelector('.authorizationparentsign-tick').style.display = 'none';
                        document.querySelector('.authorizationparentsign-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.authorizationparentsign-tick').style.display = 'block';
                        achparentsign = true;
                    } else {
                        // Reset the display for both images
                        document.querySelector('.authorizationparentsign-tick').style.display = 'none';
                        document.querySelector('.authorizationparentsign-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.authorizationparentsign-circle').style.display = 'block';
                        achparentsign = false;
                    }

                    if (authorizationDetails == true && achparentsign == true) {
                        // Reset the display for both images
                        document.querySelector('.authorization-tick').style.display = 'none';
                        document.querySelector('.authorization-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.authorization-tick').style.display = 'block';
                    } else {
                        // Reset the display for both images
                        document.querySelector('.authorization-tick').style.display = 'none';
                        document.querySelector('.authorization-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.authorization-circle').style.display = 'block';
                    }
                }

                var inputs = document.querySelectorAll('#authorizationparentsign input');
            
                inputs.forEach(function(input) {
                    if (input.value.trim() === '') {
                        input.classList.add('input-error'); // Add a class to highlight empty input
                        
                    } else {
                        input.classList.remove('input-error'); // Remove error class if input is not empty
                    }
                });
                //authorization form admin restriction
                if (document.getElementById('authorizationadminsign') != null) {
                    if (localStorage.getItem('logged_in_email') !== 'goddard01arjava@gmail.com') {
                        let adminFinalAgreement = document.getElementById('achAdminFinalAgreement');
                        adminFinalAgreement.classList.add('disabled');

                    } else {
                        let adminFinalAgreement = document.getElementById('achAdminFinalAgreement');
                        adminFinalAgreement.classList.remove('disabled');
                    }
                }
                

                //parent Handbook form
                let welcome_goddard_agreement;
                let parentHandBook;
                if (document.getElementById('volumeone') != null) {
                    if (response.parent_hand_book['welcome_goddard_agreement'] == 1) {
                        document.getElementById('welcome_goddard_agreement').checked = true;
                    } else {
                        document.getElementById('welcome_goddard_agreement').checked = false;
                    }

                    if (typeof response.parent_hand_book['welcome_goddard_agreement'] !== "undefined") {
                        // Reset the display for both images
                        document.querySelector('.goddard-tick').style.display = 'none';
                        document.querySelector('.goddard-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.goddard-tick').style.display = 'block';
                        welcome_goddard_agreement = true;
                    } else {
                        // Reset the display for both images
                        document.querySelector('.goddard-tick').style.display = 'none';
                        document.querySelector('.goddard-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.goddard-circle').style.display = 'block';
                        welcome_goddard_agreement = false;
                    }

                    let mission_statement_agreement;
                    if (response.parent_hand_book['mission_statement_agreement'] == 1) {
                        document.getElementById('mission_statement_agreement').checked = true;
                    } else {
                        document.getElementById('mission_statement_agreement').checked = false;
                    }
                    if (typeof response.parent_hand_book['mission_statement_agreement'] !== "undefined") {
                        // Reset the display for both images
                        document.querySelector('.mission-tick').style.display = 'none';
                        document.querySelector('.mission-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.mission-tick').style.display = 'block';
                        mission_statement_agreement = true;
                    } else {
                        // Reset the display for both images
                        document.querySelector('.mission-tick').style.display = 'none';
                        document.querySelector('.mission-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.mission-circle').style.display = 'block';
                        mission_statement_agreement = false;
                    }

                    let general_information_agreement;
                    if (response.parent_hand_book['general_information_agreement'] == 1) {
                        document.getElementById('general_information_agreement').checked = true;
                    } else {
                        document.getElementById('general_information_agreement').checked = false;
                    }
                    if (typeof response.parent_hand_book['general_information_agreement'] !== "undefined") {
                        // Reset the display for both images
                        document.querySelector('.generalinfo-tick').style.display = 'none';
                        document.querySelector('.generalinfo-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.generalinfo-tick').style.display = 'block';
                        general_information_agreement = true;
                    } else {
                        // Reset the display for both images
                        document.querySelector('.generalinfo-tick').style.display = 'none';
                        document.querySelector('.generalinfo-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.generalinfo-circle').style.display = 'block';
                        general_information_agreement = false;
                    }


                    let medical_care_provider_agreement;
                    if (response.parent_hand_book['medical_care_provider_agreement'] == 1) {
                        document.getElementById('medical_care_provider_agreement').checked = true;
                    } else {
                        document.getElementById('medical_care_provider_agreement').checked = false;
                    }
                    if (typeof response.parent_hand_book['medical_care_provider_agreement'] !== "undefined") {
                        // Reset the display for both images
                        document.querySelector('.statement-tick').style.display = 'none';
                        document.querySelector('.statement-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.statement-tick').style.display = 'block';
                        medical_care_provider_agreement = true;
                    } else {
                        // Reset the display for both images
                        document.querySelector('.statement-tick').style.display = 'none';
                        document.querySelector('.statement-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.statement-circle').style.display = 'block';
                        medical_care_provider_agreement = false;
                    }

                    let parent_access_agreement;
                    if (response.parent_hand_book['parent_access_agreement'] == 1) {
                        document.getElementById('parent_access_agreement').checked = true;
                    } else {
                        document.getElementById('parent_access_agreement').checked = false;
                    }
                    if (typeof response.parent_hand_book['parent_access_agreement'] !== "undefined") {
                        // Reset the display for both images
                        document.querySelector('.parentaccess-tick').style.display = 'none';
                        document.querySelector('.parentaccess-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.parentaccess-tick').style.display = 'block';
                        parent_access_agreement = true;
                    } else {
                        // Reset the display for both images
                        document.querySelector('.parentaccess-tick').style.display = 'none';
                        document.querySelector('.parentaccess-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.parentaccess-circle').style.display = 'block';
                        parent_access_agreement = false;
                    }
                    let release_of_children_agreement;
                    if (response.parent_hand_book['release_of_children_agreement'] == 1) {
                        document.getElementById('release_of_children_agreement').checked = true;
                    } else {
                        document.getElementById('release_of_children_agreement').checked = false;
                    }
                    if (typeof response.parent_hand_book['release_of_children_agreement'] !== "undefined") {
                        // Reset the display for both images
                        document.querySelector('.releasechild-tick').style.display = 'none';
                        document.querySelector('.releasechild-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.releasechild-tick').style.display = 'block';
                        release_of_children_agreement = true;
                    } else {
                        // Reset the display for both images
                        document.querySelector('.releasechild-tick').style.display = 'none';
                        document.querySelector('.releasechild-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.releasechild-circle').style.display = 'block';
                        release_of_children_agreement = false;
                    }


                    let registration_fees_agreement;
                    if (response.parent_hand_book['registration_fees_agreement'] == 1) {
                        document.getElementById('registration_fees_agreement').checked = true;
                    } else {
                        document.getElementById('registration_fees_agreement').checked = false;
                    }
                    if (typeof response.parent_hand_book['registration_fees_agreement'] !== "undefined") {
                        // Reset the display for both images
                        document.querySelector('.fees-tick').style.display = 'none';
                        document.querySelector('.fees-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.fees-tick').style.display = 'block';
                        registration_fees_agreement = true;
                    } else {
                        // Reset the display for both images
                        document.querySelector('.fees-tick').style.display = 'none';
                        document.querySelector('.fees-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.fees-circle').style.display = 'block';
                        registration_fees_agreement = false;
                    }

                    let outside_engagements_agreement;
                    if (response.parent_hand_book['outside_engagements_agreement'] == 1) {
                        document.getElementById('outside_engagements_agreement').checked = true;
                    } else {
                        document.getElementById('outside_engagements_agreement').checked = false;
                    }
                    if (typeof response.parent_hand_book['outside_engagements_agreement'] !== "undefined") {
                        // Reset the display for both images
                        document.querySelector('.outsideengagement-tick').style.display = 'none';
                        document.querySelector('.outsideengagement-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.outsideengagement-tick').style.display = 'block';
                        outside_engagements_agreement = true;
                    } else {
                        // Reset the display for both images
                        document.querySelector('.outsideengagement-tick').style.display = 'none';
                        document.querySelector('.outsideengagement-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.outsideengagement-circle').style.display = 'block';
                        outside_engagements_agreement = false;
                    }

                    let health_policies_agreement;
                    if (response.parent_hand_book['health_policies_agreement'] == 1) {
                        document.getElementById('health_policies_agreement').checked = true;
                    } else {
                        document.getElementById('health_policies_agreement').checked = false;
                    }
                    if (typeof response.parent_hand_book['health_policies_agreement'] !== "undefined") {
                        // Reset the display for both images
                        document.querySelector('.healthpolicies-tick').style.display = 'none';
                        document.querySelector('.healthpolicies-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.healthpolicies-tick').style.display = 'block';
                        health_policies_agreement = true;
                    } else {
                        // Reset the display for both images
                        document.querySelector('.healthpolicies-tick').style.display = 'none';
                        document.querySelector('.healthpolicies-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.healthpolicies-circle').style.display = 'block';
                        health_policies_agreement = false;
                    }


                    let medication_procedures_agreement;
                    if (response.parent_hand_book['medication_procedures_agreement'] == 1) {
                        document.getElementById('medication_procedures_agreement').checked = true;
                    } else {
                        document.getElementById('medication_procedures_agreement').checked = false;
                    }
                    if (typeof response.parent_hand_book['medication_procedures_agreement'] !== "undefined") {
                        // Reset the display for both images
                        document.querySelector('.medicationprocedures-tick').style.display = 'none';
                        document.querySelector('.medicationprocedures-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.medicationprocedures-tick').style.display = 'block';
                        medication_procedures_agreement = true;
                    } else {
                        // Reset the display for both images
                        document.querySelector('.medicationprocedures-tick').style.display = 'none';
                        document.querySelector('.medicationprocedures-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.medicationprocedures-circle').style.display = 'block';
                        medication_procedures_agreement = false;
                    }


                    let bring_to_school_agreement;
                    if (response.parent_hand_book['bring_to_school_agreement'] == 1) {
                        document.getElementById('bring_to_school_agreement').checked = true;
                    } else {
                        document.getElementById('bring_to_school_agreement').checked = false;
                    }
                    if (typeof response.parent_hand_book['bring_to_school_agreement'] !== "undefined") {
                        // Reset the display for both images
                        document.querySelector('.toysfromhome-tick').style.display = 'none';
                        document.querySelector('.toysfromhome-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.toysfromhome-tick').style.display = 'block';
                        bring_to_school_agreement = true;
                    } else {
                        // Reset the display for both images
                        document.querySelector('.toysfromhome-tick').style.display = 'none';
                        document.querySelector('.toysfromhome-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.toysfromhome-circle').style.display = 'block';
                        bring_to_school_agreement = false;
                    }

                    let rest_time_agreement;
                    if (response.parent_hand_book['rest_time_agreement'] == 1) {
                        document.getElementById('rest_time_agreement').checked = true;
                    } else {
                        document.getElementById('rest_time_agreement').checked = false;
                    }
                    if (typeof response.parent_hand_book['rest_time_agreement'] !== "undefined") {
                        // Reset the display for both images
                        document.querySelector('.restmealssnacks-tick').style.display = 'none';
                        document.querySelector('.restmealssnacks-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.restmealssnacks-tick').style.display = 'block';
                        rest_time_agreement = true;
                    } else {
                        // Reset the display for both images
                        document.querySelector('.restmealssnacks-tick').style.display = 'none';
                        document.querySelector('.restmealssnacks-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.restmealssnacks-circle').style.display = 'block';
                        rest_time_agreement = false;
                    }

                    let training_philosophy_agreement;
                    if (response.parent_hand_book['training_philosophy_agreement'] == 1) {
                        document.getElementById('training_philosophy_agreement').checked = true;
                    } else {
                        document.getElementById('training_philosophy_agreement').checked = false;
                    }
                    if (typeof response.parent_hand_book['training_philosophy_agreement'] !== "undefined") {
                        // Reset the display for both images
                        document.querySelector('.transition-tick').style.display = 'none';
                        document.querySelector('.transition-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.transition-tick').style.display = 'block';
                        training_philosophy_agreement = true;
                    } else {
                        // Reset the display for both images
                        document.querySelector('.transition-tick').style.display = 'none';
                        document.querySelector('.transition-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.transition-circle').style.display = 'block';
                        training_philosophy_agreement = false;
                    }

                    let affiliation_policy_agreement;
                    if (response.parent_hand_book['affiliation_policy_agreement'] == 1) {
                        document.getElementById('affiliation_policy_agreement').checked = true;
                    } else {
                        document.getElementById('affiliation_policy_agreement').checked = false;
                    }
                    if (typeof response.parent_hand_book['affiliation_policy_agreement'] !== "undefined") {
                        // Reset the display for both images
                        document.querySelector('.emergencyclosings-tick').style.display = 'none';
                        document.querySelector('.emergencyclosings-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.emergencyclosings-tick').style.display = 'block';
                        affiliation_policy_agreement = true;
                    } else {
                        // Reset the display for both images
                        document.querySelector('.emergencyclosings-tick').style.display = 'none';
                        document.querySelector('.emergencyclosings-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.emergencyclosings-circle').style.display = 'block';
                        affiliation_policy_agreement = false;
                    }

                    let security_issue_agreement;
                    if (response.parent_hand_book['security_issue_agreement'] == 1) {
                        document.getElementById('security_issue_agreement').checked = true;
                    } else {
                        document.getElementById('security_issue_agreement').checked = false;
                    }
                    if (typeof response.parent_hand_book['security_issue_agreement'] !== "undefined") {
                        // Reset the display for both images
                        document.querySelector('.websitesblogs-tick').style.display = 'none';
                        document.querySelector('.websitesblogs-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.websitesblogs-tick').style.display = 'block';
                        security_issue_agreement = true;
                    } else {
                        // Reset the display for both images
                        document.querySelector('.websitesblogs-tick').style.display = 'none';
                        document.querySelector('.websitesblogs-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.websitesblogs-circle').style.display = 'block';
                        security_issue_agreement = false;
                    }

                    let expulsion_policy_agreement;
                    if (response.parent_hand_book['expulsion_policy_agreement'] == 1) {
                        document.getElementById('expulsion_policy_agreement').checked = true;
                    } else {
                        document.getElementById('expulsion_policy_agreement').checked = false;
                    }
                    if (typeof response.parent_hand_book['expulsion_policy_agreement'] !== "undefined") {
                        // Reset the display for both images
                        document.querySelector('.expulsionpolicy-tick').style.display = 'none';
                        document.querySelector('.expulsionpolicy-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.expulsionpolicy-tick').style.display = 'block';
                        expulsion_policy_agreement = true;
                    } else {
                        // Reset the display for both images
                        document.querySelector('.expulsionpolicy-tick').style.display = 'none';
                        document.querySelector('.expulsionpolicy-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.expulsionpolicy-circle').style.display = 'block';
                        expulsion_policy_agreement = false;
                    }

                    let addressing_individual_child_agreement;
                    if (response.parent_hand_book['addressing_individual_child_agreement'] == 1) {
                        document.getElementById('addressing_individual_child_agreement').checked = true;
                    } else {
                        document.getElementById('addressing_individual_child_agreement').checked = false;
                    }
                    if (typeof response.parent_hand_book['addressing_individual_child_agreement'] !== "undefined") {
                        // Reset the display for both images
                        document.querySelector('.addressing-tick').style.display = 'none';
                        document.querySelector('.addressing-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.addressing-tick').style.display = 'block';
                        addressing_individual_child_agreement = true;
                    } else {
                        // Reset the display for both images
                        document.querySelector('.addressing-tick').style.display = 'none';
                        document.querySelector('.addressing-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.addressing-circle').style.display = 'block';
                        addressing_individual_child_agreement = false;
                    }

                    let finalword_agreement;
                    if (response.parent_hand_book['finalword_agreement'] == 1) {
                        document.getElementById('finalword_agreement').checked = true;
                    } else {
                        document.getElementById('finalword_agreement').checked = false;
                    }
                    if (typeof response.parent_hand_book['finalword_agreement'] !== "undefined") {
                        // Reset the display for both images
                        document.querySelector('.finalword-tick').style.display = 'none';
                        document.querySelector('.finalword-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.finalword-tick').style.display = 'block';
                        finalword_agreement = true;
                    } else {
                        // Reset the display for both images
                        document.querySelector('.finalword-tick').style.display = 'none';
                        document.querySelector('.finalword-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.finalword-circle').style.display = 'block';
                        finalword_agreement = false;
                    }

                    if (welcome_goddard_agreement == true &&
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
                        security_issue_agreement == true && expulsion_policy_agreement == true &&
                        addressing_individual_child_agreement == true &&
                        finalword_agreement == true
                    ) {
                        let handbookFinalAgreement = document.getElementById('handbookFinalAgreement');
                        handbookFinalAgreement.classList.remove('disabled');
                        // Reset the display for both images
                        document.querySelector('.goddardschool1-tick').style.display = 'none';
                        document.querySelector('.goddardschool1-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.goddardschool1-tick').style.display = 'block';
                        parentHandBook = true;
                    } else {
                        let handbookFinalAgreement = document.getElementById('handbookFinalAgreement');
                        handbookFinalAgreement.classList.add('disabled');
                        // Reset the display for both images
                        document.querySelector('.goddardschool1-tick').style.display = 'none';
                        document.querySelector('.goddardschool1-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.goddardschool1-circle').style.display = 'block';
                        parentHandBook = false;
                    }
                }
                var inputs = document.querySelectorAll('#volumeone input');
            
                inputs.forEach(function(input) {
                    if (input.value.trim() === '') {
                        input.classList.add('input-error'); // Add a class to highlight empty input
                        
                    } else {
                        input.classList.remove('input-error'); // Remove error class if input is not empty
                    }
                });
                if (document.getElementById('parentsignaturehandbook') != null) {
                    if (typeof response.parent_hand_book['parent_sign_handbook'] !== "undefined") {
                        document.getElementsByName('parent_sign_handbook')[0].value = response.parent_hand_book['parent_sign_handbook'];
                    }
                    if (typeof response.parent_hand_book['parent_sign_date_handbook'] !== "undefined") {
                        document.getElementsByName('parent_sign_date_handbook')[0].value = response.parent_hand_book['parent_sign_date_handbook'];
                    }
                    let parenthandbookparentsign;
                    if (typeof response.parent_hand_book['parent_sign_handbook'] !== "undefined" &&
                        typeof response.parent_hand_book['parent_sign_date_handbook'] !== "undefined") {
                        // Reset the display for both images
                        document.querySelector('.childparenthandbook-tick').style.display = 'none';
                        document.querySelector('.childparenthandbook-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.childparenthandbook-tick').style.display = 'block';
                        parenthandbookparentsign = true;
                    } else {
                        // Reset the display for both images
                        document.querySelector('.childparenthandbook-tick').style.display = 'none';
                        document.querySelector('.childparenthandbook-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.childparenthandbook-circle').style.display = 'block';
                        parenthandbookparentsign = false;
                    }
                    if (parentHandBook == true && parenthandbookparentsign == true
                    ) {

                        // Reset the display for both images
                        document.querySelector('.handbook-tick').style.display = 'none';
                        document.querySelector('.handbook-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.handbook-tick').style.display = 'block';
                    } else {

                        // Reset the display for both images
                        document.querySelector('.handbook-tick').style.display = 'none';
                        document.querySelector('.handbook-circle').style.display = 'none';
                        // Update the display for the clicked card
                        document.querySelector('.handbook-circle').style.display = 'block';
                    }
                }

                var inputs = document.querySelectorAll('#parentsignaturehandbook input');
            
                inputs.forEach(function(input) {
                    if (input.value.trim() === '') {
                        input.classList.add('input-error'); // Add a class to highlight empty input
                        
                    } else {
                        input.classList.remove('input-error'); // Remove error class if input is not empty
                    }
                });

                //authorization form admin restriction
                if (document.getElementById('adminsignaturehandbook') != null) {
                    if (localStorage.getItem('logged_in_email') !== 'goddard01arjava@gmail.com') {
                        let adminFinalAgreement = document.getElementById('handbookAdminFinalAgreement');
                        adminFinalAgreement.classList.add('disabled');

                    } else {
                        let adminFinalAgreement = document.getElementById('handbookAdminFinalAgreement');
                        adminFinalAgreement.classList.remove('disabled');
                    }
                }
                //to set all response value into local storage variable
                window.localStorage.setItem("responseData", JSON.stringify(response));
            }
        });
    }
}

var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl)
})


$(document).ready(function () {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
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

