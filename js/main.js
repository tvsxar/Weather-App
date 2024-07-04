const form = document.querySelector('#form');
const input = document.querySelector('.form-input');
const API_KEY = `e672897f38e611f2e3a354e5021fa94c`;


form.onsubmit = submitHandler;

async function submitHandler(e) {
    e.preventDefault();

    if(!input.value.trim()) {
        console.log('Enter city name');
        return;
    }

    const cityName = input.value.trim();
    input.value = ''

	const cityInfo = await getGeo(cityName);
    console.log('cityInfo', cityInfo);

    if (!cityInfo.length) return;

	const weatherInfo = await getWeather(
		cityInfo[0]['lat'],
		cityInfo[0]['lon']
	);
    
    const weatherData = {
        name: weatherInfo.name,
        temp: weatherInfo.main.temp,
        humidity: weatherInfo.main.humidity,
        speed: weatherInfo.wind.speed,
        main: weatherInfo.weather[0]['main']
    };

    renderWeatherData(weatherData);
}

async function getGeo(name) {
    const geoURL = `http://api.openweathermap.org/geo/1.0/direct?q=${name}&limit=5&appid=${API_KEY}`;
    const response = await fetch(geoURL);
    const data = await response.json();
    return data;
}

async function getWeather(lat, lon) {
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const response = await fetch(weatherURL);
    const data = await response.json();
    return data;
}

function renderWeatherData(data) {

    document.querySelector('.weather-info').classList.remove('none');
	document.querySelector('.weather-details').classList.remove('none');

    const temp = document.querySelector('.weather-temp');
    const city = document.querySelector('.weather-city');
    const humidity = document.querySelector('#humidity');
    const speed = document.querySelector('#speed');
    const img = document.querySelector('.weather-img')

    temp.innerText = Math.round(data.temp) + '°c';
    humidity.innerText = data.humidity + '%';
    city.innerText = data.name;
    speed.innerText = data.speed + 'km/h';

    //images

    const fileNames = {
        Clouds: 'clouds',
        Clear: 'clear',
        Rain: 'rain',
        Mist: 'mist',
        Drizzle: 'drizzle',
        Snow: 'snow'
    }

    if(fileNames[data.name]) {
    img.src = `./img/weather/${fileNames[data.name]}.png`
    }
}