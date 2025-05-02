import {isAuthenticated} from "./authentication_verify.js";

var year = new Date().getFullYear() + '';
// Function to submit the form data
function submitForm(editID,number) {
    const form = document.getElementById("childInfoAdmission");
    var old = form;
    var new_element = old.cloneNode(true);
    //replace the element
    old.parentNode.replaceChild(new_element,old);
    const formData = new FormData(form);
    const obj = Object.fromEntries(formData); 
    console.log(obj);

    var currentDate = new Date(obj.admin_sign_date_admission);
    var epochTime = currentDate.getTime();
    var epochValueConversion = parseInt(epochTime, 10)
    console.log(typeof epochValueConversion);
    obj.admin_sign_date_admission =  epochValueConversion;


    obj.form_year_admission = year;
    obj.pointer = number;
    const bottleFedValue = document.querySelector('input[name="bottle_fed"]:checked')?.value || null;
    const breastFedValue = document.querySelector('input[name="breast_fed"]:checked')?.value || null;

    obj.bottle_fed = bottleFedValue;
    console.log(obj.bottle_fed);
    obj.breast_fed = breastFedValue;
    console.log(obj.breast_fed);
    //to get values from local storage variable and stored it into response1 variable.
    var response=JSON.parse(window.localStorage.getItem("responseData"));
    console.log(response);
    var outputobject ={};
    outputobject.bottle_fed = obj.bottle_fed,
    outputobject.breast_fed = obj.breast_fed,
    outputobject.classid = response.classid;

    


    //to set local response variable id value for outputobject id value.
    if(editID != ''){
        outputobject.primary_parent_email = editID;
    }else{
        outputobject.primary_parent_email = localStorage.getItem('logged_in_email');
    }
    const child_id_val = localStorage.getItem('child_id');
    if (child_id_val !== null && child_id_val !== undefined) {
        outputobject.child_id = child_id_val; 
    }
    var keys = Object.keys(obj);
    
    //compare new date with old data
    keys.forEach(function (key) {
        if(obj[key] != response[key] && obj[key] !=="" ){
            outputobject[key]=obj[key];
        }
    })

    let primary_parent_info = {
        parent_id : response.primary_parent_info.parent_id,
        parent_name: obj.parent_name,
        parent_street_address: obj.parent_street_address,
        parent_city_address: obj.parent_city_address,
        parent_state_address: obj.parent_state_address,
        parent_zip_address: obj.parent_zip_address,
        home_telephone_number: obj.home_telephone_number,
        business_name: obj.business_name,
        work_hours_from: obj.work_hours_from,
        work_hours_to: obj.work_hours_to,
        business_telephone_number: obj.business_telephone_number,
        business_cell_number: obj.business_cell_number,
        parent_email: obj.primary_parent_email
    };
    outputobject.primary_parent_info = primary_parent_info;

    let additional_parent_info = {
        parent_id : response.additional_parent_info.parent_id ? parseInt(response.additional_parent_info.parent_id) : null,
        parent_name: obj.parent_two_name,
        parent_street_address: obj.parent_two_street_address,
        parent_city_address: obj.parent_two_city_address,
        parent_state_address: obj.parent_two_state_address,
        parent_zip_address: obj.parent_two_zip_address,
        home_telephone_number: obj.parent_two_home_telephone_number,
        business_name: obj.parent_two_business_name,
        work_hours_from: obj.parent_two_work_hours_from,
        work_hours_to: obj.parent_two_work_hours_to,
        business_telephone_number: obj.parent_two_business_telephone_number,
        business_cell_number: obj.parent_two_business_cell_number,
        parent_email: obj.parent_two_email
    };
    outputobject.additional_parent_info = additional_parent_info;

    const emergencyContacts = [];
    const emergencyContactsFromResponse = response.emergency_contact_info || []; 
    for (let i = 0; i <= 2; i++) {
        const contactName = formData.get(`child_emergency_contact_name${i}`);
        const contactZip = formData.get(`child_emergency_contact_zip_address${i}`);
        const contactCity = formData.get(`child_emergency_contact_city_address${i}`);
        const contactFullAddress = formData.get(`child_emergency_contact_full_address${i}`);
        const contactRelationship = formData.get(`child_emergency_contact_relationship${i}`);
        const contactState = formData.get(`child_emergency_contact_state_address${i}`);
        const contactPhone = formData.get(`child_emergency_contact_telephone_number${i}`);

        const contactId = emergencyContactsFromResponse[i] ? emergencyContactsFromResponse[i].child_emergency_contact_id : null;
        
        emergencyContacts.push({
            child_emergency_contact_id: contactId, 
            child_emergency_contact_name: contactName,
            child_emergency_contact_zip_address: contactZip,
            child_emergency_contact_city_address: contactCity,
            child_emergency_contact_full_address: contactFullAddress,
            child_emergency_contact_relationship: contactRelationship,
            child_emergency_contact_state_address: contactState,
            child_emergency_contact_telephone_number: contactPhone
        });
    }
    
    outputobject.emergency_contact_info = emergencyContacts;
    console.log(outputobject.emergency_contact_info);
    

    console.log( obj.dentist_telephone_number);
    // Additional objects for specific sections
    let dentistName = document.getElementById('dropdownMenuButton').textContent.trim();
    console.log(dentistName);
    if (dentistName === 'Others') {
        // If "Others" is selected, get the custom input value for dentist name
        dentistName = document.getElementById('child_dentist_name').value;
        console.log(dentistName);
    }else{
        dentistName = document.getElementById('dropdownMenuButton').textContent.trim();
        console.log(dentistName);
    }
    // let dentist_Id;
    // if(response.child_dentist_info){
    //     dentist_Id = response.child_dentist_info.child_dentist_id
    // }
    let dentist_Id = null;
    const selectedDentistOption = document.querySelector('.dropdown-item.active');
    console.log(selectedDentistOption);
    if (selectedDentistOption) {
        dentist_Id = selectedDentistOption.getAttribute('data-value');
        console.log(dentist_Id);
    }
    let child_dentist_info = {
        child_dentist_id : dentist_Id ? parseInt(dentist_Id) : null,
        // child_dentist_id: response.child_dentist_info.child_dentist_id || '',
        child_dentist_name: dentistName || '',
        dentist_telephone_number: document.getElementById('dentist_telephone_number').value,
        dentist_street_address: document.getElementById('dentist_street_address').value,
        dentist_city_address: document.getElementById('dentist_city_address').value,
        dentist_state_address: document.getElementById('dentist_state_address').value,
        dentist_zip_address: document.getElementById('dentist_zip_address').value
    };
    outputobject.child_dentist_info = child_dentist_info;
    console.log(outputobject.child_dentist_info);

    console.log(outputobject.child_dentist_info);
    let care_provider_Id;
    if(response.child_dentist_info){
        care_provider_Id = response.child_care_provider_info.child_care_provider_id
    }
    let child_care_provider_info = {
        child_care_provider_id : care_provider_Id ? parseInt(care_provider_Id) : null,
        // child_care_provider_id : response.child_care_provider_info.child_care_provider_id || '',
        child_care_provider_name: obj.child_care_provider_name,
        child_care_provider_telephone_number: obj.child_care_provider_telephone_number,
        child_hospital_affiliation: obj.child_hospital_affiliation,
        child_care_provider_street_address : obj.child_care_provider_street_address,
        child_care_provider_city_address : obj.child_care_provider_city_address,
        child_care_provider_state_address :obj.child_care_provider_state_address,
        child_care_provider_zip_address :obj.child_care_provider_zip_address
    };
    outputobject.child_care_provider_info = child_care_provider_info;
    console.log(outputobject.breast_fed);
    console.log(outputobject.bottle_fed);

    const json=JSON.stringify(outputobject); 
    console.log(json);
    let xhr = new XMLHttpRequest();
    xhr.onload = () => {
        if (xhr.status === 200) {
            $(".success-msg").show();
            setTimeout(function(){ 
                $(".success-msg").hide(); 
                // window.location.reload();
                // window.location.href = `./parent_dashboard.html?childid=${child_id_val}`;
                sessionStorage.setItem('putcallId',localStorage.getItem('child_id'));
                window.location.href = `./parent_dashboard.html?id=${editID}`;

            }, 3000);
        }else{
            $(".error-msg").show();
            setTimeout(function(){ 
                $(".error-msg").hide(); 
            }, 3000);
        }
    };
    xhr.open("PUT", ` https://ijz2b76zn8.execute-api.ap-south-1.amazonaws.com/test/admission_segment_update/${localStorage.getItem('child_id')}`);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(json);
}

