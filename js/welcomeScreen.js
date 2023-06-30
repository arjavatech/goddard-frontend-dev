$(document).ready(function welcomeText() {
    $.ajax({
        url: 'https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/parent/fetch/PAT01',
        type: 'get',
        success: function(response){
          console.log('hello')
            document.querySelector('[name="welcomeText"]').innerHTML = "Welcome " + response.parent_name;
      }
    })
  })