// HTML Elements
var countryInput = document.querySelector("#userLocation");
var btnFind = document.querySelector("#btn-find");

// --- Detect user location automatically on page load ---
window.addEventListener("load", function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError, { timeout: 8000 });
  } else {
    console.log("Geolocation not supported in this browser");
  }
});

function showPosition(position) {
  var lat = position.coords.latitude;
  var lon = position.coords.longitude;

  // Fetching API for weather by coordinates
  var myRequest = new XMLHttpRequest();
  var url = `https://api.weatherapi.com/v1/forecast.json?key=6ce433bc8b0e44af8ff152116250511&q=${lat},${lon}&days=3`;

  myRequest.open("GET", url);
  myRequest.send();

  myRequest.addEventListener("readystatechange", function () {
    if (myRequest.readyState === 4) {
      if (myRequest.status === 200) {
        var data = JSON.parse(myRequest.responseText || myRequest.response);
        console.log("Weather by location:", data);
        displayWeather(data);
      } else {
        console.error("Location weather request failed, status:", myRequest.status);
        Swal.fire({ title: "Could not get weather by location (API error)", icon: "error" });
      }
    }
  });
}

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      console.log("User denied location access. Enter city manually.");
      break;
    case error.POSITION_UNAVAILABLE:
      console.log("Location info unavailable.");
      break;
    case error.TIMEOUT:
      console.log("Location request timed out.");
      break;
    default:
      console.log("Unknown location error.");
  }
}

// --- Search by city ---
btnFind.addEventListener("click", function () {
  var city = countryInput.value.trim();
  if (city === "") {
    Swal.fire({ title: "Please enter a city name" });
    return;
  }

  var myRequest = new XMLHttpRequest();
  var url = `https://api.weatherapi.com/v1/forecast.json?key=6ce433bc8b0e44af8ff152116250511&q=${encodeURIComponent(city)}&days=3`;

  myRequest.open("GET", url);
  myRequest.send();

  btnFind.disabled = true;
  btnFind.innerText = "Loading...";

  myRequest.addEventListener("readystatechange", function () {
    if (myRequest.readyState === 4) {
      btnFind.disabled = false;
      btnFind.innerText = "Find";

      if (myRequest.status === 200) {
        var data = JSON.parse(myRequest.responseText || myRequest.response);
        console.log("Weather by city:", data);
        displayWeather(data);
        // Optionally clear input
        // countryInput.value = "";
      } else {
        console.error("City request failed, status:", myRequest.status);
        Swal.fire({ title: "Could not find city or API error", icon: "error" });
      }
    }
  });
});

// Display Function
function displayWeather(data) {
  // Day 1
  var today = data.forecast.forecastday[0];
  var todayDate = new Date(today.date);
  var todayDayName = todayDate.toLocaleDateString("en-US", { weekday: "long" });

  document.querySelector(".today .day").innerHTML = todayDayName;
  document.querySelector(".date").innerHTML = today.date;
  document.querySelector(".city").innerHTML = data.location.name;
  document.querySelector(".temp").innerHTML = today.day.avgtemp_c + "<sup>°C</sup>";
  document.querySelector(".text").innerHTML = today.day.condition.text;
  document.querySelector(".humidity").innerHTML = today.day.avghumidity + "%";
  document.querySelector(".wind").innerHTML = today.day.maxwind_kph + " km/h";
  document.querySelector(".wind-direct").innerHTML = data.current ? data.current.wind_dir : "";

  document.querySelector(".forecasting .card .icon").innerHTML =
    `<img src="https:${today.day.condition.icon}" alt="${today.day.condition.text}">`;

  // Day 2
  var secondDay = data.forecast.forecastday[1];
  var secondDayName = new Date(secondDay.date).toLocaleDateString("en-US", { weekday: "long" });

  document.querySelector(".secDay").innerHTML = secondDayName;
  document.querySelector(".secDayMaxTemp").innerHTML = secondDay.day.maxtemp_c + "°C";
  document.querySelector(".secDayMinTemp").innerHTML = secondDay.day.mintemp_c + "°C";
  document.querySelector(".secDayStatus").innerHTML = secondDay.day.condition.text;
  document.querySelector(".forecasting .card .iconSecond").innerHTML =
    `<img src="https:${secondDay.day.condition.icon}" alt="${secondDay.day.condition.text}">`;

  // Day 3
  var thirdDay = data.forecast.forecastday[2];
  var thirdDayName = new Date(thirdDay.date).toLocaleDateString("en-US", { weekday: "long" });

  document.querySelector(".thirdDay").innerHTML = thirdDayName;
  document.querySelector(".thirdDayMaxTemp").innerHTML = thirdDay.day.maxtemp_c + "°C";
  document.querySelector(".thirdDayMinTemp").innerHTML = thirdDay.day.mintemp_c + "°C";
  document.querySelector(".thirdDayStatus").innerHTML = thirdDay.day.condition.text;
  document.querySelector(".forecasting .card .iconThird").innerHTML =
    `<img src="https:${thirdDay.day.condition.icon}" alt="${thirdDay.day.condition.text}">`;
}
