import {isAuthenticated} from "./authentication_verify.js";

 // Function to submit the form data
 function submitForm() {
    const form = document.getElementById("childBasicForm");
    console.log(form);
    const formData = new FormData(form);
    const obj = Object.fromEntries(formData);
    if(obj.child_first_name != ''&& obj.child_last_name != '' 
        && obj.dob !='' && obj.class_room !='' && obj.primary_parent_email){
        const json =JSON.stringify(obj);
        // console.log(json);
        $.ajax({
            url: "https://jvirbzj4p1.execute-api.us-west-2.amazonaws.com/goddard_test/admission_child_personal/add",
            type: "POST",
            contentType: "application/json",
            data: json,
            success: function (response) {
                // alert(response.message);
                $(".success-msg").show();
                    setTimeout(function(){
                    $(".success-msg").hide();
                    window.location.reload();
                }, 3000);     
            },
            error: function (xhr, status, error) {
                alert("failed to submit admission form");
            }
        });
    }else{
        // window.location.reload();
        // alert('you have to fill all the fields');
        $(".error-msg").show();
            setTimeout(function(){
            $(".error-msg").hide(); 
        }, 3000);
    }
    
    
}
$(document).ready(function () {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
    } else {
        $("#basic_child_button").on("click", function (e) {
            e.preventDefault(); // Prevent the default form submission
            submitForm();
        });
        $('#primary_parent_email').on('focus', function(){
            //for waking up the aws lambda server
            $.ajax({
                url: 'https://jvirbzj4p1.execute-api.us-west-2.amazonaws.com/goddard_test/parent_invite_info/all_parent_email',
                type: 'get',
                datasrc:'',
                dataType:'json',
                //this is uesd to get the response and return the result
                success: function(response){
                    console.log(response);
                    var parent_email = ''; 
                    if(response !== ""){
                        for (var i = 0; i < response.length; i++) { 
                            console.log(response[i].parent_email);
                            if(response[i].parent_email != "" && response[i].parent_email != undefined ){                      
                                parent_email += '<option value="' + response[i].parent_email + '">' + response[i].parent_email + '</option>';  
                            }  
                        } 
                    } 
                    document.getElementById('primary_parent_email').innerHTML =parent_email;
                }
            });
        });  
        $('#class_name').on('focus', function(){
        //for waking up the aws lambda server
        $.ajax({
            url: 'https://jvirbzj4p1.execute-api.us-west-2.amazonaws.com/goddard_test/ClassId_ClassName_info/all',
            type: 'get',
            datasrc:'',
            dataType:'json',
            //this is uesd to get the response and return the result
            success: function(response){
                var class_room = ''; 
                if(response !== ""){
                    for (var i = 0; i < response.length; i++) { 
                        if(response[i].class_name != "" && response[i].class_name != undefined ){                      
                            class_room += '<option value="' + response[i].class_name + '">' + response[i].class_name + '</option>';  
                        }  
                    } 
                } 
                document.getElementById('class_name').innerHTML =class_room;
            }
        });
    });  
    }
});
