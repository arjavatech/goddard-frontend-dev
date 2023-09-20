'use strict';
function enrollmentValueSend(val){
    console.log(val);
    var enrollmentValue={id : val};
    const obj=JSON.stringify(enrollmentValue);
    console.log(obj);
    $.ajax({
        url: "https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/enrollment_data/form_status_level",
        type: "POST",
        contentType: "application/json",
        data: obj,
        success: function (response) {
            console.log(response);
            // window.location.href = "admin_dashboard.html";
            alert("form submitted successfully");
        },
        error: function (xhr, status, error) {
            console.log(error);
            alert("form submit failed");
        }
    });

}
function applicationStatusYear(val) {
    localStorage.setItem('form_year_value', val);
    let applicationStatusYear = document.getElementById("applicationStatusYear");
    applicationStatusYear.textContent = val;
    $.ajax({
        url: `https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/admission/app_status/year_info?year=${val}`,
        type: 'get',
        success: function (response) {
            console.log(response);
            let responseValue = Object.values(response);
            console.log(responseValue);
            if (Array.isArray(responseValue)) {
                const tableBody = document.getElementById('tableBody');
                tableBody.innerHTML = ''; // Clear existing content
        
                for (let i = 0; i < responseValue.length; i++) {
                    const rowData = responseValue[i];
                    for (let j = 0; j <=responseValue.length; j++) {
        
                        // Create a new row for each data set
                        const row = document.createElement('tr');
                        // Create cell for child name
                        const childNameCell = document.createElement('td');
                        childNameCell.textContent = responseValue[j].child_name;
                        row.appendChild(childNameCell);
            
                        // Create cell for parent name
                        const parentNameCell = document.createElement('td');
                        parentNameCell.textContent = responseValue[j].parent_name;
                        row.appendChild(parentNameCell);

                        const applicationStatusCell = document.createElement('td');
                        applicationStatusCell.textContent = responseValue[j].admission_form_status_level;
                        row.appendChild(applicationStatusCell);
            
                        // const enrollmentStatusCell = document.createElement('td');
                        // enrollmentStatusCell.setAttribute('id', 'enrollment_form_status');
                        // enrollmentStatusCell.setAttribute('name', 'enrollment_form_status');
                        // enrollmentStatusCell.textContent = responseValue[j].enrollment_form_status_level;
                        // row.appendChild(enrollmentStatusCell);

                        const enrollmentStatusCell = document.createElement('td');
                        enrollmentStatusCell.setAttribute('id', 'enrollment_form_status');
                        enrollmentStatusCell.setAttribute('name', 'enrollment_form_status');

                        // Create a <select> element
                        const statusSelect = document.createElement('select');
                        statusSelect.style.color = "red";
                        statusSelect.setAttribute('style', 'border: none;');

                        // Create <option> elements for each status option
                        const completedOption = document.createElement('option');
                        completedOption.value = 'Completed';
                        completedOption.textContent = 'Completed';
                        completedOption.style.color = 'green';


                        const reviewingOption = document.createElement('option');
                        reviewingOption.value = 'Reviewing';
                        reviewingOption.textContent = 'Reviewing';
                        reviewingOption.style.color = 'yellow';

                        const incompleteOption = document.createElement('option');
                        incompleteOption.value = 'Incomplete';
                        incompleteOption.textContent = 'Incomplete';
                        incompleteOption.style.color = 'red';

                        // Append the <option> elements to the <select> element
                        statusSelect.appendChild(incompleteOption);
                        statusSelect.appendChild(reviewingOption);
                        statusSelect.appendChild(completedOption);
                        statusSelect.addEventListener('change',function(){
                           enrollmentValueSend(statusSelect.value);
                        });
                       
                        row.appendChild(statusSelect);

                        // Set the default selected option based on responseValue[j].



                        // Apply styles based on enrollment status
                        if (responseValue[j].enrollment_form_status_level === "Completed") {
                            enrollmentStatusCell.style.color = 'green';
                            enrollmentStatusCell.style.fontWeight = 'bold';
                        } else if (responseValue[j].enrollment_form_status_level === "Incomplete") {
                            enrollmentStatusCell.style.color = 'red';
                            enrollmentStatusCell.style.fontWeight = 'bold';
                        } else {
                            enrollmentStatusCell.style.color = '#FFCC00';
                            enrollmentStatusCell.style.fontWeight = 'bold';
                        }
            
                        // Append the row to the table body
                        tableBody.appendChild(row);
                    }
                }
            }
        }
    });
}

//to display child's year
function applicationStatusAllYear() {
    const child_id = localStorage.getItem('child_id')
    const url = 'https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/admission/app_status/info'
    $.ajax({
        url: url,
        type: 'get',
        success: function (response) {
            let yearArray = Object.keys(response);
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


document.addEventListener("DOMContentLoaded", function () {
    document.body.style.visibility = 'visible';
    let defaultdate = new Date().getFullYear();
    // parentDashBoardDetails(defaultdate);
    applicationStatusYear(defaultdate);
    applicationStatusAllYear();

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
  

    //for pagination code
    // Number of rows to display per page
     const rowsPerPage = 5;
     let currentPage = 1;
     
     // Function to update the table based on the current page
     function updateTable() {
         const tableRows = document.querySelectorAll("#tableBody tr");
         const startIndex = (currentPage - 1) * rowsPerPage;
         const endIndex = currentPage * rowsPerPage;
     
         tableRows.forEach((row, index) => {
             if (index >= startIndex && index < endIndex) {
                 row.style.display = "";
             } else {
                 row.style.display = "none";
             }
         });
     
         // Update the pagination buttons
         updatePaginationButtons();
     }
     
     // Function to update the pagination buttons
     function updatePaginationButtons() {
         const tableRows = document.querySelectorAll("#tableBody tr");
         const totalPages = Math.ceil(tableRows.length / rowsPerPage);
     
         const prevPageButton = document.getElementById("prevPage");
         const nextPageButton = document.getElementById("nextPage");
     
         prevPageButton.classList.remove("disabled");
         nextPageButton.classList.remove("disabled");
     
         if (currentPage === 1) {
             prevPageButton.classList.add("disabled");
         }
     
         if (currentPage === totalPages) {
             nextPageButton.classList.add("disabled");
         }
     }
     
     // Event listener for previous page button
     document.getElementById("prevPage").addEventListener("click", () => {
         if (currentPage > 1) {
             currentPage--;
             updateTable();
         }
     });
     
     // Event listener for next page button
     document.getElementById("nextPage").addEventListener("click", () => {
         const tableRows = document.querySelectorAll("#tableBody tr");
         const totalPages = Math.ceil(tableRows.length / rowsPerPage);
     
         if (currentPage < totalPages) {
             currentPage++;
             updateTable();
         }
     });
     
     // Initial table update
     updateTable();
});

