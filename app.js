// map object
const myMap = {
	coordinates: [],
	places: [],
	map: {},
	markers: {},

	// build leaflet map
	buildMap() {
		this.map = L.map('map', {
		center: this.coordinates,
		zoom: 11,
		});

		// add openstreetmap tiles
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		minZoom: '15',
		}).addTo(this.map)

		// create and add geolocation marker
		const marker = L.marker(this.coordinates)
		marker
		.addTo(this.map)
		.bindPopup('<p1><b>You are Here</b><br></p1>')
		.openPopup()
	},

	// add place markers
	addMarkers() {
		for (var i = 0; i < this.places.length; i++) {
		this.markers = L.marker([
			this.places[i].lat,
			this.places[i].long,
		])
			.bindPopup(`<p1>${this.places[i].name}</p1>`)
			.addTo(this.map)
		}
	},
}

// get user's location
async function getCoords(){
	const pos = await new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(resolve, reject)
	});
	return [pos.coords.latitude, pos.coords.longitude]
}

// get foursquare places
async function getFoursquare(locations) {
	const options = {
		method: 'GET',
		headers: {
		Accept: 'application/json',
		Authorization: 'fsq3UpO00k2ctJC1Tf1PdC8RplK1rKtIOWJUnBZTEjmYuOw='
		}
	}
	let limit = 5
	let lat = myMap.coordinates[0]
	let lon = myMap.coordinates[1]
	let response = await fetch(`https://api.foursquare.com/v3/places/search?&query=${locations}&limit=${limit}&ll=${lat}%2C${lon}`, options)
	let data = await response.text()
	let parsedData = JSON.parse(data)
	let places = parsedData.results
	return places
}
// process foursquare array
function processPlaces(data) {
	let places = data.map((element) => {
		let locations = {
			name: element.name,
			lat: element.geocodes.main.latitude,
			long: element.geocodes.main.longitude
		};
		return locations
	})
	return places
}


// window load
window.onload = async () => {
	const coords = await getCoords()
	myMap.coordinates = coords
	myMap.buildMap()
}

// submit button
document.getElementById('submit').addEventListener('click', async (event) => {
	event.preventDefault()
	let business = document.getElementById('business').value
	let data = await getFoursquare(business)
	myMap.places = processPlaces(data)
	myMap.addMarkers()
})