function authorizationSubmitForm(editID,number) {
    const form = document.getElementById("childInfoAuthorization");
    var old = form;
     var new_element = old.cloneNode(true);
     //replace the element
     old.parentNode.replaceChild(new_element,old);
    const formData = new FormData(form);
    const obj = Object.fromEntries(formData);
    console.log(obj);
    console.log(obj.admin_sign_date_ach);

    // const currentDate = obj.admin_sign_date_ach;
    var currentDate = new Date(obj.admin_sign_date_ach);
    var epochTime = currentDate.getTime();
    var epochValueConversion = parseInt(epochTime, 10)
    console.log(typeof epochValueConversion);
    obj.admin_sign_date_ach =  epochValueConversion;
    // console.log(epochTime);

    obj.form_year_ach = year;
    obj.pointer = number;
    //to get values from local storage variable and stored it into response1 variable.
    var response=JSON.parse(window.localStorage.getItem("responseData"));
    console.log(response);
    var outputobject ={};
    //to set local response variable id value for outputobject id value.
    if(editID != ''){
        outputobject.primary_parent_email = editID;
    }else{
        outputobject.primary_parent_email = localStorage.getItem('logged_in_email');
    }
    const child_id_val = localStorage.getItem('child_id');

    if (child_id_val !== null && child_id_val !== undefined) {
        outputobject.child_id = child_id_val; 
    }
    var keys = Object.keys(obj);
    console.log(keys);
    
    //compare new date with old data
    keys.forEach(function (key) {
        if(obj[key] != response[key] && obj[key] !=="" ){
            outputobject[key]=obj[key];
            console.log( outputobject[key]);
            console.log( obj[key]);
        }
    })
    console.log( outputobject);
    const json=JSON.stringify(outputobject); 
    console.log(json);   
    let xhr = new XMLHttpRequest();
    xhr.onload = () => {
        if (xhr.status === 200) {
            $(".success-msg").show();
            setTimeout(function(){ 
                $(".success-msg").hide(); 
                // window.location.reload();
                sessionStorage.setItem('putcallId',localStorage.getItem('child_id'));
                window.location.href = `./parent_dashboard.html?id=${editID}`;
            }, 3000);
        }else{
            $(".error-msg").show();
            setTimeout(function(){ 
                $(".error-msg").hide(); 
            }, 3000);
        }
    };
    xhr.open("PUT", `https://ijz2b76zn8.execute-api.ap-south-1.amazonaws.com/test/authorization_form/update/${localStorage.getItem('child_id')}`);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(json);
}

