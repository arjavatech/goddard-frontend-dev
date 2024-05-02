import {isAuthenticated} from "./authenticationVerify.js";

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
            alert(response.message)
            window.location.reload();
        }else{
            alert("failed to save admission form");
        }
    };
    xhr.open("PUT", "http://localhost:8080/admission_child_additional/update");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(json);
}

function childPersonalsubmitForm(editID) {
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
            // alert(response.message)
            window.location.reload();
        }else{
            alert("failed to save admission form");
        }
    };
    xhr.open("PUT", "http://localhost:8080/admission_child_personal/modify");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(json);
}
function childParentsubmitForm(editID) {
    console.log('king')
    const form = document.getElementById("childInfoAdmission");
    var old = form;
    var new_element = old.cloneNode(true);
    //replace the element
    old.parentNode.replaceChild(new_element,old);
    const formData = new FormData(form);
    const obj = Object.fromEntries(formData);
    obj.form_year_admission = year;
    const parent_one_email =obj.primary_parent_email;
    obj.parent_email = parent_one_email;
    const email_two_parent = obj.parent_two_email;
    console.log(obj.parent_email);
    obj.parent_email_two = email_two_parent;
    console.log(obj);
    //to get values from local storage variable and stored it into response1 variable.
    var response=JSON.parse(window.localStorage.getItem("responseData"));
    var outputobject ={};
    //to set local response variable id value for outputobject id value.
    if(editID != ''){
        outputobject.primary_parent_email = editID;
        outputobject.parent_email = editID;
    }else{
        outputobject.primary_parent_email = localStorage.getItem('logged_in_email');
        outputobject.parent_email = localStorage.getItem('logged_in_email');
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
            alert(response.message);
            window.location.reload();
        }else{
            alert("failed to save admission form");
        }
    };
    xhr.open("PUT", "http://localhost:8080/admission_parent_info/update");
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
            window.location.reload();
        }else{
            alert("failed to save admission form");
        }
    };
    xhr.open("PUT", " http://localhost:8080/admission_child_health/update");
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
    let xhr = new XMLHttpRequest();
    xhr.onload = () => {
        if (xhr.status === 200) {
            // alert(response.message)
            window.location.reload();
        }else{
            alert("failed to save admission form");
        }
    };
    xhr.open("PUT", "http://localhost:8080/admission_child_profile/update");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(json);
}
// Function to submit the form data
// function saveForm(editID) {
//     const form = document.getElementById("childInfoAdmission");
//     const formData = new FormData(form);
//     const obj = Object.fromEntries(formData);
   
//     if(editID != ''){
//         obj.primary_parent_email = editID;
//     }else{
//         obj.primary_parent_email = localStorage.getItem('logged_in_email');
//     }
//     const child_id_val = localStorage.getItem('child_id');

//     if (child_id_val !== null && child_id_val !== undefined) {
//         obj.child_id = child_id_val; 
//     }
//     const json = JSON.stringify(obj);
//     // $.ajax({
//     //     url: "http://localhost:8080/admission_child_personal/update",
//     //     type: "PUT",
//     //     contentType: "application/json",
//     //     data: json,
//     //     success: function (response) {
//     //         alert(response.message)
//     //         window.location.reload();
//     //     },
//     //     error: function (xhr, status, error) {
//     //     }
//     // });
//     let xhr = new XMLHttpRequest();
//     xhr.onload = () => {
//         if (xhr.status === 200) {
//             // alert(response.message)
//             window.location.reload();
//         }else{
//             alert("failed to save admission form");
//         }
//     };
//     xhr.open("POST", "http://localhost:8080/admission_child_personal/modify");
//     xhr.setRequestHeader("Content-Type", "application/json");
//     xhr.send(json);
// }

// Function to submit the form data


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
            // alert(response.message)
            window.location.reload();
        }else{
            alert("failed to save admission form");
        }
    };
    xhr.open("PUT", "http://localhost:8080/admission_child_additional/update");
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
            // alert(response.message)
            window.location.reload();
        }else{
            alert("failed to save admission form");
        }
    };
    xhr.open("PUT", "http://localhost:8080/bill_ach/update");
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
            alert(response.message)
            window.location.reload();
        }else{
            alert("failed to save admission form");
        }
    };
    xhr.open("PUT", "http://localhost:8080/bill_ach/update");
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
            // alert(response.message)
            window.location.reload();
        }else{
            alert("failed to save admission form");
        }
    };
    xhr.open("PUT", "http://localhost:8080/enrollment_agreement/update");
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
            alert(response.message)
            window.location.reload();
        }else{
            alert("failed to save admission form");
        }
    };
    xhr.open("PUT", "http://localhost:8080/enrollment_agreement/update");
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
            // alert(response.message)
            window.location.reload();
        }else{
            alert("failed to save admission form");
        }
    };
    xhr.open("PUT", "http://localhost:8080/hand_book/update");
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
            alert(response.message)
            window.location.reload();
        }else{
            alert("failed to save admission form");
        }
    };
    xhr.open("PUT", "http://localhost:8080/hand_book/update");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(json);
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
        let editChildID = window.location.search.slice(4);
        console.log(editChildID);
        $(document).on("click", ".child_personal_admission", function(e) {
            e.preventDefault();
            childPersonalsubmitForm(editChildID);
        });
        $(document).on("click", ".child_parent_info", function(e) {
            e.preventDefault();
            console.log('chec')
            childParentsubmitForm(editChildID);
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
            submitForm(editChildID);
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


