
// my token
mapboxgl.accessToken = 'pk.eyJ1Ijoia2h5MjM2IiwiYSI6ImNsZzVxYTVnNDA1d2kzZW45b3l5d280N3oifQ.GqfNX5HwLaA5utEN2iQkXg';

// map start location
const NYC_COORDINATES = [-74.00, 40.725] 

// initialize basemap
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v11',
    center: NYC_COORDINATES,
    zoom: 11.2,
    pitch: 40,
    bearing: 0,
    container: 'map',
    antialias: true
});


map.on('load', () => {

    // add 5/5/22 bike trips geojson
    map.addSource('trips220505source', {
        type: 'geojson',
        data: trips220505
    })
    
    // add 5/5/22 bike trip points
    map.addLayer({
        id: 'circle-trips',
        type: 'circle',
        source: 'trips220505source',
        paint: {
            'circle-color': '#3887be',
            'circle-radius': 3.5,
            'circle-opacity': 0.6
        }
    })


// on click, display optimal cycling trip route
    map.on('click', 'circle-trips', (e) => {
        
        const start_lon = e.features[0].properties.start_lon;
        const start_lat = e.features[0].properties.start_lat;
        const end_lon = e.features[0].properties.end_lon;
        const end_lat = e.features[0].properties.end_lat;

        getRoute(start_lon, start_lat, end_lon, end_lat)
    
    });


    // optimal cycling route-creation function
    // adapted from Getting started with the Mapbox Directions API tutorial: https://docs.mapbox.com/help/tutorials/getting-started-directions-api/

    async function getRoute(start_lon, start_lat, end_lon, end_lat) {

        const query = await fetch(
            `https://api.mapbox.com/directions/v5/mapbox/cycling/${start_lon},${start_lat};${end_lon},${end_lat}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
            { method: 'GET' }
          );
        const json = await query.json();
        const data = json.routes[0];
        const route = data.geometry.coordinates;
        const geojson = {
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'LineString',
                coordinates: route
            }
        };
        
        // if the route already exists on the map, we'll reset it using setData
        if (map.getSource('route')) {
            map.getSource('route').setData(geojson);
          }
          // otherwise, we'll make a new request
          else {
            map.addLayer({
              'id': 'route',
              'type': 'line',
              'source': {
                'type': 'geojson',
                'data': geojson
              },
              'layout': {
                'line-join': 'round',
                'line-cap': 'round'
              },
              'paint': {
                'line-color': '#00cf37',
                'line-width': 5,
                'line-opacity': 0.75
              }
            });
          } 
    }
})
        

