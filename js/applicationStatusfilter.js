'use strict';
function enrollmentValueSend(status,id,year,form_name){
    var enrollmentValue={child_id : id,year:year,form_status:status,form_name:form_name};
    $.ajax({
        url: "https://6flxkkqvr4.execute-api.us-west-2.amazonaws.com/dev/child_form/add",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(enrollmentValue),
        success: function (response) {
            // alert("form submitted successfully");
        },
        error: function (xhr, status, error) {
            // alert("form submit failed");
        }
    });

}
function applicationStatusYear() {
    // localStorage.setItem('form_year_value', val);
    // let applicationStatusYear = document.getElementById("applicationStatusYear");
    // applicationStatusYear.textContent = val;
    $.ajax({
        url: `https://6flxkkqvr4.execute-api.us-west-2.amazonaws.com/dev/admission_child_personal/all_child_status`,
        type: 'get',
        success: function (response) {
            let responseValue = Object.values(response);
            if (Array.isArray(responseValue)) {
                const tableBody = document.getElementById('tableBody');
                tableBody.innerHTML = ''; // Clear existing content
        
                // for (let i = 0; i < responseValue.length; i++) {
                //     const rowData = responseValue[i];
                    for (let j = 0; j <responseValue.length; j++) {
                        // Create a new row for each data set
                        const row = document.createElement('tr');

                        const childIdCell = document.createElement('td');
                        // childIdCell.textContent = responseValue[j].child_id;
                        row.appendChild(childIdCell);
                        let anchor = document.createElement('a');
                        anchor.setAttribute('class','nav-link ');
                        anchor.textContent = responseValue[j].child_id;
                        anchor.setAttribute('href', `checking(${responseValue[j].child_id})`);
                        childIdCell.appendChild(anchor);
                        // Create cell for child name
                        const childNameCell = document.createElement('td');
                        childNameCell.textContent = responseValue[j].child_name;
                        row.appendChild(childNameCell);
                        
            
                        // Create cell for parent name
                        const parentNameCell = document.createElement('td');
                        parentNameCell.textContent = responseValue[j].parent_name;
                        row.appendChild(parentNameCell);

                        const applicationStatusCell = document.createElement('td');
                        applicationStatusCell.textContent = responseValue[j]. form_status;
                        row.appendChild(applicationStatusCell);
            
                        // const enrollmentStatusCell = document.createElement('td');
                        // enrollmentStatusCell.setAttribute('id', 'enrollment_form_status');
                        // enrollmentStatusCell.setAttribute('name', 'enrollment_form_status');
                        // enrollmentStatusCell.textContent = responseValue[j].enrollment_form_status_level;
                        // row.appendChild(enrollmentStatusCell);

                        // const enrollmentStatusCell = document.createElement('td');
                        // enrollmentStatusCell.setAttribute('id', 'enrollment_form_status');
                        // enrollmentStatusCell.setAttribute('name', 'enrollment_form_status');
                        // enrollmentStatusCell.setAttribute('style', 'border: none;');

                        // // Create a <select> element
                        // const statusSelect = document.createElement('select');
                        // statusSelect.style.color = "red";
                        // statusSelect.setAttribute('style', 'border: none;');

                        // // Create <option> elements for each status option
                        // const completedOption = document.createElement('option');
                        // completedOption.value = 'Completed';
                        // completedOption.textContent = 'Completed';
                        // completedOption.style.color = 'green';


                        // const reviewingOption = document.createElement('option');
                        // reviewingOption.value = 'Reviewing';
                        // reviewingOption.textContent = 'Reviewing';
                        // reviewingOption.style.color = '#a5a202';

                        // const incompleteOption = document.createElement('option');
                        // incompleteOption.value = 'Incomplete';
                        // incompleteOption.textContent = 'Incomplete';
                        // incompleteOption.style.color = 'red';

                        // // Append the <option> elements to the <select> element
                        // statusSelect.appendChild(incompleteOption);
                        // statusSelect.appendChild(reviewingOption);
                        // statusSelect.appendChild(completedOption);
                        // statusSelect.addEventListener('change',function(){
                        //    enrollmentValueSend(statusSelect.value, responseValue[j].child_id, responseValue[j].year,responseValue[j].form_name);
                        // });
                       
                        // enrollmentStatusCell.appendChild(statusSelect);
                        // row.appendChild(enrollmentStatusCell);

                        // // Set the default selected option based on responseValue[j].



                        // // Apply styles based on enrollment status
                        // if (responseValue[j].enrollment_form_status_level === "Completed") {
                        //     enrollmentStatusCell.style.color = 'green';
                        //     enrollmentStatusCell.style.fontWeight = 'bold';
                        // } else if (responseValue[j].enrollment_form_status_level === "Incomplete") {
                        //     enrollmentStatusCell.style.color = 'red';
                        //     enrollmentStatusCell.style.fontWeight = 'bold';
                        // } else {
                        //     enrollmentStatusCell.style.color = '#a5a202';
                        //     enrollmentStatusCell.style.fontWeight = 'bold';
                        // }
            
                        // Append the row to the table body
                        tableBody.appendChild(row);
                    }
                // }
            }
        }
    });
}

