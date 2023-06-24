$(document).ready(function welcomeText() {
    $.ajax({
        url: 'https://f64ff4v9wh.execute-api.ap-south-1.amazonaws.com/godd/parent/fetch/PAT01',
        type: 'get',
        success: function(response){
          console.log('hello')
            document.querySelector('[name="welcomeText"]').innerHTML = "Welcome " + response.parent_name;
      }
    })
  })