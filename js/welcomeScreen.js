function getAllInfo(callback) {
    const logged_in_email = localStorage.getItem('logged_in_email')
    const url = 'https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/admission/fetch/email?email='
    console.log(url + logged_in_email)
    $.ajax({
               url: url + logged_in_email,
               type: 'get',
               success: function (response) {
                   console.log(response)
                   localStorage.clear()
                   if(response && response.length > 0) {                
                        localStorage.setItem('parent_name', response[0].parent_name)
                        localStorage.setItem('child_name', response[0].child_full_name)
                   }
                   if (typeof callback === 'function') {
                       callback();
                   }
               }
           })

    // $.ajax({
    //            url: 'https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/parent/fetch/{PAT01}',
    //            type: 'get',
    //            success: function (response) {
    //                console.log(response)
    //            }
    //        })
}

function welcomeText() {
    const parentName = localStorage.getItem('parent_name');
    if (parentName !== 'undefined' && parentName !== null) {
        document.getElementById('welcomeText').innerHTML = 'Welcome ' + parentName;
        document.getElementById('childname').innerHTML = localStorage.getItem('child_name');
        additionalHtmlContainer.style.display = 'block';
    } else {
        document.getElementById('welcomeText').innerHTML = 'Parent not found';
        window.alert("Parent Not found")
        window.history.back();
    }
}

$(document).ready(function () {
    getAllInfo(function () {
        welcomeText();
    });
});