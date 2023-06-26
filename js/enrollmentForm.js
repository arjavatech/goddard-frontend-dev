export function fetchEnrollmentFormBody(callback) {
    $.ajax({
        url: 'https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/enrollment/fetch/1',
        type: 'get',
        success: function(response){
            // console.log(response)
            
            if(typeof response.point_one !='undefined'){
                let paragraph = document.querySelector('[name="apiResponsep1"]');
                paragraph.textContent = response.point_one;
                
                // Define the target texts and their corresponding textbox IDs
                let targetTexts = ['effective the', ' day of', 'Inc., and'];
                let textboxIds = ['point_one_field_one', 'point_one_field_two', 'point_one_field_three'];
                
                // Iterate over each target text
                for (let i = 0; i < targetTexts.length; i++) {
                let targetText = targetTexts[i];
                let textboxId = textboxIds[i];
                
                // Create a new textbox element
                let textBox = document.createElement('input');
                textBox.setAttribute('type', 'text');
                textBox.setAttribute('id', textboxId);
                textBox.setAttribute('name', textboxId);
                textBox.setAttribute('class', 'form-control');
                textBox.setAttribute('style', 'border: none; border-bottom: 1px solid black;');
                // let textBoxs = document.body.appendChild(textBox);
                // Replace the target text with the textbox in the paragraph
                paragraph.innerHTML = paragraph.innerHTML.replace(targetText, targetText + textBox.outerHTML);
                // console.log(paragraph.innerHTML)
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
            // hideSpinner();
            if (typeof callback === 'function') {
                callback();
            }
        }
    })
}

export function fetchEnrollmentFormTitle(callback) {
    $.ajax({
        url: 'https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/enrollment/fetch/1',
        type: 'get',
        success: function(response){
            document.querySelector('[name="heading"]').innerHTML = response.title;
            if (typeof callback === 'function') {
                callback();
            }
        }
    })
}

export function fetchEnrollmentPointEight(callback) {
    $.ajax({
        url: 'https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/holidays/fetch/1',
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

export function displayDetails(callback) {
    $.ajax({
        url: 'https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/enrollment_data/fetch/CD0001',
        type: 'get',
        success: function(response){
            console.log(response);
            //    document.querySelector('[name="point_one_field_one"]').innerHTML = response.point_one_field_one;
            //    document.querySelector('[name="point_one_field_two"]').innerHTML = response.point_one_field_two;
            //    document.querySelector('[name="point_one_field_three"]').innerHTML = response.point_one_field_three;
            // document.getElementsByName('point_two_initial_here')[0].value = response.point_two_initial_here;

            // console.log(response.point_one_field_one); 
            if (typeof response.point_one_field_one !== "undefined") {
                console.log(response.point_one_field_one);      
                console.log(document.getElementsByName('point_one_field_one').value = response.point_one_field_one);
                // $("#point_one_field_one").val(response.point_one_field_one);
                // $('[name="point_one_field_one"]').val(response.point_one_field_one);
                 document.getElementsByName('point_one_field_one').value = response.point_one_field_one;
            }
            if (typeof response.point_one_field_two !== 'undefined'){
                //  $('#point_one_field_two').val(response.point_one_field_two);
                document.getElementsByName('point_one_field_two').value = response.point_one_field_two;
            }
            if (typeof response.point_one_field_three !== 'undefined'){
                //  $('#point_one_field_three').val(response.point_one_field_three);
                document.getElementsByName('point_one_field_three').value = response.point_one_field_three;
            }
            
            if (typeof response.point_two_initial_here !== "undefined"){
                document.getElementsByName("point_two_initial_here")[0].value = response.point_two_initial_here;
            }
            if (typeof response.point_three_initial_here !== "undefined"){
                document.getElementsByName("point_three_initial_here")[0].value = response.point_three_initial_here;
            }
            if (typeof response.point_four_initial_here !== "undefined"){
                document.getElementsByName("point_four_initial_here")[0].value = response.point_four_initial_here;
            }
            if (typeof response.point_five_initial_here !== "undefined"){
                document.getElementsByName("point_five_initial_here")[0].value = response.point_five_initial_here;
            }
            if (typeof response.point_six_initial_here !== "undefined"){
                document.getElementsByName("point_six_initial_here")[0].value = response.point_six_initial_here;
            }
            if (typeof response.point_seven_initial_here !== "undefined"){
                document.getElementsByName("point_seven_initial_here")[0].value = response.point_seven_initial_here;
            }
            if (typeof response.point_eight_initial_here !== "undefined"){
                document.getElementsByName("point_eight_initial_here")[0].value = response.point_eight_initial_here;
            }
            if (typeof response.point_nine_initial_here !== "undefined"){
                document.getElementsByName("point_nine_initial_here")[0].value = response.point_nine_initial_here;
            }
            if (typeof response.point_ten_initial_here !== "undefined"){
                document.getElementsByName("point_ten_initial_here")[0].value = response.point_ten_initial_here;
            }
            if (typeof response.point_eleven_initial_here !== "undefined"){
                document.getElementsByName("point_eleven_initial_here")[0].value = response.point_eleven_initial_here;
            }
            if (typeof response.point_twelve_initial_here !== "undefined"){
                document.getElementsByName("point_twelve_initial_here")[0].value = response.point_twelve_initial_here;
            }
            if (typeof response.point_thirteen_initial_here !== "undefined"){
                document.getElementsByName("point_thirteen_initial_here")[0].value = response.point_thirteen_initial_here;
            }
            if (typeof response.point_fourteen_initial_here !== "undefined"){
                document.getElementsByName("point_fourteen_initial_here")[0].value = response.point_fourteen_initial_here;
            }
            if (typeof response.point_fifteen_initial_here !== "undefined"){
                document.getElementsByName("point_fifteen_initial_here")[0].value = response.point_fifteen_initial_here;
            }
            if (typeof response.point_sixteen_initial_here !== "undefined"){
                document.getElementsByName("point_sixteen_initial_here")[0].value = response.point_sixteen_initial_here;
            }
            if (typeof response.point_seventeen_initial_here !== "undefined"){
                document.getElementsByName("point_seventeen_initial_here")[0].value = response.point_seventeen_initial_here;
            }
            if (typeof response.point_eighteen_initial_here !== "undefined"){
                document.getElementsByName("point_eighteen_initial_here")[0].value = response.point_eighteen_initial_here;
            }
            if (typeof response.parent_one_sign !== "undefined"){
                document.getElementsByName("parent_one_sign")[0].value = response.parent_one_sign;
            }
            if (typeof response.parent_one_sign_date !== "undefined"){
                document.getElementsByName("parent_one_sign_date")[0].value = response.parent_one_sign_date;
            }
            if (typeof response.parent_two_sign !== "undefined"){
                document.getElementsByName("parent_two_sign")[0].value = response.parent_two_sign;
            }
            if (typeof response.parent_two_sign_date !== "undefined"){
                document.getElementsByName("parent_two_sign_date")[0].value = response.parent_two_sign_date;
            }
            if (typeof response.child_name !== "undefined"){
                document.getElementsByName("child_name")[0].value = response.child_name;
            }
            if (typeof response.dob !== "undefined"){
                document.getElementsByName("dob")[0].value = response.dob;
            }
            if (typeof response.school_admin_sign !== "undefined"){
                document.getElementsByName("school_admin_sign")[0].value = response.school_admin_sign;
            }
            if (typeof response.school_admin_sign_date !== "undefined"){
                document.getElementsByName("school_admin_sign_date")[0].value = response.school_admin_sign_date;
            }
            if (typeof callback === 'function') {
                callback();
            }
        },
    })
}

export function showSpinner(callback) {
    // document.getElementById("spinner").style.display = "block";
    // document.getElementById("content").style.opacity = "0.3";
    // if (typeof callback === 'function') {
    //     callback();
    // }
}

export function hideSpinner(callback) {
    // document.getElementById("spinner").style.display = "none";
    // document.getElementById("content").style.opacity = "1";
    // if (typeof callback === 'function') {
    //     callback();
    // }
}

$(document).ready(function () {
    fetchEnrollmentFormTitle();
    fetchEnrollmentFormBody();
    fetchEnrollmentPointEight();
    displayDetails();
    // showSpinner();
    // hideSpinner();
   
   
})
// document.addEventListener('DOMContentLoaded', function() {
//     // Your code here
//     displayDetails();
//   });
  


  