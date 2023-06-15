$(document).ready(function() {
    $.ajax({
        url: 'https://f64ff4v9wh.execute-api.ap-south-1.amazonaws.com/godd/enrollment/fetch/1',
        type: 'get',
        success: function(response){
            document.querySelector('[name="heading"]').innerHTML = response.title
        }
    })
    $.ajax({
        url: 'https://f64ff4v9wh.execute-api.ap-south-1.amazonaws.com/godd/enrollment/fetch/1',
        type: 'get',
            success: function(response){
                console.log(response)
                if(typeof response.point_one !='undefined'){
                    document.querySelector('[name="apiResponsep1"]').innerHTML = response.point_one;
                    document.querySelector('[name="apiResponsep2"]').innerHTML = response.point_two;
                    document.querySelector('[name="apiResponsep3"]').innerHTML = response.point_three;
        }}
    })
})

function p1() {

};

const downloadButton = document.getElementById('downloadButton');

// Add a click event listener to the button
downloadButton.addEventListener('click', () => {
    const {jsPDF} = window.jspdf;
    const doc = new jsPDF('p', 'mm', [1500, 1400]);
    let pdfjs = document.querySelector('#wholeDiv');

    doc.html(pdfjs, {
        callback: function (doc) {
            doc.save("output.pdf");
        },
        x: 12,
        y: 12
    });
});