function getEnrollmentFormStatus(val, callback) {
    $.ajax({
        url: `https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/enrollment_data/form_status/${localStorage.getItem('child_id')}?year=${val}`,
        type: 'get',
        success: function (form_status_resp) {
            callback(form_status_resp);
        }
    });
}

function parentDashBoardDetails(val) {
    localStorage.setItem('form_year_value', val);
    let form_status = 'unknown'
    $.ajax({
        url: `https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/dashboard_data/formByYear/${val}`,
        type: 'get',
        success: function (response) {
            if (Array.isArray(response) && response.length > 0) {
                getEnrollmentFormStatus(val, function (formStatusResp) {
                    form_status = formStatusResp.form_status;
                    response.forEach(data => {
                        if (data.form_name.includes('Enrollment')) {
                            // localStorage.setItem('child_name',
                            // response[0].child_full_name)
                            document.getElementById('enrollment_agreement').innerHTML =
                                data.form_name; //
                            // document.querySelector('[name="enrollment_span"]').style.display
                            // =  "block";
                            document.getElementById('date_value').innerHTML =
                                data.form_expiry_date;

                            if (form_status === "Yet To Be Filled") {
                                document.getElementById('form_status').innerHTML =
                                    form_status;
                                document.getElementById('form_status').style.color =
                                    '#0F2D52';
                                document.getElementById('form_status').style.fontWeight =
                                    'bold';
                                enableAction();
                            } else if (form_status === "Completed") {
                                document.getElementById('form_status').innerHTML =
                                    form_status;
                                document.getElementById('form_status').style.color = 'green';
                                document.getElementById('form_status').style.fontWeight =
                                    'bold';
                                disableAction();
                            } else if (form_status === "Incomplete") {
                                document.getElementById('form_status').innerHTML =
                                    form_status;
                                document.getElementById('form_status').style.color = 'red';
                                document.getElementById('form_status').style.fontWeight =
                                    'bold';
                                enableAction();
                            } else {
                                document.getElementById('form_status').innerHTML =
                                    form_status;
                                document.getElementById('form_status').style.color =
                                    '#FFCC00';
                                document.getElementById('form_status').style.fontWeight =
                                    'bold';
                                enableAction();
                            }
                        } else if (data.form_name.includes('Hand Book')) {
                            document.getElementById('tableFooterHeading').innerHTML =
                                data.form_name;
                        }
                    })
                });
            }
        }
    });
}

// Disable the action and styling
function disableAction() {
    let link = document.getElementById('pencil_icon_link');
    let icon1 = document.getElementById('enrollmentForm');

    link.style.pointerEvents = 'none'; // Disable link click
    icon1.style.color = 'gray';//changed the color
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
    icon1.style.color = '#0F2D52';//changed the color
    icon1.classList.remove('disabled'); // Remove disabled styling

    let span = document.querySelector('[data-bs-toggle="modal"]');
    let icon2 = document.getElementById('mail_icon');

    span.style.pointerEvents = 'auto'; // Enable span click
    icon2.style.color = '#0F2D52';//changed the color
    icon2.classList.remove('disabled'); // Remove disabled styling
}

//to display child's year
function parentDashBoardYear() {
    const child_id = localStorage.getItem('child_id')
    const url = 'https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/enrollment_data/fetch/'
    // console.log(url + child_id)
    $.ajax({
        url: url + child_id,
        type: 'get',
        success: function (response) {
            let yearArray = []
            for (let i = 0; i < response.length; i++) {
                yearArray.push(response[i].year)
            }
            yearArray.sort().reverse();
            let optionsData = '';
            document.querySelector('[name="form_year"]').innerHTML = '';
            for (let i = 0; i < yearArray.length; i++) {
                optionsData += '<option value="' + yearArray[i] + '">' + yearArray[i]
                                + '</option>';
                document.querySelector('[name="form_year"]').innerHTML =
                    optionsData;
            }
        }
    });
}

$(document).ready(function () {
    //geting current year
    let defaultdate = new Date().getFullYear();
    document.querySelector('[name="child_dashboard_name"]').innerHTML =
        localStorage.getItem('child_name');
    parentDashBoardDetails(defaultdate);
    parentDashBoardYear();
});