//to display child's year
function applicationStatusAllYear() {
    // const child_id = localStorage.getItem('child_id')
    // const url = ' https://6flxkkqvr4.execute-api.us-west-2.amazonaws.com/dev/admission/app_status/info'
    // $.ajax({
    //     url: url,
    //     type: 'get',
    //     success: function (response) {
    //         let yearArray = Object.keys(response);
    //         yearArray.sort().reverse();
    //         let optionsData = '';
    //         document.querySelector('[name="form_year"]').innerHTML = '';
    //         for (let i = 0; i < yearArray.length; i++) {
    //             optionsData += '<option value="' + yearArray[i] + '">' + yearArray[i]
    //                             + '</option>';
    //             document.querySelector('[name="form_year"]').innerHTML =
    //                 optionsData;
    //         }
    //     }
    // });
}

function filterTableByEnrollmentStatus(selectedStatus) {
    const tableRows = document.querySelectorAll("#tableBody tr");
    tableRows.forEach((row) => {
        const enrollmentStatusCell = row.querySelector("[name='enrollment_form_status']");
        if (enrollmentStatusCell) {
            const status = enrollmentStatusCell.textContent.trim();
            if (selectedStatus === "Filter 🔖" || status === selectedStatus) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        }
    });
}


function formdetails(val){
    let form_table_name;
    if(val == 'ACH Recurring payments form'){
        form_table_name = 'enrollment_data';
    }else if(val == '2023-2024 Enrollment Agreement'){
        form_table_name = 'bill_ach';
    }
    document.querySelector('[id="applicationStatusLabel"]').innerHTML = `${val} :`;
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = ''; // Clear existing content

    $.ajax({
        url: ` https://6flxkkqvr4.execute-api.us-west-2.amazonaws.com/dev/${form_table_name}/all_form_status `,
        type: 'get',
        success: function (response1) {
            $.ajax({
                url: ` https://6flxkkqvr4.execute-api.us-west-2.amazonaws.com/dev/admission/admission_status_info`,
                type: 'get',
                success: function (response) {
                    let responseValue = Object.values(response);
                    if (Array.isArray(responseValue)) {
                        const tableBody = document.getElementById('tableBody');
                        tableBody.innerHTML = ''; // Clear existing content
                
                        // for (let i = 0; i < responseValue.length; i++) {
                        //     const rowData = responseValue[i];
                            for (let j = 0; j <responseValue.length; j++) {
                                // Create a new row for each data set
                                const row = document.createElement('tr');
                                // Create cell for child name
                                const childNameCell = document.createElement('td');
                                const childNameaCell = document.createElement('a');
                                childNameaCell.textContent = responseValue[j].child_name;
                               
                                if(val == 'ACH Recurring payments form'){
                                    childNameaCell.href = `./forms/authorization_form.html?id=${responseValue[j].child_id}`;
                                }else{
                                    childNameaCell.href = `form.html?id=${responseValue[j].child_id}`;
                                }
                                childNameCell.appendChild(childNameaCell);
                                row.appendChild(childNameaCell);
                                
                    
                                // Create cell for parent name
                                const parentNameCell = document.createElement('td');
                                parentNameCell.textContent = responseValue[j].parent_name;
                                row.appendChild(parentNameCell);
        
                                const applicationStatusCell = document.createElement('td');
                                applicationStatusCell.textContent = responseValue[j].admission_form_status;
                                row.appendChild(applicationStatusCell);

                                const enrollmentStatusCell = document.createElement('td');
                                enrollmentStatusCell.textContent = response1[j].form_status;
                                row.appendChild(enrollmentStatusCell);
        
                                // Apply styles based on enrollment status
                                if (response1[j].form_status === "Completed") {
                                    enrollmentStatusCell.style.color = 'green';
                                    enrollmentStatusCell.style.fontWeight = 'bold';
                                } else if (response1[j].form_status === "Incomplete") {
                                    enrollmentStatusCell.style.color = 'red';
                                    enrollmentStatusCell.style.fontWeight = 'bold';
                                } else {
                                    enrollmentStatusCell.style.color = '#FFCC00';
                                    enrollmentStatusCell.style.fontWeight = 'bold';
                                }
                    
                                // Append the row to the table body
                                tableBody.appendChild(row);
                            }
                        // }
                    }
                }
            });
        }
    });

}
function formNameDetails() {
    $.ajax({
        url: ` https://6flxkkqvr4.execute-api.us-west-2.amazonaws.com/dev/goddard_all_form/all/forms?status=true`,
        type: 'get',
        success: function (response) {
            if (Array.isArray(response) && response.length > 0) {
                let optionsData = '';
                document.querySelector('[name="form_name"]').innerHTML = '';
                for (let i = 0; i < response.length; i++) {
                    optionsData += '<option value="' + response[i].form_name + '" onchange="formdetails(this.value)">' + response[i].form_name
                                    + '</option>';
                    document.querySelector('[name="form_name"]').innerHTML =
                        optionsData;
                }
            }
        }
    });
}


