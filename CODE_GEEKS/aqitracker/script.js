//28a7d78ab2cf856b7f1c4c8a1968a5a7

const errorLabel = document.querySelector("label[for='error-msg']")
const latInp = document.querySelector("#latitude")
const lonInp = document.querySelector("#longitude")
const airQuality = document.querySelector(".air-quality")
const airQualityStat = document.querySelector(".air-quality-status")
const srchBtn = document.querySelector(".search-btn")
const componentsEle = document.querySelectorAll(".component-val")
const good=document.getElementById("good");
const hazy=document.getElementById("hazy");
const bad1=document.getElementById("bad1");
const verybad=document.getElementById("verybad");

const aqi_value=[good,hazy,bad1,verybad];


const appId = "28a7d78ab2cf856b7f1c4c8a1968a5a7" // Get your own API Key from https://home.openweathermap.org/api_keys
const link = "https://api.openweathermap.org/data/2.5/air_pollution"	// API end point

const getUserLocation = () => {
	// Get user Location
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(onPositionGathered, onPositionGatherError)
	} else {
		onPositionGatherError({ message: "Can't Access your location. Please enter your co-ordinates" })
	}
}

const onPositionGathered = (pos) => {
	let lat = pos.coords.latitude.toFixed(4), lon = pos.coords.longitude.toFixed(4)

	// Set values of Input for user to know
	latInp.value = lat
	lonInp.value = lon

	// Get Air data from weather API
	getAirQuality(lat, lon)
}

const getAirQuality = async (lat, lon) => {
	// Get data from api
	const rawData = await fetch(`${link}?lat=${lat}&lon=${lon}&appid=${appId}`).catch(err => {
		onPositionGatherError({ message: "Something went wrong. Check your internet conection." })
		console.log(err)
	})
	const airData = await rawData.json()
    console.log(airData)
	setValuesOfAir(airData)
	setComponentsOfAir(airData)
}

const setValuesOfAir = airData => {
	const aqi = airData.list[0].main.aqi
	let airStat = "", color = ""

	// Set Air Quality Index
	airQuality.innerText = aqi

	// Set status of air quality

	switch (aqi) {
		case 1:
			airStat = "Good"
			color = "white"
			aqi_value.forEach((element) => {
				element.style.display = "none";
			});
			displayBg(good);
			break;
			case 2:
				airStat = "Fair"
				color = "pink"
				aqi_value.forEach((element) => {
					element.style.display = "none";
				});
				displayBg(hazy);
				break;
			case 3:
				airStat = "Moderate"
				color = "yellow"
				aqi_value.forEach((element) => {
					element.style.display = "none";
				});
				break;
			case 4:
				airStat = "Poor"
				color = "orange"

				aqi_value.forEach((element) => {
					element.style.display = "none";
				});
				displayBg(bad1);
				break;
		case 5:
			airStat = "Very Poor"
			color = "red"
			aqi_value.forEach((element) => {
				element.style.display = "none";
			});
			displayBg(bad1);
			break;
		default:
			aqi_value.forEach((element) => {
				element.style.display = "none";
			});
			airStat = "Unknown"
	}

	airQualityStat.innerText = airStat
	airQualityStat.style.color = color
}


const setComponentsOfAir = airData => {
	let components = {...airData.list[0].components}
	componentsEle.forEach(ele => {
		const attr = ele.getAttribute('data-comp')
		ele.innerText = components[attr] += " μg/m³"
	})
}

const onPositionGatherError = e => {
	errorLabel.innerText = e.message
}

srchBtn.addEventListener("click", () => {
	getAirQuality(parseFloat(latInp.value).toFixed(4), parseFloat(lonInp.value).toFixed(4))
})

getUserLocation()

function displayBg(video) {
	video.currentTime = 0;
	video.play;
	video.style.display = "block";
}