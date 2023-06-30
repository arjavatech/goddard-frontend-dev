function parentDashBoardDetails(val) {
    $.ajax({
        url: `https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/dashboard_data/fetch/${val}`,
        type: 'get',
        success: function(response){
            console.log(response);
            console.log(response.form_status);
            if(typeof response.child_name !='undefined'){
                document.querySelector('[name="child_name"]').innerHTML = response.child_name;
                document.querySelector('[name="enrollment_agreement"]').innerHTML = response.form_name1;
                document.querySelector('[name="date_value"]').innerHTML = response.form_expiry_date;
                if(response.form_status == "Yet To Be Filled"){
                    document.querySelector('[name="form_status"]').innerHTML = response.form_status;
                    document.getElementById('form_status').style.color = '#0F2D52';
                    document.getElementById('form_status').style.fontWeight = 'bold';
                }else if(response.form_status == "Completed"){
                    document.querySelector('[name="form_status"]').innerHTML = response.form_status;
                    document.getElementById('form_status').style.color = 'green';
                    document.getElementById('form_status').style.fontWeight = 'bold';
                }else if(response.form_status == "Incomplete"){
                    document.querySelector('[name="form_status"]').innerHTML = response.form_status;
                    document.getElementById('form_status').style.color = 'red';
                    document.getElementById('form_status').style.fontWeight = 'bold';
                }else{
                    document.querySelector('[name="form_status"]').innerHTML = response.form_status;
                    document.getElementById('form_status').style.color = 'yellow';
                    document.getElementById('form_status').style.fontWeight = 'bold';
                }
            }
        }
    })
}

function parentDashBoardYear(){
    $.ajax({
        url: 'https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/dashboard_data/all',
        type: 'get',
        success: function(response){
            console.log(response);
            let responseKey = Object.keys(response);
            responseKey.sort().reverse();
            console.log(responseKey);
            let responseKey_details;
            if(response !== ""){
                document.querySelector('[name="form_year"]').innerHTML = '';
                for (let i = 0; i < responseKey.length; i++) { 
                    if(responseKey[i] != "" && responseKey[i] != undefined ){                      
                        responseKey_details += '<option value="' + responseKey[i] + '">' + responseKey[i] + '</option>';  
                    }                                                                                                                       
                    document.querySelector('[name="form_year"]').innerHTML = responseKey_details;
                }            
            } 
            
        }
    });
}
$(document).ready(function() {
    let defaultdate = new Date().getFullYear();
    console.log(defaultdate);
    parentDashBoardDetails(defaultdate);
    parentDashBoardYear();
});