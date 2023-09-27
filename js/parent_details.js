'use strict';

function applicationStatusYear(val) {
    localStorage.setItem('form_year_value', val);
    let applicationStatusYear = document.getElementById("applicationStatusYear");
    applicationStatusYear.textContent = val;
    $.ajax({
        url: `https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/parent_invite_info/year_wise?year=${val}`,
        type: 'get',
        success: function (response) {
            console.log(response);
            let responseValue = Object.values(response);
            console.log(responseValue);
            if (Array.isArray(responseValue)) {
                const tableBody = document.getElementById('tableBody');
                tableBody.innerHTML = ''; // Clear existing content
        
                // ...
                for (let i = 0; i < responseValue.length; i++) {
                    const rowData = responseValue[i];

                    // Create a new row for each data set
                    const row = document.createElement('tr');

                    // Create cell for child name
                    const childNameCell = document.createElement('td');
                    childNameCell.textContent = rowData.child_full_name;
                    row.appendChild(childNameCell);

                    // Create cell for parent one name
                    const parentoneNameCell = document.createElement('td');
                    parentoneNameCell.textContent = rowData.parent_name;
                    row.appendChild(parentoneNameCell);

                    // Create cell for parent one email
                    const parentOneEmailCell = document.createElement('td');
                    parentOneEmailCell.textContent = rowData.parent_email;
                    row.appendChild(parentOneEmailCell);

                    // Create cell for parent one email
                    const parentOnemobileCell = document.createElement('td');
                    parentOnemobileCell.textContent = rowData.parent_mobile;
                    row.appendChild(parentOnemobileCell);

                    // Create cell for the invite button
                    // const inviteButtonCell = document.createElement('td');
                    // const inviteButton = document.createElement('button');
                    // inviteButton.setAttribute('type', 'button');
                    // inviteButton.setAttribute('id', 'sendButton');
                    // inviteButton.setAttribute('class', 'invite-button'); // Use class instead of ID
                    // inviteButton.textContent = 'Send';
                    // inviteButtonCell.appendChild(inviteButton);
                    // row.appendChild(inviteButtonCell);

                    // Append the row to the table body
                    tableBody.appendChild(row);
                }
                // ...

            }
        }
    });
}

//to display child's year
function applicationStatusAllYear() {
    const child_id = localStorage.getItem('child_id')
    const url = 'https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/parent_invite_info/all'
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

