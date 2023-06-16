$(document).ready(function enrollmentForm() {
    $.ajax({
        url: 'https://f64ff4v9wh.execute-api.ap-south-1.amazonaws.com/godd/enrollment/fetch/1',
        type: 'get',
            success: function(response){
                console.log(response)
                if(typeof response.point_one !='undefined'){
                    document.querySelector('[name="apiResponsep1"]').innerHTML = response.point_one;
                    document.querySelector('[name="apiResponsep2"]').innerHTML = response.point_two;
                    document.querySelector('[name="apiResponsep3"]').innerHTML = response.point_three;
                    document.querySelector('[name="apiResponsep4"]').innerHTML = response.point_four;
                    document.querySelector('[name="apiResponsep5"]').innerHTML = response.point_five;
                    document.querySelector('[name="apiResponsep6"]').innerHTML = response.point_six;
                    document.querySelector('[name="apiResponsep7"]').innerHTML = response.point_seven;
                    document.querySelector('[name="apiResponsep8"]').innerHTML = response.point_eight;
                    document.querySelector('[name="apiResponsep9"]').innerHTML = response.point_nine;
                    document.querySelector('[name="apiResponsep10"]').innerHTML = response.point_ten;
                    document.querySelector('[name="apiResponsep11"]').innerHTML = response.point_eleven;
                    document.querySelector('[name="apiResponsep12"]').innerHTML = response.point_twelve;
                    document.querySelector('[name="apiResponsep13"]').innerHTML = response.point_thirteen;
                    document.querySelector('[name="apiResponsep14"]').innerHTML = response.point_fourteen;
        }}
    })

    $.ajax({
        url: 'https://f64ff4v9wh.execute-api.ap-south-1.amazonaws.com/godd/enrollment/fetch/1',
        type: 'get',
        success: function(response){
            document.querySelector('[name="heading"]').innerHTML = response.title
        }
    })
  })

  