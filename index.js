var express = require("express");
var app = express();

// Cors
const cors = require('cors');
app.use(cors());

// Open Weather Map API
const OpenWeatherMapHelper = require("openweathermap-node");
const helper = new OpenWeatherMapHelper(
  {
      APPID: '4757e70d996ee03dbfbec7e658b28617',
      units: "metric"
  }
);

// Logging configuration
const SimpleNodeLogger = require('simple-node-logger'),
    opts = {
        logFilePath:'express-weather-api.log',
        timestampFormat:'YYYY-MM-DD HH:mm:ss.SSS'
    },
    log = SimpleNodeLogger.createSimpleLogger(opts);
log.setLevel('debug');

// Cache configuration
const NodeCache = require("node-cache");
const weatherCache = new NodeCache();

// API Methods
app.get("/:city", function(request, response){
  var currentDate = new Date();
  var city = request.params.city;
  log.debug("Getting data from OpenWeather for: " + city);

  dayWeatherKey = city + currentDate.getDate() + currentDate.getMonth() + currentDate.getFullYear();
  log.debug("Reading cache for: " + dayWeatherKey);
  currentWeather = weatherCache.get(dayWeatherKey);

  if(currentWeather == undefined) {
    log.debug("Cache miss");
    helper.getCurrentWeatherByCityName(city, (err, currentWeather) => {
      if(err){
        log.error(err);
        response.send("Opss");
      }
      else{
        log.debug("Data sucessfully retrieved");
        weatherCache.set(dayWeatherKey, currentWeather, 60 * 10); //10 minutes
        response.send(currentWeather);
        log.debug("Data sucessfully retrieved");
      }
    });
  } else {
    log.debug("Cache hit");
    response.send(currentWeather);
  }
})

var server = app.listen(3000, function() {
  console.log("Server is running at http://localhost:" + server.address().port);
  log.info("Server is running at http://localhost:" + server.address().port);
})