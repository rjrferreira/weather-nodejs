const form = document.querySelector(".form-section form");
const input = document.querySelector(".form-section input");
const city_name = document.querySelector(".form-section .city-name");
const graph_cities = document.querySelector(".updatable-section .container-graph .cities");
const table_cities_body = document.querySelector(".updatable-section .container-table .cities tbody");
let chart;
sessionStorage.clear();

// prevent unnecessary calls
document.querySelector(".form-section form").addEventListener("submit", e => {
  e.preventDefault();
  let inputVal = input.value;

  if(inputVal.toLowerCase().length === 0){
    city_name.textContent = "Please submit a City name";
    form.reset();
    input.focus();
    return;
  } else {
    // check if city is already added
    if (sessionStorage.length > 0) {
      if (sessionStorage.getItem(inputVal.toLowerCase()) !== null) {
        city_name.textContent = `You already selected ${inputVal}`;
        form.reset();
        input.focus();
        return;
      }
    }
  }

  // node api url
  const url = `http://localhost:3000/${inputVal}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {

      if(data.status === "404") {
        city_name.textContent = "Please search for a valid city";
      } else {

        // Update sessionStorage with new City
        sessionStorage.setItem(data.name.toLowerCase(), JSON.stringify(data));

        // Get data
        const { main, name, sys } = data;

        // Create new table row
        const row = table_cities_body.insertRow(0);
        const cellName = row.insertCell(0);
        const cellTemp = row.insertCell(1);
        const cellDayStart = row.insertCell(2);
        const cellDayEnd = row.insertCell(3);

        // Fill cells
        cellName.innerHTML = name;
        cellTemp.innerHTML = main.temp;
        cellDayStart.innerHTML = new Date(sys.sunrise * 1000);
        cellDayEnd.innerHTML = new Date(sys.sunset * 1000);

        // Update chart
        chart.options.data[0].dataPoints.push({ y: main.temp, label: name});
        chart.render();

        $(".updatable-section .container-table .cities").trigger('update');
      }
    })
    .catch(error => {
      city_name.textContent = "Invalid response. Please validate if server is online!!!";
    });

  city_name.textContent = "";
  form.reset();
  input.focus();
});

$(function(){
  $(".updatable-section .container-table .cities").tablesorter();

  chart = new CanvasJS.Chart("chart-container", {
    animationEnabled: true,
    theme: "light2",
    title:{
      text: "Weather Info"
    },
    axisY: {
      title: "in celsius"
    },
    data: [{
      type: "column",
      showInLegend: true,
      legendMarkerColor: "grey",
      legendText: "City",
      dataPoints: [

      ]
    }]
  });
  chart.render();

});