let myKey = `582f167938544aa1b22174222240912`;

let countryInput = document.getElementById("countryInput");
let btnSearch = document.getElementById("searchBtn");
let forecastCards = document.getElementById("forecastCards");
let userLocation = ""; // Store user's location

console.log("Elements: ", countryInput, btnSearch, forecastCards);

async function callApi(nameOfCountry) {
        let myResponse = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${myKey}&q=${nameOfCountry}&days=3`);
        let myResult = await myResponse.json();
        console.log(myResult);
        displayCard(myResult);
        console.log(myResponse);
        console.log("this is cccc", nameOfCountry);
  
}

function displayCard(myData) {
    let forecastDiv = myData.forecast.forecastday;
    console.log(forecastDiv);
    console.log(myData);

    let countryName = myData.location.name;
    console.log(countryName);

    let cartoona = "";
    
    for (let i = 0; i < forecastDiv.length; i++) {
        let infos = getDay(forecastDiv[i].date);
        console.log(infos);
        
        console.log(infos.dayindex);

        let className = i === 0 ? "left" : i === 1 ? "middle" : "right";
        
        cartoona += `
            <div class="${className}">
                ${i < 1 ? `<h2>${countryName}</h2>` : ''}
                <h3>${infos.dayindex}</h3>
                ${i < 1 ? `<h3>${infos.monthindex}</h3>` : ''}
                <p class="temp-${className}">${i < 1 ? myData.current.temp_c : forecastDiv[i].day.avgtemp_c}°C</p>
                <img src="${i < 1 ? myData.current.condition.icon : forecastDiv[i].day.condition.icon}" alt="weather icon">
                <p class="condition">${i < 1 ? myData.current.condition.text : forecastDiv[i].day.condition.text}</p>
            </div>
        `;
    }
    
    forecastCards.innerHTML = cartoona;
}

function getDay(x) {
    let day = new Date(x);
    console.log(day);
    
    let dayindex = day.toLocaleString("en-Us", { weekday: "long" });
    let monthindex = day.toLocaleString("en-Us", { month: "long" });
    console.log(dayindex);
    console.log(monthindex);
    
    return { dayindex, monthindex };
}

countryInput.addEventListener("input", function (e) {
    console.log(e.target.value);
    
    // If input is empty, return to user's location
    if (e.target.value.trim() === "") {
        if (userLocation) {
            callApi(userLocation);
        }
        return;
    }
    
    if (e.target.value.length < 3) return;
    
    callApi(e.target.value);
});

// Geolocation to get the user's location
console.log(navigator.geolocation.getCurrentPosition(
    function (success) {
        console.log(success);
        let latitude = success.coords.latitude;
        let longitude = success.coords.longitude;
        console.log(latitude, longitude);
        userLocation = `${latitude},${longitude}`; // Save user's location
        console.log(userLocation);
        
        callApi(userLocation);
    }, 
    function (error) {
        console.log(error);
        userLocation = "cairo"; // Save default location
        callApi("cairo");
    }
));

btnSearch.addEventListener("click", function () {
    callApi(countryInput.value);
    console.log("Search button clicked");
});