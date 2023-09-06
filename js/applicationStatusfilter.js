'use strict';

function applicationStatusYear(val) {
    localStorage.setItem('form_year_value', val);
    let applicationStatusYear = document.getElementById("applicationStatusYear");
    applicationStatusYear.textContent = val;
    $.ajax({
        url: `https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/application_status/result/${val}`,
        type: 'get',
        success: function (response) {
            let responseValue = Object.values(response);
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
                        childNameCell.textContent = rowData[j].child_name;
                        row.appendChild(childNameCell);
            
                        // Create cell for parent name
                        const parentNameCell = document.createElement('td');
                        parentNameCell.textContent = rowData[j].parent_name;
                        row.appendChild(parentNameCell);

                        const applicationStatusCell = document.createElement('td');
                        applicationStatusCell.textContent = rowData[j].application_status;
                        row.appendChild(applicationStatusCell);
            
                        const enrollmentStatusCell = document.createElement('td');
                        enrollmentStatusCell.textContent = rowData[j].enrollment_form_status;
                        row.appendChild(enrollmentStatusCell);
                        // Apply styles based on enrollment status
                        if (rowData[j].enrollment_form_status === "Completed") {
                            enrollmentStatusCell.style.color = 'green';
                            enrollmentStatusCell.style.fontWeight = 'bold';
                        } else if (rowData[j].enrollment_form_status === "Incomplete") {
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
    const url = 'https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/application_status/all'
    // console.log(url + child_id)
    $.ajax({
        url: url,
        type: 'get',
        success: function (response) {
            // console.log(response);
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

    // Function to get unique enrollment form status values
    function getUniqueEnrollmentStatusValues() {
        const enrollmentStatusCells = document.querySelectorAll("[name='enrollment_form_status']");
        const uniqueValues = new Set();

        enrollmentStatusCells.forEach((cell) => {
            uniqueValues.add(cell.textContent.trim());
        });
        console.log(enrollmentStatusCells);

        return Array.from(uniqueValues);
    }

    // Populate the enrollment status dropdown with unique values
    const enrollmentStatusDropdown = document.querySelector("#enrollmentStatus");
    const uniqueStatusValues = getUniqueEnrollmentStatusValues();
    console.log(uniqueStatusValues);

    uniqueStatusValues.forEach((value) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        enrollmentStatusDropdown.appendChild(option);
    });

    enrollmentStatusDropdown.addEventListener("change", filterTableByEnrollmentStatus);
    function filterTableByEnrollmentStatus() {
        console.log('filter checking');
        const selectedStatus = document.querySelector("#enrollmentStatus").value;
        const tableRows = document.querySelectorAll("#tableBody tr");

        tableRows.forEach((row) => {
            const enrollmentStatusCell = row.querySelector("[name='enrollment_form_status']");
            if (enrollmentStatusCell) {
                const status = enrollmentStatusCell.textContent.trim();

                if (selectedStatus === "" || status === selectedStatus) {
                    row.style.display = "";
                } else {
                    row.style.display = "none";
                }
            }
        });
    }

    //for applied pagination code
    // Variables to track pagination
    let currentPage = 1;
    const rowsPerPage = 5; // Adjust as needed

    // Function to update the table with rows for the current page
    function updateTableForPage() {
        const table = document.querySelector("#myTable");
        const tableRows = table.querySelectorAll("tbody tr");
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;

        // Hide all rows
        tableRows.forEach((row) => {
            row.style.display = "none";
        });

        // Display rows for the current page
        for (let i = startIndex; i < endIndex; i++) {
            if (tableRows[i]) {
                tableRows[i].style.display = "";
            }
        }
    }
    // Event listener for the "Previous" button
    const prevPageButton = document.querySelector("#prevPage");
    prevPageButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            updateTableForPage();
        }
    });
    // Event listener for the "Next" button
    const nextPageButton = document.querySelector("#nextPage");
    nextPageButton.addEventListener("click", () => {
        const tableRows = document.querySelectorAll("#myTable tbody tr");
        const totalRows = tableRows.length;
        const totalPages = Math.ceil(totalRows / rowsPerPage);

        if (currentPage < totalPages) {
            currentPage++;
            updateTableForPage();
        }
    });
    // Initial update to display the first page
    updateTableForPage();
});

