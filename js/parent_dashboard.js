function parentDashBoardDetails(val) {
    console.log(val);
    localStorage.setItem('form_year_value',val);
    console.log(localStorage.getItem('form_year_value'));
    $.ajax({
        url: `https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/dashboard_data/fetch/${val}`,
        type: 'get',
        success: function(response){
            console.log(response);
            if(typeof response.child_name !='undefined'){
                // localStorage.setItem('child_name', response[0].child_full_name)
                document.querySelector('[name="child_name"]').innerHTML = localStorage.getItem('child_name');
                document.querySelector('[name="enrollment_agreement"]').innerHTML = response.form_name1;
                // document.querySelector('[name="enrollment_span"]').style.display = "block";
                document.querySelector('[name="date_value"]').innerHTML = response.form_expiry_date;
                if (response.form_status == "Yet To Be Filled") {
                    document.querySelector('[name="form_status"]').innerHTML = response.form_status;
                    document.getElementById('form_status').style.color = '#0F2D52';
                    document.getElementById('form_status').style.fontWeight = 'bold';
                    enableAction();
                } else if (response.form_status == "Completed") {
                    document.querySelector('[name="form_status"]').innerHTML = response.form_status;
                    document.getElementById('form_status').style.color = 'green';
                    document.getElementById('form_status').style.fontWeight = 'bold';
                    disableAction();
                } else if (response.form_status == "Incomplete") {
                    document.querySelector('[name="form_status"]').innerHTML = response.form_status;
                    document.getElementById('form_status').style.color = 'red';
                    document.getElementById('form_status').style.fontWeight = 'bold';
                    enableAction();
                } else {
                    document.querySelector('[name="form_status"]').innerHTML = response.form_status;
                    document.getElementById('form_status').style.color = 'yellow';
                    document.getElementById('form_status').style.fontWeight = 'bold';
                    enableAction();
                }
                  
            }
        }
    })
}

// Disable the action and styling
function disableAction() {
    let link = document.getElementById('pencil_icon_link');
    let icon1 = document.getElementById('enrollmentForm');

    link.style.pointerEvents = 'none'; // Disable link click
    icon1.style.color ='gray';//changed the color
    icon1.classList.add('disabled'); // Apply disabled styling

    let span = document.querySelector('[data-bs-toggle="modal"]');
    let icon2 = document.getElementById('mail_icon');

    span.style.pointerEvents = 'none'; // Disable span click
    icon2.style.color = 'gray'//changed the color
    icon2.classList.add('disabled'); // Apply disabled styling
}
  
// Enable the action and styling
function enableAction() {
    let link = document.getElementById('pencil_icon_link');
    let icon1 = document.getElementById('enrollmentForm');

    link.style.pointerEvents = 'auto'; // Enable link click
    icon1.style.color ='#0F2D52';//changed the color
    icon1.classList.remove('disabled'); // Remove disabled styling

    let span = document.querySelector('[data-bs-toggle="modal"]');
    let icon2 = document.getElementById('mail_icon');

    span.style.pointerEvents = 'auto'; // Enable span click
    icon2.style.color ='#0F2D52';//changed the color
    icon2.classList.remove('disabled'); // Remove disabled styling
}

  //to display child's year
function parentDashBoardYear(){
    $.ajax({
        url: 'https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/dashboard_data/all',
        type: 'get',
        success: function(response){
            //getting key form the response details
            let responseKey = Object.keys(response);
            //sorting and reversing the response value
            responseKey.sort().reverse();
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
    //geting current year
    let defaultdate = new Date().getFullYear();
    parentDashBoardDetails(defaultdate);
    parentDashBoardYear();
});