document.addEventListener("DOMContentLoaded", function () {
    document.body.style.visibility = 'visible';
    let defaultdate = new Date().getFullYear();
    // parentDashBoardDetails(defaultdate);
    applicationStatusYear();
    applicationStatusAllYear();

     // Attach an event listener to the search input
     const form_name = document.querySelector("#form_name");
     // form_name.addEventListener("input", filterTable);
     form_name.addEventListener("click", function () {
        formNameDetails();
     });

    // Function to filter table data based on the search input
    function filterTable() {
        const input = document.querySelector("#searchInput");
        const filter = input.value.toUpperCase();
        const tableBody = document.querySelector("#tableBody");
        const rows = tableBody.getElementsByTagName("tr");
        for (let i = 0; i < rows.length; i++) {
            const cells = rows[i].getElementsByTagName("td");
            let found = false;

            for (let j = 0; j < cells.length; j++) {
                const cell = cells[j];
                if (cell) {
                    const textValue = cell.textContent || cell.innerText;
                    if (textValue.toUpperCase().indexOf(filter) > -1) {
                        found = true;
                        break;
                    }
                }
            }
            if (found) {
                rows[i].style.display = "";
            } else {
                rows[i].style.display = "none";
            }
        }
    }
    // Attach an event listener to the search input
    const searchInput = document.querySelector("#searchInput");
    // searchInput.addEventListener("input", filterTable);
    searchInput.addEventListener("input", function () {
        console.log("Search input changed."); // Add this line for debugging
        filterTable();
    });
  

    // //for pagination code
    // // Number of rows to display per page
    // const rowsPerPage = 4;
    // let currentPage = 1;
    
    // // Function to update the table based on the current page
    // function updateTable() {
    //     const tableRows = document.querySelectorAll("#tableBody tr");
    //     const startIndex = (currentPage - 1) * rowsPerPage;
    //     const endIndex = currentPage * rowsPerPage;
    
    //     tableRows.forEach((row, index) => {
    //         if (index >= startIndex && index < endIndex) {
    //             row.style.display = "";
    //         } else {
    //             row.style.display = "none";
    //         }
    //     });
    
    //     // Update the pagination buttons
    //     updatePaginationButtons();
    // };
    
    // // Function to update the pagination buttons
    // function updatePaginationButtons() {
    //     const totalPages = Math.ceil(document.querySelectorAll("#tableBody tr").length / rowsPerPage);
    //     const prevPageButton = document.getElementById("prevPage");
    //     const nextPageButton = document.getElementById("nextPage");
    
    //     prevPageButton.classList.toggle("disabled", currentPage === 1);
    //     nextPageButton.classList.toggle("disabled", currentPage === totalPages);
    // }
    
    // // Event listener for previous page button
    // document.getElementById("prevPage").addEventListener("click", () => {
    //     if (currentPage > 1) {
    //         currentPage--;
    //         updateTable();
    //     }
    // });
    
    // // Event listener for next page button
    // document.getElementById("nextPage").addEventListener("click", () => {
    //     const totalPages = Math.ceil(document.querySelectorAll("#tableBody tr").length / rowsPerPage);
    //     if (currentPage < totalPages) {
    //         currentPage++;
    //         updateTable();
    //     }
    // });
    
    // // Initial table setup and update
    // window.addEventListener("load", () => {
    //     hideRowsInitially();
    //     updateTable();
    // });
    
    // // Function to hide rows that should not be displayed on the first page
    // function hideRowsInitially() {
    //     const tableRows = document.querySelectorAll("#tableBody tr");
    //     tableRows.forEach((row, index) => {
    //         if (index >= rowsPerPage) {
    //             row.style.display = "none";
    //         }
    //     });   
    // }
    

    
});

