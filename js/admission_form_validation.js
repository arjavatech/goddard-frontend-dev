'use strict';

//name validation with particular format
function childNamevalidation(inputtxtID,errorSpanId){
    let childName1 = document.getElementById('student_name');
    let childName2 = document.getElementById('child_profile_name');
    let childName3 = document.getElementById('emergency_info_child_name');
    let childName4 = document.getElementById('permission_child_name');
    let childName5 = document.getElementById('security_release_child_name');
    let regName =  /^[a-zA-Z\s]+$/;
    if (regName.test(inputtxtID.value) == true) {
        document.getElementById(errorSpanId).style.display = "none";
        childName1.value=inputtxtID.value;
        childName1.disabled=true;
        childName2.value=inputtxtID.value;
        childName2.disabled=true;
        childName3.value=inputtxtID.value;
        childName3.disabled=true;
        childName4.value=inputtxtID.value;
        childName4.disabled=true;
        childName5.value=inputtxtID.value;
        childName5.disabled=true;
    } else if(inputtxtID.value == ''){
        document.getElementById(errorSpanId).style.display = "none";
    } else {
        document.getElementById(errorSpanId).style.display = "block";
        inputtxtID.focus();
    }
}

//name validation with particular format
function namevalidation(inputtxtID,errorSpanId){
    let regName =  /^[a-zA-Z\s]+$/;
    if (regName.test(inputtxtID.value) == true) {
        document.getElementById(errorSpanId).style.display = "none";
    } else if(inputtxtID.value == ''){
        document.getElementById(errorSpanId).style.display = "none";
    } else {
        document.getElementById(errorSpanId).style.display = "block";
        inputtxtID.focus();
    }
}

//number validation with particular format
function validatePhone(inputtxtID, errorSpanId) {
    let numbersformat =/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/im;
    if (inputtxtID.value.match(numbersformat) && inputtxtID.value.length <= 15) {
        document.getElementById(errorSpanId).style.display = "none";
    } else if(inputtxtID.value == ''){
        document.getElementById(errorSpanId).style.display = "none";
    } else {
        document.getElementById(errorSpanId).style.display = "block";
        inputtxtID.focus();
    }
}

//email validation with particular format
function emailValidation(inputtxtID,errorSpanID) {
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (reg.test(inputtxtID.value) == true) {
        document.getElementById(errorSpanID).style.display = "none";
    } else if(inputtxtID.value == ''){
        document.getElementById(errorSpanID).style.display = "none";
    } else {
        document.getElementById(errorSpanID).style.display = "block";
        inputtxtID.focus();
    }
}

//this function restrict future date
function dateValidation(id){
    document.getElementById(id).max = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0];
}

//pincode validation
function ValidatePincode(inputtxt, errorSpan) {
    var numbers = /^[0-9]+$/;
    if (inputtxt.value.length == 5 && inputtxt.value.match(numbers)) {
        document.getElementById(errorSpan).style.display = "none";
    } else if(inputtxt.value == ''){
        document.getElementById(errorSpan).style.display = "none";
    } else {
        document.getElementById(errorSpan).style.display = "inline";
        inputtxt.focus();
    }
}

function checkbox() {
    var additional_parent_info = document.getElementById("additional_parent_info");
    if ($('input[id="additional_parent_details"]').is(":checked")) {
        additional_parent_info.style.display = "block";
    }
    else{
        additional_parent_info.style.display = "none";
    }
}

function appendvalidation(val,element) {
    var additional_emegengy_release1 = document.getElementById("additional_emegengy_release1");
    var additional_emegengy_release2 = document.getElementById("additional_emegengy_release2");
    if(val <=2 && val >=0){
        if (val == 1) {
            additional_emegengy_release1.style.display = "block";
            additional_emegengy_release2.style.display = "none";
            document.getElementById(element).style.display = "none";
        }else if (val == 2) {
            additional_emegengy_release1.style.display = "block";
            additional_emegengy_release2.style.display = "block";
            document.getElementById(element).style.display = "none";
        }else {
            additional_emegengy_release1.style.display = "none";
            additional_emegengy_release2.style.display = "none";
        }
    }else if(val== ''){
        
        additional_emegengy_release1.style.display = "none";
        additional_emegengy_release2.style.display = "none";
        document.getElementById(element).style.display = "none";
    }else{
        // alert('else');
        document.getElementById(element).style.display = "block";
        additional_emegengy_release1.style.display = "none";
        additional_emegengy_release2.style.display = "none";
    }
}

//custom textbox hide and show function
function CustomChange(inputtxt,labelvalue) {
    if (inputtxt == "Yes") {
        document.getElementById(labelvalue).style.display = "block";
    } else {
        document.getElementById(labelvalue).style.display = "none";
    }   
}
