import {signOut} from "./authenticationVerify.js"

// Signout button event listener
document.getElementById('btn-signout').addEventListener('click', signOut);

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
searchInput.addEventListener("input", filterTable);

// Function to get unique enrollment form status values
 function getUniqueEnrollmentStatusValues() {
    const enrollmentStatusCells = document.querySelectorAll("[name='enrollment_form_status']");
    const uniqueValues = new Set();

    enrollmentStatusCells.forEach((cell) => {
        uniqueValues.add(cell.textContent.trim());
    });

    return Array.from(uniqueValues);
}

// Populate the enrollment status dropdown with unique values
const enrollmentStatusDropdown = document.querySelector("#enrollmentStatus");
const uniqueStatusValues = getUniqueEnrollmentStatusValues();

uniqueStatusValues.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    enrollmentStatusDropdown.appendChild(option);
});
function filterTableByEnrollmentStatus() {
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