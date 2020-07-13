const form = document.querySelector(".form-section form");
const input = document.querySelector(".form-section input");
const msg = document.querySelector(".form-section .msg");
const graph_cities = document.querySelector(".updatable-section .container-graph .cities");
const table_cities_body = document.querySelector(".updatable-section .container-table .cities tbody");
var chart;
localStorage.clear();

document.querySelector(".form-section form").addEventListener("submit", e => {
  e.preventDefault();
  let inputVal = input.value;

  //check if city is already selected
  if (localStorage.length > 0) {
    if (localStorage.getItem(inputVal.toLowerCase()) !== null) {
      msg.textContent = `You already selected ${inputVal}`;
      form.reset();
      input.focus();
      return;
    }
  }

  //node api url
  const url = `http://localhost:3000/${inputVal}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      localStorage.setItem(data.name.toLowerCase(), JSON.stringify(data));

      const { main, name, sys } = data;

/*       const li = document.createElement("li");
      li.classList.add("city");
      li.innerHTML = `
        <span class="city-name" data-name="${name}">${name} / ${Math.round(main.temp)}</span>
      `;
      graph_cities.appendChild(li); */

      const row = table_cities_body.insertRow(0);
      const cellName = row.insertCell(0);
      const cellTemp = row.insertCell(1);
      const cellDayStart = row.insertCell(2);
      const cellDayEnd = row.insertCell(3);
      cellName.innerHTML = name;
      cellTemp.innerHTML = main.temp;
      let sunriseDate = new Date(sys.sunrise * 1000);
      //let sunriseDate_formatted = sunriseDate.getFullYear() + "-" + (sunriseDate.getMonth() + 1) + "-" + sunriseDate.getDate() + " " + sunriseDate.getHours() + ":" + sunriseDate.getMinutes() + ":" + sunriseDate.getSeconds() + ":" + sunriseDate.get();
      cellDayStart.innerHTML = sunriseDate;
      let sunsetDate = new Date(sys.sunset * 1000);
      //let sunsetDate_formatted = sunsetDate.getFullYear() + "-" + (sunsetDate.getMonth() + 1) + "-" + sunsetDate.getDate() + " " + sunsetDate.getHours() + ":" + sunsetDate.getMinutes() + ":" + sunsetDate.getSeconds();
      cellDayEnd.innerHTML = sunsetDate;

      //cellDayEnd1.innerHTML = new Date(sys.sunset * 1000);
      var length = chart.options.data[0].dataPoints.length;
	    chart.options.data[0].dataPoints.push({ y: main.temp, label: name});
	    chart.render();
      //$('#keywords').tablesorter();

      $(".updatable-section .container-table .cities").trigger('update');
    })
    .catch(() => {
      msg.textContent = "Please search for a valid city";
    });

  msg.textContent = "";
  form.reset();
  input.focus();
});

$(function(){
  $(".updatable-section .container-table .cities").tablesorter();

  chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,

    title:{
    },
    axisX:{
      interval: 1
    },
    axisY2:{
    },
    data: [{
      type: "bar",
      name: "companies",
      axisYType: "secondary",
      color: "black",
      dataPoints: [
      ]
    }]
  });
  chart.render();

});