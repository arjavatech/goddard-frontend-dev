export function fetchEnrollmentFormBody(callback) {
    $.ajax({
               url: 'https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/enrollment/fetch/1',
               type: 'get',
               success: function(response){
                //    console.log(response)
                   if(typeof response.point_one !='undefined'){
                        let paragraph = document.querySelector('[name="apiResponsep1"]');
                        paragraph.textContent = response.point_one;
                        
                        // Define the target texts and their corresponding textbox IDs
                        let targetTexts = ['effective the', ' day of', 'Inc., and'];
                        let textboxIds = ['point_one_field_one', 'point_one_field_two', 'point_one_field_three'];
                        
                        // Iterate over each target text
                        for (let i = 0; i < targetTexts.length; i++) {
                        let targetText = targetTexts[i];
                        let textboxId = textboxIds[i];
                        
                        // Create a new textbox element
                        let textBox = document.createElement('input');
                        textBox.setAttribute('type', 'text');
                        textBox.setAttribute('id', textboxId);
                        textBox.setAttribute('class', 'form-control');
                        textBox.setAttribute('style', 'border: none; border-bottom: 1px solid black;');

                        // Replace the target text with the textbox in the paragraph
                        paragraph.innerHTML = paragraph.innerHTML.replace(targetText, targetText + textBox.outerHTML);
                        // console.log(paragraph.innerHTML)
                        }
                    //    document.querySelector('[name="apiResponsep1"]').innerHTML = response.point_one;
                       document.querySelector('[name="apiResponsep2"]').innerHTML = response.point_two;
                       document.querySelector('[name="apiResponsep3"]').innerHTML = response.point_three;
                       document.querySelector('[name="apiResponsep4"]').innerHTML = response.point_four;
                       document.querySelector('[name="apiResponsep5"]').innerHTML = response.point_five;
                       document.querySelector('[name="apiResponsep6"]').innerHTML = response.point_six;
                       document.querySelector('[name="apiResponsep7"]').innerHTML = response.point_seven;
                      
                       const para_eight = response.point_eight;
                       const lines = para_eight.split('\n');
                       console.log(lines);

                       // Create variables to store the year and day lines
                       let yearLine = '';
                       let dayLine = '';
                       
                        // Iterate over each line
                        for (const line of lines) {
                            // console.log(line);
                            // If the line starts with a year pattern (YYYY:)
                            if (line.match(/^\d{4}:/)) {
                                // Append the year to the year line
                                yearLine += line.split(':')[0] + '\t';
                                console.log(yearLine);
                                // Append the days to the day line
                                dayLine += line.split(':').slice(1).join(':') + '\t';
                                console.log(dayLine);
                            }
                        }
                       
                       // Combine the lines with a line break
                       const result = `This School is closed on the following days:\n${yearLine.trim()}\n${dayLine.trim()}`;
                       
                       console.log(result);
                        document.querySelector('[name="apiResponsep8"]').innerHTML = result;
                      
                    //    document.querySelector('[name="apiResponsep8"]').innerHTML = response.point_eight;
                       document.querySelector('[name="apiResponsep9"]').innerHTML = response.point_nine;
                       document.querySelector('[name="apiResponsep10"]').innerHTML = response.point_ten;
                       document.querySelector('[name="apiResponsep11"]').innerHTML = response.point_eleven;
                       document.querySelector('[name="apiResponsep12"]').innerHTML = response.point_twelve;
                       document.querySelector('[name="apiResponsep13"]').innerHTML = response.point_thirteen;
                       document.querySelector('[name="apiResponsep14"]').innerHTML = response.point_fourteen;
                       document.querySelector('[name="apiResponsep15"]').innerHTML = response.point_fifteen;
                       document.querySelector('[name="apiResponsep16"]').innerHTML = response.point_sixteen;
                       document.querySelector('[name="apiResponsep17"]').innerHTML = response.point_seventeen;
                       document.querySelector('[name="apiResponsep18"]').innerHTML = response.point_eighteen;
                       document.querySelector('[name="apiResponsep19"]').innerHTML = response.point_eighteen_initial;
                   }
                   if (typeof callback === 'function') {
                       callback();
                   }
               }
           })
}

export function fetchEnrollmentFormTitle(callback) {
    $.ajax({
               url: 'https://y4jyv8n3cj.execute-api.us-west-2.amazonaws.com/goddard_test/enrollment/fetch/1',
               type: 'get',
               success: function(response){
                   document.querySelector('[name="heading"]').innerHTML = response.title
                   if (typeof callback === 'function') {
                       callback();
                   }
               }
           })
}


$(document).ready(function () {
    fetchEnrollmentFormTitle();
    fetchEnrollmentFormBody();
})

  