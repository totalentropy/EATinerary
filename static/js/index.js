// References to index.html form paramaters
const submitBtn = d3.select('#submitButton')
const cityField = d3.select('#myInput')

// When the submit button is clicked
submitBtn.on('click', () => {
  // Prevent refresh
  d3.event.preventDefault();

  // Store the value placed in city
  var city = cityField.property('value').trim();
  console.log(city);

  if (unique_cities.includes(city)) {

    // Store the user's current time and pass it to the server
    var date = new Date();
    var clientTime = {
      day:date.getDay(),
      h:date.getHours(),
      m:date.getMinutes()
    };
    console.log(clientTime);

    // Empty array to store the attributes values in
    var attributes = [];

    // Loop through all the checkboxes
    d3.selectAll('.choice').each(function(d) {

      // Return whether the checkbox is checked or not
      cb = d3.select(this).select('input').property('checked');

      // Select the text of the checkbox
      text = d3.select(this).select('input').property('value');

      attributes.push({name:text, value:cb});
    });

    console.log(attributes);

    // Convert the objects for the server
    clientTime = JSON.stringify(clientTime);
    attributes = JSON.stringify(attributes);

    d3.json('/api/' + city + '/' + clientTime + '/'+attributes)
    .then(function(data) {

      // Check if there were any results found
      if (data.length > 0) {

        // Run the createMap function to create the map found in map.js
        createMap(data);

        // TODO add autoscroll
        
      } else {

        // TODO add logic to pick next closest results

        // Let the user know no values were found
        console.log('Sorry no results were found in that city with those'
                    + 'restrictions :(');

        window.alert('Sorry no results were found in that city with those'
                    + 'restrictions :(');
      }
    });
  } else {
    // Let the user know no values were found
    console.log('Sorry there are no results for that city');
    window.alert('Sorry there are no results for that city :(');
  }
});