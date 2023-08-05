function parentDashBoardDetails(val) {
    console.log(val)
    localStorage.setItem('form_year_value', val);
    $.ajax({
        url: `https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/dashboard_data/formByYear/${val}`,
        type: 'get',
        success: function (response) {
            console.log(response);
            for(let i=0;i<response.length;i++){
                // Create a new table row
                let tbodyval = document.getElementById('tbodyval');
                var tableRow = document.createElement('tr');

                // Create the first cell with the enrollment agreement checkbox
                var enrollmentCell = document.createElement('td');
                enrollmentCell.id = 'enrollment_agreement';
                enrollmentCell.name = 'enrollment_agreement';
                enrollmentCell.innerHTML = response[i].form_name + '<span class="required"> *</span>';
                tableRow.appendChild(enrollmentCell);

                // Create the second cell for the date value
                var dateCell = document.createElement('td');
                dateCell.id = 'date_value';
                dateCell.name = 'date_value';
                if (response[i].hasOwnProperty('form_expiry_date')) {
                    dateCell.innerHTML = response[i].form_expiry_date;
                }
                tableRow.appendChild(dateCell);

                // Create the third cell for the form status
                var statusCell = document.createElement('td');
                statusCell.id = 'form_status';
                statusCell.name = 'form_status';
                if (response[i].hasOwnProperty('form_status')) {
                    statusCell.innerHTML = response[i].form_status;
                    if (response[i].form_status === "Yet To Be Filled") {
                        statusCell.style.color = '#0F2D52';
                        statusCell.style.fontWeight = 'bold';
                        enableAction();
                    } else if (response[i].form_status === "Completed") {
                        statusCell.style.color = 'green';
                        statusCell.style.fontWeight = 'bold';
                        disableAction();
                    } else if (response[i].form_status === "Incomplete") {
                        statusCell.style.color = 'red';
                        statusCell.style.fontWeight = 'bold';
                        enableAction();
                    } else {
                        statusCell.style.color = 'yellow';
                        statusCell.style.fontWeight = 'bold';
                        enableAction();
                    }
                }
                tableRow.appendChild(statusCell);

                // Create the fourth cell for the icons
                var iconCell = document.createElement('td');
                // Create the Edit icon link
                var editLink = document.createElement('a');
                editLink.href = '#';
                editLink.setAttribute('data-dynamic-value', 'example');
                editLink.id = 'pencil_icon_link';
                editLink.name = 'pencil_icon_link';
                editLink.className = 'fa-stack';
                var link = editLink;
                var dynamicValue = localStorage.getItem('child_id');
                link.href = `form.html?id=${dynamicValue}`;

                // Create the Edit icon
                var editIcon = document.createElement('i');
                editIcon.className = 'fa-sharp fa-solid fa-pen p-1 action-icons';
                editIcon.id = 'enrollmentForm';
                editIcon.name = 'enrollmentForm';
                editLink.appendChild(editIcon);
                iconCell.appendChild(editLink);

                var downloadIcon = document.createElement('i');
                downloadIcon.className = 'fa-solid fa-circle-arrow-down p-2 action-icons';
                downloadIcon.id = 'downloadFormAsPDF';
                downloadIcon.name = 'downloadForm';
                iconCell.appendChild(downloadIcon);

                var mailLink = document.createElement('span');
                mailLink.id='staticBackdrop';
                mailLink.setAttribute('data-bs-toggle', 'modal');
                mailLink.setAttribute('data-bs-target', '#staticBackdrop');
                // Create the Edit icon
                var mailIcon = document.createElement('i');
                mailIcon.className = 'fa-solid fa-envelope p-1 action-icons';
                mailIcon.id = 'mail_icon';
                mailIcon.name = 'mail_icon';
                mailLink.appendChild(mailIcon);
                iconCell.appendChild(mailLink);

                var printIcon = document.createElement('i');
                printIcon.className = 'fa-solid fa-print p-2 action-icons';
                printIcon.id = 'printFormBtn';
                iconCell.appendChild(printIcon);

                // Append the icon cell to the table row
                tableRow.appendChild(iconCell);
                tbodyval.appendChild(tableRow);

                // Add event listener for the Mail icon
                var mailIcon = document.getElementById('mail_icon');
                var mailModal = new bootstrap.Modal(document.getElementById('staticBackdrop'));
                mailIcon.addEventListener('click', function() {
                    mailModal.show();
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
    console.log(url + child_id)
    $.ajax({
        url: url + child_id,
        type: 'get',
        success: function (response) {
            console.log(response)
            let yearArray = []
            for (let i = 0; i < response.length; i++) {
                yearArray.push(response[i].year)
            }
            yearArray.sort().reverse();
            console.log(yearArray);
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
