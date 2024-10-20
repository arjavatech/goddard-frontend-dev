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
    obj.form_year_admission = year;
    obj.pointer = number;
    //to get values from local storage variable and stored it into response1 variable.
    var response=JSON.parse(window.localStorage.getItem("responseData"));
    console.log(response);
    var outputobject ={};
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

    const emergencyContacts = [];
    for (let i = 1; i <= 2; i++) {
        const contactName = formData.get(`emergency_contact_name_${i}`);
        const contactZip = formData.get(`emergency_contact_zip_address_${i}`);
        const contactCity = formData.get(`emergency_contact_city_address_${i}`);
        const contactFullAddress = formData.get(`emergency_contact_full_address_${i}`);
        const contactRelationship = formData.get(`emergency_contact_relationship_${i}`);
        const contactState = formData.get(`emergency_contact_state_address_${i}`);
        const contactPhone = formData.get(`emergency_contact_telephone_number_${i}`);
        
        if (contactName && contactPhone) {
            emergencyContacts.push({
                // child_emergency_contact_id: i, 
                child_emergency_contact_name: contactName,
                child_emergency_contact_zip_address: contactZip,
                child_emergency_contact_city_address: contactCity,
                child_emergency_contact_full_address: contactFullAddress,
                child_emergency_contact_relationship: contactRelationship,
                child_emergency_contact_state_address: contactState,
                child_emergency_contact_telephone_number: contactPhone
            });
        }
    }
    outputobject.emergency_contact_info = emergencyContacts;
    // Additional objects for specific sections
    let child_dentist_info = {
        child_dentist_name: obj.child_dentist_name,
        dentist_telephone_number: obj.dentist_telephone_number,
        dentist_street_address: obj.dentist_street_address,
        dentist_city_address: obj.dentist_city_address,
        dentist_state_address: obj.dentist_state_address,
        dentist_zip_address: obj.dentist_zip_address
    };
    outputobject.child_dentist_info = child_dentist_info;

    let child_care_provider_info = {
        child_care_provider_name: obj.child_care_provider_name,
        child_care_provider_telephone_number: obj.child_care_provider_telephone_number,
        child_hospital_affiliation: obj.child_hospital_affiliation,
        child_care_provider_street_address : obj.child_care_provider_street_address,
        child_care_provider_city_address : obj.child_care_provider_city_address,
        child_care_provider_state_address :obj.child_care_provider_state_address,
        child_care_provider_zip_address :obj.child_care_provider_zip_address
    };
    outputobject.child_care_provider_info = child_dentist_info;

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
                window.location.href = `./parent_dashboard.html`;

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

function authorizationSubmitForm(editID) {
    const form = document.getElementById("childInfoAuthorization");
    var old = form;
     var new_element = old.cloneNode(true);
     //replace the element
     old.parentNode.replaceChild(new_element,old);
    const formData = new FormData(form);
    const obj = Object.fromEntries(formData);
    obj.form_year_ach = year;
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
    xhr.open("PUT", "https://ijz2b76zn8.execute-api.ap-south-1.amazonaws.com/test/bill_ach/update");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(json);
}

// Function to submit the form data
function authorizationSaveForm(editID) {
    const form = document.getElementById("childInfoAuthorization");
     var old = form;
     var new_element = old.cloneNode(true);
     //replace the element
     old.parentNode.replaceChild(new_element,old);
    const formData = new FormData(form);
    const obj = Object.fromEntries(formData);
    obj.form_year_ach = year;
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
                window.location.href = `./parent_dashboard.html`;
            }, 3000);
        }else{
            $(".error-msg").show();
            setTimeout(function(){ 
                $(".error-msg").hide(); 
            }, 3000);
        }
    };
    xhr.open("PUT", "https://ijz2b76zn8.execute-api.ap-south-1.amazonaws.com/test/bill_ach/update");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(json);
}

function enrollmentSubmitForm(editID) {
    const form = document.getElementById("childInfoEnrollment");
    var old = form;
     var new_element = old.cloneNode(true);
     //replace the element
     old.parentNode.replaceChild(new_element,old);
    const formData = new FormData(form);
    const obj = Object.fromEntries(formData);
    obj.form_year_enroll = year;
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
    xhr.open("PUT", "https://ijz2b76zn8.execute-api.ap-south-1.amazonaws.com/test/enrollment_agreement/update");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(json);
}

// Function to submit the form data
function enrollmentSaveForm(editID) {
    const form = document.getElementById("childInfoEnrollment");
     var old = form;
     var new_element = old.cloneNode(true);
     //replace the element
     old.parentNode.replaceChild(new_element,old);
    const formData = new FormData(form);
    const obj = Object.fromEntries(formData);
    obj.form_year_enroll = year;
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
                window.location.href = `./parent_dashboard.html`;
            }, 3000);
        }else{
            $(".error-msg").show();
            setTimeout(function(){ 
                $(".error-msg").hide(); 
            }, 3000);
        }
    };
    xhr.open("PUT", "https://ijz2b76zn8.execute-api.ap-south-1.amazonaws.com/test/enrollment_agreement/update");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(json);
}

function handbookSubmitForm(editID) {
    const form = document.getElementById("childInfoHandbook");
    var old = form;
     var new_element = old.cloneNode(true);
     //replace the element
     old.parentNode.replaceChild(new_element,old);
    const formData = new FormData(form);
    const obj = Object.fromEntries(formData);
    obj.form_year_handbook = year;
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
    xhr.open("PUT", "https://ijz2b76zn8.execute-api.ap-south-1.amazonaws.com/test/hand_book/update");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(json);
}

// Function to submit the form data
function handbookSaveForm(editID) {
    const form = document.getElementById("childInfoHandbook");
     var old = form;
     var new_element = old.cloneNode(true);
     //replace the element
     old.parentNode.replaceChild(new_element,old);
    const formData = new FormData(form);
    const obj = Object.fromEntries(formData);
    obj.form_year_handbook = year;
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
                window.location.href = `./parent_dashboard.html`;
            }, 3000);
        }else{
            $(".error-msg").show();
            setTimeout(function(){ 
                $(".error-msg").hide(); 
            }, 3000);
        }
    };
    xhr.open("PUT", "https://ijz2b76zn8.execute-api.ap-south-1.amazonaws.com/test/hand_book/update");
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
            admissionsubmitForm(editChildID,1);
        });
        $(document).on("click", ".ach-save-btn", function(e) {
            e.preventDefault();
            authorizationSaveForm(editChildID);
        });
        $(document).on("click", ".ach-submit-btn", function(e) {
            e.preventDefault();
            authorizationSubmitForm(editChildID);
        });
        $(document).on("click", ".enrollment-save-btn", function(e) {
            e.preventDefault();
            enrollmentSaveForm(editChildID);
        });
        $(document).on("click", ".enrollment-submit-btn", function(e) {
            e.preventDefault();
            enrollmentSubmitForm(editChildID);
        });
        $(document).on("click", ".handbook_button", function(e) {
            e.preventDefault();
            handbookSaveForm(editChildID);
        });
        $(document).on("click", ".handbook-submit-btn", function(e) {
            e.preventDefault();
            handbookSubmitForm(editChildID);
        });
        $(document).on("click", ".cancel-btn", function(e) {
            e.preventDefault();
            clearForm();
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



