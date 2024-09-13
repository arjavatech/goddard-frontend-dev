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
        // console.log(selectedClassName,childId);
        // return false;
        let dropdown = `<div class="dropdown-container"><select class="classroom-dropdown" data-child-id="${childId}">`;
        classroomOptions.forEach(option => {
            const selected = option.class_name === selectedClassName ? 'selected' : '';
            dropdown += `<option value="${option.class_id}" ${selected}>${option.class_name}</option>`;
        });
        dropdown += '</select></div>';
        return dropdown;
    }
    

    // function to handle dropdown change
    function toChangeClassName(class_name_value, child_id_value) {
        const updateObject = {
            child_id: child_id_value,
            class_name: class_name_value
        };
        const json = JSON.stringify(updateObject);
        console.log(json);
        var msg = confirm("Are you sure?"); 
        //it check the user confirmation if yes or no       
        if (msg == true) { 
            let xhr = new XMLHttpRequest();
            xhr.onload = () => {
                if (xhr.status === 200) {
                    $(".success-msg").show();
                    setTimeout(function(){ 
                        $(".success-msg").hide(); 
                        window.location.reload();
                    }, 3000);
                } else {
                    $(".error-msg").show();
                    setTimeout(function(){ 
                        $(".error-msg").hide(); 
                    }, 3000);
                    alert("Wrong message");
                }
            };
            xhr.open("PUT", `https://ijz2b76zn8.execute-api.ap-south-1.amazonaws.com/test/admission_form/update/${child_id_value}`);
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

    function initializeDataTable(url) {
        $('#example').DataTable({
            scrollX: true,
            info: false,
            dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'excelHtml5',
                    text: 'Export to Excel',
                    customize: function (xlsx) {
                        var sheet = xlsx.xl.worksheets['sheet1.xml'];
                        var rowIndex = 2; // Excel rows are 1-based
                        $('#example').find('tbody tr').each(function() {
                            var childId = $(this).find('.classroom-dropdown').data('child-id');
                            var selectedClassName = $(this).find('.classroom-dropdown').find('option:selected').text();
                            // Update the cell in the Excel sheet
                            $('row:nth-child(' + (rowIndex + 1) + ') c[r^="B"] t', sheet).text(selectedClassName);
                            rowIndex++;
                        });
                    }
                }
            ],
            lengthChange: false,
            ajax: {
                url: url,
                dataSrc: '',
            },
            columns: [
                { 
                    data: 'child_name',
                    render: function (data, type, full, meta) {
                        let url = `${window.location.origin}/goddard-frontend-dev/parent_dashboard.html?id=${full.parent_email}`;
                        return `<a href="${url}">${full.child_name}</a>`;
                    },
                },
                { 
                    data: 'child_class_name',
                    render: function (data, type, full, meta) {
                        return getClassroomDropdown(full.class_name, full.child_id);
                    },
                },
                { data: 'parent_email' },
                { data: 'parent_two_email' },
                { data: 'final_form_status' },
                { 
                    data: 'edit',
                    render: function (data, type, full, meta) {
                        return `<img src="https://cdn-icons-png.flaticon.com/512/1345/1345874.png" id="deletebutton" name="deletebutton" height="20px;" style="text-align:right !important;cursor: pointer !important;" onclick="deletedata(${full.child_id}, '${full.parent_email}');">`;
                    },
                },
            ],
            pageLength: 10,
            
            
        });

        // Event delegation for dynamically created dropdown options
        $(document).on('change', '.classroom-dropdown', function() {
            const selectedClassName = $(this).val();
            const childId = $(this).data('child-id');
            toChangeClassName(selectedClassName, childId);
        });
    }
    

    // Initialize DataTable with default URL
    initializeDataTable('https://ijz2b76zn8.execute-api.ap-south-1.amazonaws.com/test/admission_child_personal/all_child_status');

    // Event listener for form_name dropdown
    $('#form_name').on('change', function() {
        let form_name = $(this).val();
        if (form_name) {
            // Clear and destroy the existing DataTable
            let table = $('#example').DataTable();
            table.clear().destroy();

            // Initialize a new DataTable with the updated URL
            initializeDataTable(`https://jvirbzj4p1.execute-api.us-west-2.amazonaws.com/goddard_test/admission_child_personal/form_status?formName=${form_name}`);
        }
    });

    // Preload the form_name dropdown options
    $('#form_name').on('focus', function() {
        $.ajax({
            url: 'https://jvirbzj4p1.execute-api.us-west-2.amazonaws.com/goddard_test/goddard_all_form/all_active_forms',
            type: 'get',
            dataType: 'json',
            success: function(response) {
                let form_name_value = '';
                if(response !== "") {
                    response.forEach(item => {
                        if(item.main_topic && item.main_topic !== undefined) {
                            form_name_value += `<option value="${item.main_topic}">${item.main_topic}</option>`;
                        }
                    });
                }
                $('#form_name').html(form_name_value);
            }
        });
    });

});
function ExportToExcel(type, fn, dl) {
    var elt = document.getElementById('example');
    var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });
    return dl ?
    XLSX.write(wb, { bookType: type, bookSST: true, type: 'base64' }) :
    XLSX.writeFile(wb, fn || ('MySheetName.' + (type || 'xlsx')));
}
//this function is used to delete course fields details
function deletedata(id,email) {
    var delete_object={child_id : id,primary_parent_email : email};
    const json=JSON.stringify(delete_object);
    console.log(json)
    var msg = confirm("Are you sure?"); 
    //it check the user confirmation if yes or no       
    if (msg == true) { 
        //  sending post request to the server
        let xhr = new XMLHttpRequest();
        xhr.onload = () => {
            const data = xhr.responseText;
            if (xhr.status == 200) {
                // var confirmationRes = window.confirm(data);
                if (data) {
                    // window.location.href = "../reg_form/sponsorreport.html";
                    window.location.reload();
                } else {
                    window.location.reload();
                }
            }
        };

        xhr.open("DELETE", 'https://jvirbzj4p1.execute-api.us-west-2.amazonaws.com/goddard_test/admission_child_personal/remove');
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(json);
    }
};