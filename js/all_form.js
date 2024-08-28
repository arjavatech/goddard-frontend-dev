import {isAuthenticated} from "./authentication_verify.js";

var year = new Date().getFullYear() + '';
// Function to submit the form data
function submitForm(editID) {
    const form = document.getElementById("childInfoAdmission");
    var old = form;
    var new_element = old.cloneNode(true);
    //replace the element
    old.parentNode.replaceChild(new_element,old);
    const formData = new FormData(form);
    const obj = Object.fromEntries(formData); 
    obj.form_year_admission = year;
    //to get values from local storage variable and stored it into response1 variable.
    var response=JSON.parse(window.localStorage.getItem("responseData"));
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
    
    //compare new date with old data
    keys.forEach(function (key) {
        if(obj[key] != response[key] && obj[key] !=="" ){
            outputobject[key]=obj[key];
        }
    })
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
    xhr.open("PUT", "https://jvirbzj4p1.execute-api.us-west-2.amazonaws.com/goddard_test/admission_child_additional/update");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(json);
}

function childPersonalsubmitForm(editID) {
    console.log(editID);
    const form = document.getElementById("childInfoAdmission");
    var old = form;
    var new_element = old.cloneNode(true);
    //replace the element
    old.parentNode.replaceChild(new_element,old);
    const formData = new FormData(form);
    const obj = Object.fromEntries(formData);
    console.log(obj);
    obj.form_year_admission = year;
    //to get values from local storage variable and stored it into response1 variable.
    var response=JSON.parse(window.localStorage.getItem("responseData"));
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
    // alert('hi');
    //compare new date with old data
    keys.forEach(function (key) {
        if(obj[key] != response[key] && obj[key] !=="" ){
            outputobject[key]=obj[key];
        }
    })
    const json=JSON.stringify(outputobject); 
    console.log(json);
    let xhr = new XMLHttpRequest();
    xhr.onload = () => {
        if (xhr.status === 200) {
            $(".success-msg").show();
            setTimeout(function(){ 
                $(".success-msg").hide(); 
                // window.location.reload();
                // localStorage.setItem()
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
    xhr.open("PUT", "https://jvirbzj4p1.execute-api.us-west-2.amazonaws.com/goddard_test/admission_child_personal/modify");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(json);
    // $.ajax({
    //     url: "https://jvirbzj4p1.execute-api.us-west-2.amazonaws.com/goddard_test/admission_child_personal/modify",
    //     type: "PUT",
    //     contentType: "application/json",
    //     data:json,
    //     success: function (response) {
    //         console.log(response);
    //         if(response.message == "Sign-up not allowed"){
    //             $(".error-msg").show();
    //             setTimeout(function(){ 
    //                 $(".error-msg").hide(); 
    //             }, 3000);
    //         }else{
    //             $(".success-msg").show();
    //             setTimeout(function(){ 
    //                 $(".success-msg").hide(); 
    //                 window.location.href = "login.html";
    //             }, 3000);
    //         }
        
    //     },
    // });
}
function childParentsubmitForm(editID) {
    const form = document.getElementById("childInfoAdmission");
    var old = form;
    var new_element = old.cloneNode(true);
    //replace the element
    old.parentNode.replaceChild(new_element,old);
    const formData = new FormData(form);
    const obj = Object.fromEntries(formData);
    obj.form_year_admission = year;
    //to get values from local storage variable and stored it into response1 variable.
    var response=JSON.parse(window.localStorage.getItem("responseData"));
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
    
    //compare new date with old data
    keys.forEach(function (key) {
        console.log(obj[key]);
        if(obj[key] != response[key] && obj[key] !=="" ){
            outputobject[key]=obj[key];
        }
    })
    const json=JSON.stringify(outputobject); 
    console.log(json)
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
    xhr.open("PUT", "https://jvirbzj4p1.execute-api.us-west-2.amazonaws.com/goddard_test/admission_parent_info/update");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(json);
}

function childParentTwosubmitForm(editID) {
    const form = document.getElementById("childInfoAdmission");
    const formData = new FormData(form);
    const obj = Object.fromEntries(formData);
    obj.form_year_admission = year;
    console.log(obj);
    //to set local response variable id value for outputobject id value.
    if(editID != ''){
        obj.primary_parent_email = editID;
    }else{
        obj.primary_parent_email = localStorage.getItem('logged_in_email');
    }
    const child_id_val = localStorage.getItem('child_id');

    if (child_id_val !== null && child_id_val !== undefined) {
        obj.child_id = child_id_val; 
    }
    const json=JSON.stringify(obj); 
    console.log(json)
    let xhr = new XMLHttpRequest();
    xhr.onload = () => {
        if (xhr.status === 200) {
            $(".success-msg").show();
            setTimeout(function(){ 
                $(".success-msg").hide(); 
                // window.location.reload();
                sessionStorage.setItem('putcallId',child_id_val);
                window.location.href = `./parent_dashboard.html`;
            }, 3000);
        }else{
            $(".error-msg").show();
            setTimeout(function(){ 
                $(".error-msg").hide(); 
            }, 3000);
        }
    };
    xhr.open("POST", "https://jvirbzj4p1.execute-api.us-west-2.amazonaws.com/goddard_test/admission_parent_two_info/add");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(json);
}

function childHistorysubmitForm(editID) {
    const form = document.getElementById("childInfoAdmission");
    var old = form;
    var new_element = old.cloneNode(true);
    //replace the element
    old.parentNode.replaceChild(new_element,old);
    const formData = new FormData(form);
    const obj = Object.fromEntries(formData);
    obj.form_year_admission = year;
    //to get values from local storage variable and stored it into response1 variable.
    var response=JSON.parse(window.localStorage.getItem("responseData"));
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
    
    //compare new date with old data
    keys.forEach(function (key) {
        if(obj[key] != response[key] && obj[key] !=="" ){
            outputobject[key]=obj[key];
        }
    })
    const json=JSON.stringify(outputobject); 
    let xhr = new XMLHttpRequest();
    xhr.onload = () => {
        if (xhr.status === 200) {
            // alert(response.message)
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
    xhr.open("PUT", " https://jvirbzj4p1.execute-api.us-west-2.amazonaws.com/goddard_test/admission_child_health/update");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(json);
}
function childProfilesubmitForm(editID) {
    const form = document.getElementById("childInfoAdmission");
    var old = form;
    var new_element = old.cloneNode(true);
    //replace the element
    old.parentNode.replaceChild(new_element,old);
    const formData = new FormData(form);
    const obj = Object.fromEntries(formData);
    obj.form_year_admission = year;
    //to get values from local storage variable and stored it into response1 variable.
    var response=JSON.parse(window.localStorage.getItem("responseData"));
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
    
    //compare new date with old data
    keys.forEach(function (key) {
        if(obj[key] != response[key] && obj[key] !=="" ){
            outputobject[key]=obj[key];
        }
    })
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
    xhr.open("PUT", "https://jvirbzj4p1.execute-api.us-west-2.amazonaws.com/goddard_test/admission_child_profile/update");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(json);
}

function saveForm(editID) {
    //to get values from local storage variable.
    window.localStorage.getItem("responseData");
    var form = document.getElementById("childInfoAdmission");
    
    // form.removeEventListener("submit", addStudent);
    var old = form;
    var new_element = old.cloneNode(true);
    //replace the element
    old.parentNode.replaceChild(new_element,old);
    // new_element.addEventListener("submit", (e) => {
    //     e.preventDefault();
    const formData = new FormData(form);
    const obj = Object.fromEntries(formData);
    obj.form_year_admission = year;
    //to get values from local storage variable and stored it into response1 variable.
    var response=JSON.parse(window.localStorage.getItem("responseData"));
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
    
    //compare new date with old data
    keys.forEach(function (key) {
        if(obj[key] != response[key] && obj[key] !=="" ){
            outputobject[key]=obj[key];
        }
    })
    const json=JSON.stringify(outputobject); 
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
    xhr.open("PUT", "https://jvirbzj4p1.execute-api.us-west-2.amazonaws.com/goddard_test/admission_child_additional/update");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(json);
}

function admissionsubmitForm(editID) {
    console.log(editID);
    const form = document.getElementById("childInfoAdmission");
    var old = form;
    var new_element = old.cloneNode(true);
    //replace the element
    old.parentNode.replaceChild(new_element,old);
    const formData = new FormData(form);
    const obj = Object.fromEntries(formData);
    console.log(obj);
    obj.form_year_admission = year;
    //to get values from local storage variable and stored it into response1 variable.
    var response=JSON.parse(window.localStorage.getItem("responseData"));
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
    // alert('hi');
    //compare new date with old data
    keys.forEach(function (key) {
        if(obj[key] != response[key] && obj[key] !=="" ){
            outputobject[key]=obj[key];
        }
    })
    const json=JSON.stringify(outputobject); 
    console.log(json);
    let xhr = new XMLHttpRequest();
    xhr.onload = () => {
        if (xhr.status === 200) {
            $(".success-msg").show();
            setTimeout(function(){ 
                $(".success-msg").hide(); 
                // window.location.reload();
                // localStorage.setItem()
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
    xhr.open("PUT", "https://jvirbzj4p1.execute-api.us-west-2.amazonaws.com/goddard_test/admission_child_personal/modify");
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
    xhr.open("PUT", "https://jvirbzj4p1.execute-api.us-west-2.amazonaws.com/goddard_test/bill_ach/update");
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
    xhr.open("PUT", "https://jvirbzj4p1.execute-api.us-west-2.amazonaws.com/goddard_test/bill_ach/update");
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
    xhr.open("PUT", "https://jvirbzj4p1.execute-api.us-west-2.amazonaws.com/goddard_test/enrollment_agreement/update");
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
    xhr.open("PUT", "https://jvirbzj4p1.execute-api.us-west-2.amazonaws.com/goddard_test/enrollment_agreement/update");
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
    xhr.open("PUT", "https://jvirbzj4p1.execute-api.us-west-2.amazonaws.com/goddard_test/hand_book/update");
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
    xhr.open("PUT", "https://jvirbzj4p1.execute-api.us-west-2.amazonaws.com/goddard_test/hand_book/update");
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
        $(document).on("click", ".child_personal_admission", function(e) {
            e.preventDefault();
            childPersonalsubmitForm(editChildID);
        });
        $(document).on("click", ".child_parent_info", function(e) {
            e.preventDefault();
            childParentsubmitForm(editChildID);
        });
        $(document).on("click", ".child_parent_two_info", function(e) {
            e.preventDefault();
            childParentTwosubmitForm(editChildID);
        });
        $(document).on("click", ".child_health", function(e) {
            e.preventDefault();
            childHistorysubmitForm(editChildID);
        });
        $(document).on("click", ".child-profile-btn", function(e) {
            e.preventDefault();
            childProfilesubmitForm(editChildID);
        });
        $(document).on("click", ".save-btn", function(e) {
            e.preventDefault();
            saveForm(editChildID);
        });
        $(document).on("click", ".admission-submit-btn", function(e) {
            e.preventDefault();
            admissionsubmitForm(editChildID);
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



