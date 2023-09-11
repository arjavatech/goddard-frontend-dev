'use strict';


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