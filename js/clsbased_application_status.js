$(document).ready(function () {

    // Avoid DataTable error popup messages
    $.fn.dataTable.ext.errMode = 'none';

    // Fetch classroom options for dropdown
    let classroomOptions = [];
    $.ajax({
        url: 'https://ijz2b76zn8.execute-api.ap-south-1.amazonaws.com/test/class_details/getall',
        method: 'GET',
        async: false, //  options are loaded before datatable initialization
        success: function(data) {
            classroomOptions = data;
        }
    });

    // function for create dropdown options
    function getClassroomDropdown(selectedClassName, childId) {
        let dropdown = `<div class="dropdown-container"><select class="classroom-dropdown" data-child-id="${childId}">`;
        classroomOptions.forEach(option => {
            const selected = option.class_name === selectedClassName ? 'selected' : '';
            dropdown += `<option value="${option.class_id}" ${selected}>${option.class_name}</option>`;
        });
        dropdown += `</select></div>`;
        return dropdown;
    }
    function getClassroomValue(value){
        let selectedValue = `${value}`;
        return selectedValue;
    }

    // function to handle dropdown change
    function toChangeClassName(class_name_value, child_id_value) {
        const updateObject = {
            class_id: class_name_value
        };
        const json = JSON.stringify(updateObject);
        console.log(json);
        var msg = confirm("Are you sure?"); 
        //it check the user confirmation if yes or no       
        if (msg == true) { 
            let xhr = new XMLHttpRequest();
            xhr.onload = () => {
                // console.log(xhr)
                if (xhr.status === 200) {
                    $(".success-msg").show();
                    
                } else {
                    $(".error-msg").show();
                }
            };
            xhr.open("PUT", `https://ijz2b76zn8.execute-api.ap-south-1.amazonaws.com/test/child_info/update_class/${child_id_value}`);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(json);
        }else{
            window.location.reload();
        }
    }

    // Initialize DataTable
    // function initializeDataTable(url) {
    //     $('#example').DataTable({
    //         scrollX: true,
    //         Info: false,
    //         dom: 'Qlfrtip',
    //         lengthChange: false,
    //         ajax: {
    //             url: url,
    //             dataSrc: '',
    //         },
    //         columns: [
    //             { 
    //                 data: 'child_name',
    //                 render: function (data, type, full, meta) {
    //                     let url = `${window.location.origin}/goddard-frontend-dev/parent_dashboard.html?id=${full.parent_email}`;
    //                     return `<a href="${url}">${full.child_name}</a>`;
    //                 },
    //             },
    //             { 
    //                 data: 'child_class_name', // Use child_class_name to match the dropdown option
    //                 render: function (data, type, full, meta) {
    //                     return getClassroomDropdown(full.child_class_name, full.child_id); // Pass the class name for default selection
    //                 },
    //             },
    //             { data: 'parent_email' },
    //             { data: 'parent_two_email' },
    //             { data: 'form_status' },
    //             { 
    //                 data: 'edit',
    //                 render: function (data, type, full, meta) {
    //                     return `<img src="https://cdn-icons-png.flaticon.com/512/1345/1345874.png" id="deletebutton" name="deletebutton" height="20px;" style="text-align:right !important;cursor: pointer !important;" onclick="deletedata(${full.child_id}, '${full.parent_email}');">`;
    //                 },
    //             },
    //         ],
    //         pageLength: 25,
    //     });

    //     // Event delegation for dynamically created dropdown options
    //     $(document).on('change', '.classroom-dropdown', function() {
    //         const selectedClassName = $(this).val();
    //         const childId = $(this).data('child-id');
    //         toChangeClassName(selectedClassName, childId);
    //     });
    // }

    let classID = window.location.search.slice(4);

    function initializeDataTable(url) {
        $('#example').DataTable({
            scrollX: true,
            info: false,
            lengthChange: false,
            scrollCollapse: true,
            scrollY: '500px',
            ajax: {
                url: url,
                dataSrc: '',
            },
            columns: [
                { 
                    data: 'child_name',
                    render: function (data, type, full, meta) {
                        const linkDisabled = full.primary_email == null ? 'pe-none text-dark' : 'pe-auto';
                        let url = `${window.location.origin}/goddard-frontend-dev/parent_dashboard.html?id=${full.primary_email}`;
                        return `<a href="${url}" class="${linkDisabled}">${full.child_first_name +" "+ full.child_last_name}</a>`;
                    },
                },
                { 
                    data: 'child_class_name',
                    render: function (data, type, full, meta) {
                        return getClassroomDropdown(full.class_name, full.child_id);
                    },
                },
                { data: 'primary_email' },
                { data: 'additional_parent_email' },
                { data: 'form_status' },
                { 
                    data: 'edit',
                    render: function (data, type, full, meta) {
                        return `<a class="btn btn-primary text-white text-decoration-none" href="mailto:${full.primary_email}?cc=${full.additional_parent_email}">Send Email</a>`;
                        // return `<img src="https://cdn-icons-png.flaticon.com/512/1345/1345874.png" id="deletebutton" name="deletebutton" height="20px;" style="text-align:right !important;cursor: pointer !important;" onclick="deletedata(${full.child_id}, '${full.parent_email}');">`;
                    },
                },
            ],
            pageLength: 250,
            
            
        });

        // Event delegation for dynamically created dropdown options
        $(document).on('change', '.classroom-dropdown', function() {
            const selectedClassName = $(this).val();
            const childId = $(this).data('child-id');
            toChangeClassName(selectedClassName, childId);
        });
        
        // var table = new DataTable('#example');
        //   // Search in the 'Schedule' column (column index 1) based on extra search box
        //   document.getElementById('clsroomSearch').addEventListener('change', function() {
        //     table.column(1).search(this.value).draw(); // Column index 1 refers to 'Schedule'
        // });
    }

    // Classroom based details
    if(classID != ""){
         // Initialize a new DataTable with the updated URL
         initializeDataTable(`https://ijz2b76zn8.execute-api.ap-south-1.amazonaws.com/test/class_based_all_child_details/${classID}`);
    } 

});
