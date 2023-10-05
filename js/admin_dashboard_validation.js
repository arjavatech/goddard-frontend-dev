'use strict';

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

function activeFormList(){
    $.ajax({
        url :'https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/goddard_all_form/all/forms?status=Active',
        type : 'GET',
        success : function(response){
            console.log(response);
            let responsevalue = Object.values(response);
            let optionsData = '';
            document.querySelector('[name="active_form_list"]').value ='';
            for (let i = 0; i <= responsevalue.length; i++) {
                console.log(responsevalue[i].form_name);
                optionsData += '<option value="' + responsevalue[i] + '">' + responsevalue[i]+ '</option>';
                document.querySelector('[name="active_form_list"]').value =optionsData;
            }
        }
    });
}