function enrollmentSubmitForm(editID,number) {
    const form = document.getElementById("childInfoEnrollment");
    var old = form;
     var new_element = old.cloneNode(true);
     //replace the element
     old.parentNode.replaceChild(new_element,old);
    const formData = new FormData(form);
    const obj = Object.fromEntries(formData);
    console.log(obj);

    var currentDate = new Date(obj.admin_sign_date_enroll);
    var epochTime = currentDate.getTime();
    var epochValueConversion = parseInt(epochTime, 10)
    console.log(typeof epochValueConversion);
    obj.admin_sign_date_enroll =  epochValueConversion;

    obj.form_year_enroll = year;
    obj.pointer = number;
    //to get values from local storage variable and stored it into response1 variable.
    var response=JSON.parse(window.localStorage.getItem("responseData"));
    console.log(response);
    var outputobject ={};
    //to set local response variable id value for outputobject id value.
    if(editID != ''){
        outputobject.primary_parent_email = editID;
    }else{
        outputobject.primary_parent_email = localStorage.getItem('logged_in_email');
    }
    const child_id_val = localStorage.getItem('child_id');

    if (child_id_val !== null && child_id_val !== undefined) {
        outputobject.child_id = child_id_val; 
    }
    var keys = Object.keys(obj);
    console.log(keys);
    
    //compare new date with old data
    keys.forEach(function (key) {
        if(obj[key] != response[key] && obj[key] !=="" ){
            outputobject[key]=obj[key];
            console.log( outputobject[key]);
            console.log( obj[key]);
        }
    })
    console.log( outputobject);
    const json=JSON.stringify(outputobject); 
    console.log(json);   
    let xhr = new XMLHttpRequest();
    xhr.onload = () => {
        if (xhr.status === 200) {
            $(".success-msg").show();
            setTimeout(function(){ 
                $(".success-msg").hide(); 
                // window.location.reload();
                sessionStorage.setItem('putcallId',localStorage.getItem('child_id'));
                window.location.href = `./parent_dashboard.html?id=${editID}`;
            }, 3000);
        }else{
            $(".error-msg").show();
            setTimeout(function(){ 
                $(".error-msg").hide(); 
            }, 3000);
        }
    };
    xhr.open("PUT", `https://ijz2b76zn8.execute-api.ap-south-1.amazonaws.com/test/enrollment_form/update/${localStorage.getItem('child_id')}`);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(json);
}

