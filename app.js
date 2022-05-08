// map object

// get coordinates via geolocation api
// Get the user's coordinates:                                                              
async function getCoords(){
    pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
    return [pos.coords.latitude, pos.coords.longitude]
}                              


// get foursquare businesses

// process foursquare array

// event handlers
// window load

// business submit button