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
    $.ajax({
        url: `https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/dashboard_data/formByYear/${val}`,
        type: 'get',
        success: function (response) {
            console.log(response);
            if (Array.isArray(response) && response.length > 0) {
                getEnrollmentFormStatus(val, function (formStatusResp) {
                    let form_status = formStatusResp.form_status;
                    const tableBody = document.getElementById('tableBody');

                    // Clear the existing table row
                    tableBody.innerHTML = '';

                    response.forEach(data => {
                        const newRow = document.createElement('tr');

                        // Create and append cells for each data point
                        const formNameCell = document.createElement('td');
                        formNameCell.innerText = data.form_name;

                        const formExpiryDateCell = document.createElement('td');
                        formExpiryDateCell.innerText = data.form_expiry_date;

                        const formStatusCell = document.createElement('td');
                        formStatusCell.innerText = form_status;

                        // Create a cell for action items
                        const actionCell = document.createElement('td');

                        // Add action buttons to the action cell
                        const editLink = document.createElement('a');
                        var dynamicValue = localStorage.getItem('child_id');
                        if(data.form_name == 'Goddard Application Form'){
                            editLink.href = `form.html?id=${dynamicValue}`;
                        }else if(data.form_name == 'SVG form') {
                            editLink.href = `svg.html?id=${dynamicValue}`;
                        }
                        
                        editLink.setAttribute('data-dynamic-value', 'example');

                        
                        // ... Add other attributes and content for editLink

                        const editIcon = document.createElement('i');
                        editIcon.className = 'fa-sharp fa-solid fa-pen p-1 action-icons';
                        // ... Add other attributes and content for editIcon

                        const downloadIcon = document.createElement('i');
                        downloadIcon.className = 'fa-solid fa-circle-arrow-down p-2 action-icons';
                        // ... Add other attributes and content for downloadIcon

                        const mailSpan = document.createElement('span');
                        mailSpan.setAttribute('data-bs-toggle', 'modal');
                        mailSpan.setAttribute('data-bs-target', '#staticBackdrop');
                        // ... Add other attributes and content for mailSpan

                        const mailIcon = document.createElement('i');
                        mailIcon.className = 'fa-solid fa-envelope p-1 action-icons';
                        // ... Add other attributes and content for mailIcon

                        const printIcon = document.createElement('i');
                        printIcon.className = 'fa-solid fa-print p-2 action-icons';
                        // ... Add other attributes and content for printIcon

                        // Append action items to the action cell
                        actionCell.appendChild(editLink);
                        editLink.appendChild(editIcon);
                        actionCell.appendChild(downloadIcon);
                        actionCell.appendChild(mailSpan);
                        mailSpan.appendChild(mailIcon);
                        actionCell.appendChild(printIcon);

                        // Append cells to the row
                        newRow.appendChild(formNameCell);
                        newRow.appendChild(formExpiryDateCell);
                        newRow.appendChild(formStatusCell);
                        newRow.appendChild(actionCell);

                        // Append the row to the table
                        tableBody.appendChild(newRow);

                        // Apply styling based on form status here as needed
                    });
                });
            }
        }
    });
}




// function parentDashBoardDetails(val) {
//     localStorage.setItem('form_year_value', val);
//     let form_status = 'unknown'
//     $.ajax({
//         url: `https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/dashboard_data/formByYear/${val}`,
//         type: 'get',
//         success: function (response) {
//             console.log(response);
//             if (Array.isArray(response) && response.length > 0) {
//                 getEnrollmentFormStatus(val, function (formStatusResp) {
//                     form_status = formStatusResp.form_status;
//                     response.forEach(data => {
//                         if (data.form_name.includes('Enrollment')) {
//                             // localStorage.setItem('child_name',
//                             // response[0].child_full_name)
//                             document.getElementById('enrollment_agreement').innerHTML =
//                                 data.form_name; //
//                             // document.querySelector('[name="enrollment_span"]').style.display
//                             // =  "block";
//                             document.getElementById('date_value').innerHTML =
//                                 data.form_expiry_date;

//                             if (form_status === "Yet To Be Filled") {
//                                 document.getElementById('form_status').innerHTML =
//                                     form_status;
//                                 document.getElementById('form_status').style.color =
//                                     '#0F2D52';
//                                 document.getElementById('form_status').style.fontWeight =
//                                     'bold';
//                                 enableAction();
//                             } else if (form_status === "Completed") {
//                                 document.getElementById('form_status').innerHTML =
//                                     form_status;
//                                 document.getElementById('form_status').style.color = 'green';
//                                 document.getElementById('form_status').style.fontWeight =
//                                     'bold';
//                                 disableAction();
//                             } else if (form_status === "Incomplete") {
//                                 document.getElementById('form_status').innerHTML =
//                                     form_status;
//                                 document.getElementById('form_status').style.color = 'red';
//                                 document.getElementById('form_status').style.fontWeight =
//                                     'bold';
//                                 enableAction();
//                             } else {
//                                 document.getElementById('form_status').innerHTML =
//                                     form_status;
//                                 document.getElementById('form_status').style.color =
//                                     '#FFCC00';
//                                 document.getElementById('form_status').style.fontWeight =
//                                     'bold';
//                                 enableAction();
//                             }
//                         } else if (data.form_name.includes('Hand Book')) {
//                             document.getElementById('tableFooterHeading').innerHTML =
//                                 data.form_name;
//                         }
//                     })
//                 });
//             }
//         }
//     });
// }

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
