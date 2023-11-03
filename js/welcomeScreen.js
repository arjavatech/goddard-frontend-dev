import {isAuthenticated} from "./authenticationVerify.js";

let child_response = null;

function clearLocalStorageExcept(keysToKeep) {
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key) && !keysToKeep.includes(key)) {
            localStorage.removeItem(key);
        }
    }
}

function checkParentAuthentication(callback) {
    console.log('parent login check');
    const logged_in_email = localStorage.getItem('logged_in_email');
    console.log(logged_in_email);
    const url = 'https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/admission_child_personal/parent_email?email='
    console.log(url + logged_in_email)
    $.ajax({
               url: url + logged_in_email,
               type: 'get',
               success: function (response) {
                console.log(response);
                   let keysToKeep = ['logged_in_email'];
                   clearLocalStorageExcept(keysToKeep);
                   // localStorage.clear()
                   if (response && response.length > 0) {
                       localStorage.setItem('parent_name', response[0].parent_name)
                    //    localStorage.setItem('parent_id', response[0].id)
                   }
                   if (typeof callback === 'function') {
                       callback();
                   }
               }
           });
}

function getAllInfo(callback) {
    const logged_in_email = localStorage.getItem('logged_in_email')
    // const parent_id = localStorage.getItem('parent_id');
    const url = 'https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/admission_child_personal/parent_email?email='
    console.log(url + logged_in_email)
    $.ajax({
        url: url + logged_in_email,
        type: 'get',
        success: function (response) {
            console.log(response);
            // localStorage.clear()
            if (response && response.length > 0) {
                // Iterate through all the child and store the response
                child_response = response;
                console.log(child_response);
                console.log(response.length.toString());
                localStorage.setItem('number_of_children', response.length.toString());
            }
            if (typeof callback === 'function') {
                callback();
            } 
        }
    })
}

function responseToAuthenticationCheck() {
    const parentName = localStorage.getItem('logged_in_email');
    console.log(parentName);
    if (parentName !== 'undefined' && parentName !== null) {
        console.log('if');
        document.body.style.visibility = 'visible';
    } else {
        console.log('else');
        document.getElementById('welcomeText').innerHTML = 'Parent not found';
        window.alert("Parent Not found")
        window.history.back();
    }
}

function loadDynamicCards() {
    let responseSize = localStorage.getItem('number_of_children');
    let parentContainer = document.getElementById('dynamicChildCards');
    // Loop through the response size and create the child divs
    for (let i = 0; i < responseSize; i++) {
        let on_process = child_response[i].on_process;

        // Create the elements
        let div = document.createElement('div');
        div.classList.add('col-2', 'm-3', 'mt-4');

        let anchor = document.createElement('a');
        anchor.classList.add('text-decoration-none');

        let card = document.createElement('div');

        if (on_process === true) {
            // Card is fulfilled
            anchor.href =  `../forms.html?${child_response[i].child_id}`;
            card.classList.add('card', 'dashboard_card_style_on_process');
        } else {
            // Need to be fulfilled
            anchor.href = '../parent/parent_dashboard.html';
            card.classList.add('card', 'dashboard_card_style1');
        }

        let cardBody = document.createElement('div');
        cardBody.classList.add('card-body', 'pt-4');

        let childName = document.createElement('h5');
        childName.id = child_response[i].child_id;
        childName.classList.add('text-center', 'dashboard_card_text', 'pt-3', 'h4');

        // Set the child name from localStorage
        childName.innerHTML = child_response[i].child_full_name;

        // Add event listener to the anchor tag
        anchor.addEventListener('click', function () {
            // Retrieve the child's name and ID
            const selectedChildName = child_response[i].child_full_name;
            const selectedChildId = child_response[i].child_id;

            // Store the child's name and ID in local storage
            localStorage.setItem('child_name', selectedChildName);
            localStorage.setItem('child_id', selectedChildId);
        });

        // Append the elements to their respective parent elements
        cardBody.appendChild(childName);
        card.appendChild(cardBody);
        anchor.appendChild(card);
        div.appendChild(anchor);

        // Append the child div to the parent container
        parentContainer.appendChild(div);
    }
}

function welcomeText() {
    const parentName = localStorage.getItem('logged_in_email');
    // console.log(parentName)
    document.getElementById('welcomeText').innerHTML = 'Welcome ' + parentName;
    loadDynamicCards();
    additionalHtmlContainer.style.display = 'block';
}

$(document).ready(function () {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
    } else {
        // Checks the parent info table to see if parent entry is present
        checkParentAuthentication(function () {
            responseToAuthenticationCheck();
            // Checks the admission info table
            getAllInfo(function () {
                welcomeText();
            });
        });
    }
});