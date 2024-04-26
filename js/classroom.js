import {isAuthenticated} from "./authenticationVerify.js";


// Function to submit the form data
// function submitForm() {
//     let response1 = window.localStorage.getItem("responseClassDetails");
//     let jsonParse =JSON.parse(response1);
//     console.log(jsonParse.class_id);
//     const form = document.getElementById("classRoomForm");
//     const formData = new FormData(form);
//     const obj = Object.fromEntries(formData);

//     if(!jsonParse.class_id){
//     // if(response1.class_id == '' || response1.class_name == ''){
//         let json = JSON.stringify(obj);
//         console.log(json);
//         $.ajax({
//             url: "http://localhost:8080/ClassId_ClassName_info/add",
//             type: "POST",
//             contentType: "application/json",
//             data: json,
//             success: function (response) {
//                 alert(response.message)
//                 $(".success-msg-save").show();
//                     setTimeout(function(){
//                     $(".success-msg-save").hide();
//                     window.location.reload();
//                     // window.location.href = 'child_add.html';
//                 }, 3000);  
//             },
//             error: function (xhr, status, error) {
//                 alert("failed to save admission form");
//             }
//         });
//     }else{
//         obj.class_id = jsonParse.class_id;
//         console.log(obj);
//         let json = JSON.stringify(obj);
//         console.log(json);
//         $.ajax({
//             url: "http://localhost:8080/ClassId_ClassName_info/update",
//             type: "PUT",
//             contentType: "application/json",
//             data: json,
//             success: function (response) {
//                 alert(response.message)
//                 $(".success-msg-save").show();
//                     setTimeout(function(){
//                     $(".success-msg-save").hide();
//                     window.location.reload();
//                     // window.location.href = 'child_add.html';
//                 }, 3000);  
//             },
//             error: function (xhr, status, error) {
//                 alert("failed to save admission form");
//             }
//         });
//     }
// }

//this function is used to add caste details
var form = document.getElementById("classRoomForm");
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const obj = Object.fromEntries(formData);
    const json=JSON.stringify(obj);
    $.ajax({
        url: "http://localhost:8080/ClassId_ClassName_info/add",
        type: "POST",
        contentType: "application/json",
        data: json,
        success: function (response) {
            alert(response.message)
            $(".success-msg-save").show();
                setTimeout(function(){
                $(".success-msg-save").hide();
                window.location.reload();
                // window.location.href = 'child_add.html';
            }, 3000);  
        },
        error: function (xhr, status, error) {
            alert("failed to save admission form");
        }
    });
});


$(document).ready(function () {
    // if (!isAuthenticated()) {
    //     window.location.href = 'login.html';
    // } else {
    //     document.body.style.visibility = 'visible';
        // $(document).on("click", "#classroombtn", function(e) {
        //     e.preventDefault();
        //     submitForm();
        // });
    // }
});




