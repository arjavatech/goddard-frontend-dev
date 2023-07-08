function getAllInfo(callback) {
    const logged_in_email = localStorage.getItem('logged_in_email')
    const url = 'https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/admission/fetch/email?email='
    console.log(url + logged_in_email)
    $.ajax({
               url: url + logged_in_email,
               type: 'get',
               success: function (response) {
                   console.log(response.parent_name)
                   localStorage.setItem('parent_name', response.parent_name)
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
        additionalHtmlContainer.style.display = 'block';
    } else {
        document.getElementById('welcomeText').innerHTML = 'No parent found';
        additionalHtmlContainer.style.display = 'none';
    }
}

$(document).ready(function () {
    getAllInfo(function () {
        welcomeText();
    });
});