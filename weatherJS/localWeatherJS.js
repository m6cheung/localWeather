//Problem: The current locations weather and conditions don't showHelp
//Solution: Use apis to show the current city's weather and conditions
//weather api provided by openweathermap.com
//http://api.openweathermap.org/data/2.5/find?lat=??.5&lon=??.5&cnt=10
//apiKey for open weather map= d47c3211bcb0dedbdf36823d7f654f0d
//apiKey for flickr = c6ec88eeaa75e58db13bde4a42eb2cef
//geolcation from ip-api.com

//Get the DOM elements that I will need to manipulate
var data = {
	location: document.querySelector("#location"),
	temperature: document.querySelector("#temp"),
	status: document.querySelector("#status"),
	wind: document.querySelector("#wind"),
	unitCoversionTemperature: 0,
	units: "°C"
};

//Create a function to switch between C and F
var switchUnits = function() {
  if(data.units === " °C") {
    data.unitConversionTemperature = (data.unitConversionTemperature * (9/5) + 32).toFixed(2);
    data.units = " °F";
  } else {
    data.unitConversionTemperature = ((data.unitConversionTemperature - 32) * (5/9)).toFixed(2);
    data.units = " °C";
  }
  data.temperature.innerText = data.unitConversionTemperature + data.units;
}

var tempButton = document.querySelector(".temp-holder");
tempButton.addEventListener("click", switchUnits);

var findLocation = function() {
	if(window.XMLHttpRequest) {
    var xhr1 = new XMLHttpRequest();
    
    xhr1.addEventListener("load", function() {
      var response1 = JSON.parse(xhr1.responseText);
      console.log(response1);
      
      var lat = response1.lat;
      var lon = response1.lon;

      var request = $.ajax({
        url:"http://api.openweathermap.org/data/2.5/find?lat=" + lat + "&lon=" + lon + "&cnt=10&units=metric&APPID=d47c3211bcb0dedbdf36823d7f654f0d",
        success: function() {
          var response = JSON.parse(request.responseText);
          console.log(response);
          var openCity = response.list[0].name;
          var openTemp = response.list[0].main.temp.toFixed(2);
          var openWind = response.list[0].wind.speed;
          var openStatus = response.list[0].weather[0].main;
          loadBG(lat, lon, openStatus);
          data.unitConversionTemperature = openTemp;
          data.wind.innerHTML = "<p style='font-size:15px; color: brown'>&nbspWind Speed:&nbsp</p>" + openWind + " m/s";
          data.status.innerHTML = "<p style='font-size:15px; color: brown'>&nbspCurrent Conditions:&nbsp</p>" + openStatus;
          data.temperature.innerHTML = openTemp + data.units + "<p style='font-size: 8px'>Click to change units</p>";
          data.location.innerHTML = openCity;
          function loadBG(lat, lon, tag) {
          var scriptEl = document.createElement("script");
          scriptEl.src = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=c6ec88eeaa75e58db13bde4a42eb2cef&lat=" + lat + "&lon=" + lon + "&accuracy=1&tags=" + tag + "&sort=relevance&extras=url_l&format=json";
          document.getElementsByTagName("head")[0].appendChild(scriptEl);
        }
        },
        error: function() {
          alert("There was an error fetching request.");
        }
      });
      
          }, false);
          xhr1.open("GET", "http://ip-api.com/json");
          xhr1.send();
        } else {
          alert("cannot fetch request");
        }
}

function jsonFlickrApi(rsp) {
    console.log(rsp);
    if(rsp.photos.pages > 0) {
      var photo = rsp.photos.photo[0];
      document.querySelector("body").style.backgroundImage = "url('" + photo.url_l + "')";
    } else {
      document.querySelector("body").style.backgroundImage = "url('https://static.pexels.com/photos/1998/sea-landscape-mountains-nature.jpg')";
    }
  }
findLocation();