function handbookSubmitForm(editID,number) {
    const form = document.getElementById("childInfoHandbook");
    var old = form;
     var new_element = old.cloneNode(true);
     //replace the element
     old.parentNode.replaceChild(new_element,old);
    const formData = new FormData(form);
    const obj = Object.fromEntries(formData);
    console.log(obj);

    var currentDate = new Date(obj.admin_sign_date_handbook);
    var epochTime = currentDate.getTime();
    var epochValueConversion = parseInt(epochTime, 10)
    console.log(typeof epochValueConversion);
    obj.admin_sign_date_handbook =  epochValueConversion;

    obj.form_year_handbook = year;
    obj.pointer = number;
    //to get values from local storage variable and stored it into response1 variable.
    var response=JSON.parse(window.localStorage.getItem("responseData"));
    console.log(response);
    var outputobject ={};
    //to set local response variable id value for outputobject id value.
    if(editID != ''){
        outputobject.primary_parent_email = editID;
    }else{
        outputobject.primary_parent_email = localStorage.getItem('logged_in_email');
    }
    const child_id_val = localStorage.getItem('child_id');

    if (child_id_val !== null && child_id_val !== undefined) {
        outputobject.child_id = child_id_val; 
    }
    var keys = Object.keys(obj);
    console.log(keys);
    
    //compare new date with old data
    keys.forEach(function (key) {
        if(obj[key] != response[key] && obj[key] !=="" ){
            outputobject[key]=obj[key];
            console.log( outputobject[key]);
            console.log( obj[key]);
        }
    })
    console.log( outputobject);
    const json=JSON.stringify(outputobject); 
    console.log(json);   
    let xhr = new XMLHttpRequest();
    xhr.onload = () => {
        if (xhr.status === 200) {
            $(".success-msg").show();
            setTimeout(function(){ 
                $(".success-msg").hide(); 
                // window.location.reload();
                sessionStorage.setItem('putcallId',localStorage.getItem('child_id'));
                window.location.href = `./parent_dashboard.html?id=${editID}`;
            }, 3000);
        }else{
            $(".error-msg").show();
            setTimeout(function(){ 
                $(".error-msg").hide(); 
            }, 3000);
        }
    };
    xhr.open("PUT", `https://ijz2b76zn8.execute-api.ap-south-1.amazonaws.com/test/parent_handbook/update/${localStorage.getItem('child_id')}`);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(json);
}

function clearForm(){
    window.location.reload();
}

function clearDataTable() {
    $('#example').DataTable().clear().draw();
}

