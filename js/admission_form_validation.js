'use strict';
//name validation with particular format
function namevalidation(inputtxtID,errorSpanId){
    let regName =  /^[a-zA-Z\s]+$/;
    if (regName.test(inputtxtID.value) == true) {
        console.log('if');
        document.getElementById(errorSpanId).style.display = "none";
    } else if(inputtxtID.value == ''){
        console.log('else if');
        document.getElementById(errorSpanId).style.display = "none";
    } else {
        console.log('else');
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
    console.log('checking the checkbox if valid or not');
    var additional_parent_info = document.getElementById("additional_parent_info");
    if ($('input[name="additional_parent_add"]').is(":checked")) {
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
function CustomChange(inputtxt, element,labelvalue) {
    if (inputtxt == "Yes") {
        console.log('yes');
        // element.style.display='block';
        document.getElementById(element).style.display = "block";
        document.getElementById(labelvalue).style.display = "block";
    } else {
        console.log('no');
        document.getElementById(element).style.display = "none";
        document.getElementById(labelvalue).style.display = "none";
    }   
}

$(document).ready(function() {
    namevalidation();
    validatePhone();
    emailValidation();
    dateValidation();
    checkbox();
});