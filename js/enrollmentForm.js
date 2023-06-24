export function fetchEnrollmentFormBody(callback) {
    $.ajax({
        url: 'https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/enrollment/fetch/1',
        type: 'get',
        success: function(response){
            console.log(response)
            
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
                textBox.setAttribute('class', 'form-control');
                textBox.setAttribute('style', 'border: none; border-bottom: 1px solid black;');

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
            hideSpinner();
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

export function displayDetails(callback) {
    $.ajax({
        url: 'https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/enrollment_data/fetch/CD0001',
        type: 'get',
        success: function(response){
            console.log(response);
            //    document.querySelector('[name="heading"]').innerHTML = response.title;
            // document.getElementsByName('point_two_initial_here')[0].value = response.point_two_initial_here;

            if (typeof response.point_one_field_one !== "undefined"){
                document.getElementById("point_one_field_one")[0].value = response.point_one_field_one;
            }
            if (typeof response.point_one_field_two !== "undefined"){
                document.getElementById("point_one_field_two")[0].value = response.point_one_field_two;
            }
            if (typeof response.point_one_field_three !== "undefined"){
                document.getElementById("point_one_field_three")[0].value = response.point_one_field_three;
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
        }
    })
}

export function showSpinner(callback) {
    document.getElementById("spinner").style.display = "block";
    document.getElementById("content").style.opacity = "0.3";
    if (typeof callback === 'function') {
        callback();
    }
}

export function hideSpinner(callback) {
    document.getElementById("spinner").style.display = "none";
    document.getElementById("content").style.opacity = "1";
    if (typeof callback === 'function') {
        callback();
    }
}

$(document).ready(function () {
    fetchEnrollmentFormTitle();
    fetchEnrollmentFormBody();
    displayDetails();
    showSpinner();
    hideSpinner();
   
})



  