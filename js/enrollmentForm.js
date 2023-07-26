import {isAuthenticated} from "./authenticationVerify.js";

export function fetchEnrollmentFormBody(callback) {
    let arr =[];
    $.ajax({
        url: `https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/enrollment/fetch/${localStorage.getItem('form_year_value')}`,
        type: 'get',
        success: function(response){
            // let editID = window.location.search.slice(4);
            // console.log(editID);
            $.ajax({
                // url: `https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/enrollment_data/fetch/${localStorage.getItem('child_id')}`,
                url: `https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/enrollment_data/fetch_by_id_year/${localStorage.getItem('child_id')}?year=${localStorage.getItem('form_year_value')}`,
                type: 'get',
                success: function(response1){
                    if(typeof response.point_one !='undefined'){
                        let paragraph = document.querySelector('[name="apiResponsep1"]');
                        paragraph.textContent = response.point_one;
                        
                        // Define the target texts and their corresponding textbox IDs
                        let targetTexts = ['effective the', ' day of', 'Inc., and'];
                        let textboxIds = ['point_one_field_one', 'point_one_field_two', 'point_one_field_three'];
                        let responseData = [response1[0].point_one_field_one,response1[0].point_one_field_two,response1[0].point_one_field_three]
                        
                        // Iterate over each target text
                        for (let i = 0; i < targetTexts.length; i++) {
                        let targetText = targetTexts[i];
                        let textboxId = textboxIds[i];
                        let responseFieldData =responseData[i];
                        arr.push(textboxIds[i]);
                        
                        // Create a new textbox element
                        let textBox = document.createElement('input');
                        textBox.setAttribute('type', 'text');
                        textBox.setAttribute('id', textboxId);
                        if(typeof responseData[i] == 'undefined' || responseData[i] == ''){
                            textBox.setAttribute('value','');
                        }else{
                            textBox.setAttribute('value',responseFieldData);
                        }
                        textBox.setAttribute('name', textboxId);
                        // textBox.setAttribute('class', 'form-control');
                        textBox.setAttribute('style', 'border: none; border-bottom: 1px solid black;');
                        // let textBoxs = document.body.appendChild(textBox);
                        // Replace the target text with the textbox in the paragraph
                        paragraph.innerHTML = paragraph.innerHTML.replace(targetText, targetText + textBox.outerHTML);
                        }
                    //    document.querySelector('[name="apiResponsep1"]').innerHTML = response.point_one;
                        document.querySelector('[name="apiResponsep2"]').innerHTML = response.point_two;
                        document.querySelector('[name="apiResponsep3"]').innerHTML = response.point_three;
                        document.querySelector('[name="apiResponsep4"]').innerHTML = response.point_four;
                        document.querySelector('[name="apiResponsep5"]').innerHTML = response.point_five;
                        document.querySelector('[name="apiResponsep6"]').innerHTML = response.point_six;
                        document.querySelector('[name="apiResponsep7"]').innerHTML = response.point_seven;
            
                        document.querySelector('[name="apiResponsep8"]').innerHTML = response.point_eight;
                        document.querySelector('[name="apiResponsep9"]').innerHTML = response.point_nine;
                        document.querySelector('[name="apiResponsep10"]').innerHTML = response.point_ten;
                        document.querySelector('[name="apiResponsep11"]').innerHTML = response.point_eleven;
                        document.querySelector('[name="apiResponsep12"]').innerHTML = response.point_twelve;
                        document.querySelector('[name="apiResponsep13"]').innerHTML = response.point_thirteen;
                        document.querySelector('[name="apiResponsep14"]').innerHTML = response.point_fourteen;
                        document.querySelector('[name="apiResponsep15"]').innerHTML = response.point_fifteen;
                        document.querySelector('[name="apiResponsep16"]').innerHTML = response.point_sixteen;
                        document.querySelector('[name="apiResponsep17"]').innerHTML = response.point_seventeen;
                        document.querySelector('[name="apiResponsep18"]').innerHTML = response.point_eighteen;
                        document.querySelector('[name="apiResponsep19"]').innerHTML = response.point_eighteen_initial;

                        document.querySelector('[name="apiResponsep20"]').innerHTML = response.parent_one_sign;
                        document.querySelector('[name="apiResponsep21"]').innerHTML = response.parent_one_sign_date;
                        document.querySelector('[name="apiResponsep22"]').innerHTML = response.parent_two_sign;
                        document.querySelector('[name="apiResponsep23"]').innerHTML = response.parent_two_sign_date;
                        document.querySelector('[name="apiResponsep24"]').innerHTML = response.child_name;
                        document.querySelector('[name="apiResponsep25"]').innerHTML = response.dob;
                        document.querySelector('[name="apiResponsep26"]').innerHTML = response.school_admin_sign;
                        document.querySelector('[name="apiResponsep27"]').innerHTML = response.school_admin_sign_date;
                    }
                    hideSpinner();
                    // if (typeof callback === 'function') {
                    //     callback();
                    // }

                    if (typeof response1[0].point_two_initial_here !== "undefined"){
                        document.getElementsByName("point_two_initial_here")[0].value = response1[0].point_two_initial_here;
                    }
                    if (typeof response1[0].point_three_initial_here !== "undefined"){
                        document.getElementsByName("point_three_initial_here")[0].value = response1[0].point_three_initial_here;
                    }
                    if (typeof response1[0].point_four_initial_here !== "undefined"){
                        document.getElementsByName("point_four_initial_here")[0].value = response1[0].point_four_initial_here;
                    }
                    if (typeof response1[0].point_five_initial_here !== "undefined"){
                        document.getElementsByName("point_five_initial_here")[0].value = response1[0].point_five_initial_here;
                    }
                    if (typeof response1[0].point_six_initial_here !== "undefined"){
                        document.getElementsByName("point_six_initial_here")[0].value = response1[0].point_six_initial_here;
                    }
                    if (typeof response1[0].point_seven_initial_here !== "undefined"){
                        document.getElementsByName("point_seven_initial_here")[0].value = response1[0].point_seven_initial_here;
                    }
                    if (typeof response1[0].point_eight_initial_here !== "undefined"){
                        document.getElementsByName("point_eight_initial_here")[0].value = response1[0].point_eight_initial_here;
                    }
                    if (typeof response1[0].point_nine_initial_here !== "undefined"){
                        document.getElementsByName("point_nine_initial_here")[0].value = response1[0].point_nine_initial_here;
                    }
                    if (typeof response1[0].point_ten_initial_here !== "undefined"){
                        document.getElementsByName("point_ten_initial_here")[0].value = response1[0].point_ten_initial_here;
                    }
                    if (typeof response1[0].point_eleven_initial_here !== "undefined"){
                        document.getElementsByName("point_eleven_initial_here")[0].value = response1[0].point_eleven_initial_here;
                    }
                    if (typeof response1[0].point_twelve_initial_here !== "undefined"){
                        document.getElementsByName("point_twelve_initial_here")[0].value = response1[0].point_twelve_initial_here;
                    }
                    if (typeof response1[0].point_thirteen_initial_here !== "undefined"){
                        document.getElementsByName("point_thirteen_initial_here")[0].value = response1[0].point_thirteen_initial_here;
                    }
                    if (typeof response1[0].point_fourteen_initial_here !== "undefined"){
                        document.getElementsByName("point_fourteen_initial_here")[0].value = response1[0].point_fourteen_initial_here;
                    }
                    if (typeof response1[0].point_fifteen_initial_here !== "undefined"){
                        document.getElementsByName("point_fifteen_initial_here")[0].value = response1[0].point_fifteen_initial_here;
                    }
                    if (typeof response1[0].point_sixteen_initial_here !== "undefined"){
                        document.getElementsByName("point_sixteen_initial_here")[0].value = response1[0].point_sixteen_initial_here;
                    }
                    if (typeof response1[0].point_seventeen_initial_here !== "undefined"){
                        document.getElementsByName("point_seventeen_initial_here")[0].value = response1[0].point_seventeen_initial_here;
                    }
                    if (typeof response1[0].point_eighteen_initial_here !== "undefined"){
                        document.getElementsByName("point_eighteen_initial_here")[0].value = response1[0].point_eighteen_initial_here;
                    }
                    if (typeof response1[0].parent_one_sign !== "undefined"){
                        document.getElementsByName("parent_one_sign")[0].value = response1[0].parent_one_sign;
                    }
                    if (typeof response1[0].parent_one_sign_date !== "undefined"){
                        document.getElementsByName("parent_one_sign_date")[0].value = response1[0].parent_one_sign_date;
                    }
                    if (typeof response1[0].parent_two_sign !== "undefined"){
                        document.getElementsByName("parent_two_sign")[0].value = response1[0].parent_two_sign;
                    }
                    if (typeof response1[0].parent_two_sign_date !== "undefined"){
                        document.getElementsByName("parent_two_sign_date")[0].value = response1[0].parent_two_sign_date;
                    }
                    if (typeof response1[0].child_name !== "undefined"){
                        document.getElementsByName("child_name")[0].value = response1[0].child_name;
                    }
                    if (typeof response1[0].dob !== "undefined"){
                        document.getElementsByName("dob")[0].value = response1[0].dob;
                    }
                    if (typeof response1[0].school_admin_sign !== "undefined"){
                        document.getElementsByName("school_admin_sign")[0].value = response1[0].school_admin_sign;
                    }
                    if (typeof response1[0].school_admin_sign_date !== "undefined"){
                        document.getElementsByName("school_admin_sign_date")[0].value = response1[0].school_admin_sign_date;
                    }
                    if (typeof callback === 'function') {
                        callback();
                    }

                    window.localStorage.setItem("responseEntrollmentData",JSON.stringify(response1[0]));
                },
            });
        },
    })
}