$(document).ready(function () {
    // alert('456')
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
    } else {
        document.body.style.visibility = 'visible';
        $(window).keydown(function(event){
            if(event.keyCode == 13) {
                event.preventDefault();
                return false;
            }
        });
        let samplejson = {};
        let editChildID = window.location.search.slice(4);
        $(document).on("click", "#child_basic_info", function(e) {
            e.preventDefault();
            submitForm(editChildID,1);
        });
        $(document).on("click", "#parent_info", function(e) {
            e.preventDefault();
            submitForm(editChildID,2);
        });
        $(document).on("click", "#parent_two_info", function(e) {
            e.preventDefault();
            submitForm(editChildID,3);
        });
        $(document).on("click", "#emergency_info", function(e) {
            e.preventDefault();
            submitForm(editChildID,4);
        });
        $(document).on("click", "#fourth_save", function(e) {
            e.preventDefault();
            submitForm(editChildID,5);
        });
        $(document).on("click", "#fifth_save", function(e) {
            e.preventDefault();
            submitForm(editChildID,6);
        });
        $(document).on("click", "#sixth_save", function(e) {
            e.preventDefault();
            submitForm(editChildID,7);
        });
        $(document).on("click", "#seventh_save", function(e) {
            e.preventDefault();
            submitForm(editChildID,8);
        });
        $(document).on("click", "#eigth_save", function(e) {
            e.preventDefault();
            submitForm(editChildID,9);
        });
        $(document).on("click", "#nine_save", function(e) {
            e.preventDefault();
            submitForm(editChildID,10);
        });
        $(document).on("click", "#ten_save", function(e) {
            e.preventDefault();
            submitForm(editChildID,11);
        });
        $(document).on("click", "#eleven_save", function(e) {
            e.preventDefault();
            submitForm(editChildID,12);
        });
        $(document).on("click", "#twelve_save", function(e) {
            e.preventDefault();
            submitForm(editChildID,13);
        });
        $(document).on("click", "#thirteen_save", function(e) {
            e.preventDefault();
            submitForm(editChildID,14);
        });
        $(document).on("click", "#fourteen_save", function(e) {
            e.preventDefault();
            submitForm(editChildID,15);
        });
        $(document).on("click", "#fifteen_save", function(e) {
            e.preventDefault();
            submitForm(editChildID,16);
        });
        $(document).on("click", "#sixteen_save", function(e) {
            e.preventDefault();
            submitForm(editChildID,17);
        });
        $(document).on("click", "#seventeen_save", function(e) {
            e.preventDefault();
            submitForm(editChildID,18);
        });
        $(document).on("click", "#eighteen_save", function(e) {
            e.preventDefault();
            submitForm(editChildID,19);
        });
        $(document).on("click", "#nineteen_save", function(e) {
            e.preventDefault();
            submitForm(editChildID,20);
        });
        $(document).on("click", "#twenty_save", function(e) {
            e.preventDefault();
            submitForm(editChildID,21);
        });
        $(document).on("click", "#twentyone_save", function(e) {
            e.preventDefault();
            submitForm(editChildID,22);
        });
        $(document).on("click", "#twentytwo_save", function(e) {
            e.preventDefault();
            submitForm(editChildID,23);
        });
        $(document).on("click", "#twentythree_save", function(e) {
            e.preventDefault();
            submitForm(editChildID,24);
        });
        $(document).on("click", "#twentyfour_save", function(e) {
            e.preventDefault();
            submitForm(editChildID,25);
        });
        $(document).on("click", "#twentyfive_save", function(e) {
            e.preventDefault();
            submitForm(editChildID,26);
        });
        $(document).on("click", ".admission-submit-btn", function(e) {
            e.preventDefault();
            submitForm(editChildID,1);
        });


        $(document).on("click", ".ach-save-btn", function(e) {
            e.preventDefault();
            authorizationSubmitForm(editChildID,27);
        });
        $(document).on("click", ".ach-submit-btn", function(e) {
            e.preventDefault();
            authorizationSubmitForm(editChildID,1);
        });
        $(document).on("click", ".enrollment-save-btn", function(e) {
            e.preventDefault();
            enrollmentSubmitForm(editChildID,28);
        });
        $(document).on("click", ".enrollment-submit-btn", function(e) {
            e.preventDefault();
            enrollmentSubmitForm(editChildID,1);
        });
        $(document).on("click", ".handbook_button", function(e) {
            e.preventDefault();
            handbookSubmitForm(editChildID,29);
        });
        $(document).on("click", ".handbook-submit-btn", function(e) {
            e.preventDefault();
            handbookSubmitForm(editChildID,1);
        });
        $(document).on("click", ".cancel-btn", function(e) {
            e.preventDefault();
            clearForm();
        });

        $(".handbook_button").on("click", function (e) {
            e.preventDefault(); // Prevent the default form submission
            saveForm();
        });
        // $("#admission_submit_button").on("click", function (e) {
        //     e.preventDefault(); // Prevent the default form submission
        //     submitForm();
        // });
        $("#cancelButton").on("click", function (e) {
            e.preventDefault(); // Prevent the default form submission
            clearForm();
        });
       
    }
});