export function fetchEnrollmentFormTitle(callback) {
    $.ajax({
        url: `https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/enrollment/fetch/${localStorage.getItem('form_year_value')}`,
        type: 'get',
        success: function(response){
            document.querySelector('[name="heading"]').innerHTML = response.title;
            if (typeof callback === 'function') {
                callback();
            }
        }
    })
}

function fetchEnrollmentPointEight(callback) {
    $.ajax({
        url: `https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/holidays/fetch/${localStorage.getItem('form_year_value')}`,
        type: 'get',
        success: function(response){
            document.querySelector('[id="R1C1"]').innerHTML = response.year_one_leave_one;
            document.querySelector('[id="R1C2"]').innerHTML = response.year_one_leave_one_desc;
            document.querySelector('[id="R2C1"]').innerHTML = response.year_one_leave_two;
            document.querySelector('[id="R2C2"]').innerHTML = response.year_one_leave_two_desc;
            document.querySelector('[id="R3C1"]').innerHTML = response.year_one_leave_three;
            document.querySelector('[id="R3C2"]').innerHTML = response.year_one_leave_three_desc;
            document.querySelector('[id="R4C1"]').innerHTML = response.year_one_leave_four;
            document.querySelector('[id="R4C2"]').innerHTML = response.year_one_leave_four_desc;
            document.querySelector('[id="R5C1"]').innerHTML = response.year_one_leave_five;
            document.querySelector('[id="R5C2"]').innerHTML = response.year_one_leave_five_desc;
            document.querySelector('[id="R6C1"]').innerHTML = response.year_one_leave_six;
            document.querySelector('[id="R6C2"]').innerHTML = response.year_one_leave_six_desc;
            document.querySelector('[id="R7C1"]').innerHTML = response.year_one_leave_seven;
            document.querySelector('[id="R7C2"]').innerHTML = response.year_one_leave_seven_desc;
            document.querySelector('[id="R8C1"]').innerHTML = response.year_one_leave_eight;
            document.querySelector('[id="R8C2"]').innerHTML = response.year_one_leave_eight_desc;
            document.querySelector('[id="R9C1"]').innerHTML = response.year_one_leave_nine;
            document.querySelector('[id="R9C2"]').innerHTML = response.year_one_leave_nine_desc;
            document.querySelector('[id="R10C1"]').innerHTML = response.year_one_leave_ten;
            document.querySelector('[id="R10C2"]').innerHTML = response.year_one_leave_ten_desc;
            document.querySelector('[id="R11C1"]').innerHTML = response.year_two_leave_one;
            document.querySelector('[id="R11C2"]').innerHTML = response.year_two_leave_one_desc;
            document.querySelector('[id="R12C1"]').innerHTML = response.year_two_leave_two;
            document.querySelector('[id="R12C2"]').innerHTML = response.year_two_leave_two_desc;
            document.querySelector('[id="R13C1"]').innerHTML = response.year_two_leave_three;
            document.querySelector('[id="R13C2"]').innerHTML = response.year_two_leave_three_desc;
            document.querySelector('[id="R14C1"]').innerHTML = response.year_two_leave_four;
            document.querySelector('[id="R14C2"]').innerHTML = response.year_two_leave_four_desc;
            document.querySelector('[id="R15C1"]').innerHTML = response.year_two_leave_five;
            document.querySelector('[id="R15C2"]').innerHTML = response.year_two_leave_five_desc;
            document.querySelector('[id="R16C1"]').innerHTML = response.year_two_leave_six;
            document.querySelector('[id="R16C2"]').innerHTML = response.year_two_leave_six_desc;
            document.querySelector('[id="R17C1"]').innerHTML = response.year_two_leave_seven;
            document.querySelector('[id="R17C2"]').innerHTML = response.year_two_leave_seven_desc;
            document.querySelector('[id="R18C1"]').innerHTML = response.year_two_leave_eight;
            document.querySelector('[id="R18C2"]').innerHTML = response.year_two_leave_eight_desc;
            document.querySelector('[id="R19C1"]').innerHTML = response.year_two_leave_nine;
            document.querySelector('[id="R19C2"]').innerHTML = response.year_two_leave_nine_desc;
            document.querySelector('[id="R20C1"]').innerHTML = response.year_two_leave_ten;
            document.querySelector('[id="R20C2"]').innerHTML = response.year_two_leave_ten_desc;
            if (typeof callback === 'function') {
                callback();
            }
        }
    })
}

function showSpinner(callback) {
    document.getElementById("spinner").style.display = "block";
    document.getElementById("enrollment_from").style.opacity = "0.3";
    if (typeof callback === 'function') {
        callback();
    }
}

function hideSpinner(callback) {
    document.getElementById("spinner").style.display = "none";
    document.getElementById("enrollment_from").style.opacity = "1";
    if (typeof callback === 'function') {
        callback();
    }
}

$(document).ready(function () {
    if(!isAuthenticated()) {
        window.location.href = 'login.html';
    } else {
        document.body.style.visibility = 'visible';
        fetchEnrollmentFormTitle();
        fetchEnrollmentFormBody();
        fetchEnrollmentPointEight();
        showSpinner();
    }
})
  


  