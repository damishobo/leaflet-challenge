// Creating the map object
let myMap = L.map("map", {
  center: [40.7128, -10.0059],
  zoom: 2
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Use this link to get the GeoJSON data.
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson";

d3.json(link).then(({features}) => {
    features.forEach(({properties:{mag,place},geometry:{coordinates:[lng,lat,depth]}}) => {
        L.circle([lat,lng], 
            {
                radius:mag*50000,
                fillOpacity:1,
                fillColor: fillColor(depth),
                color:'black',
                weight:2
            
            }).bindPopup(`<h3>${place}<br>Magnitude: ${mag}</h3>`).addTo(myMap)         
    });
});

var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [-10, 10, 30, 50, 70, 90],
        labels = [];
    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + fillColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
};  
legend.addTo(myMap); 

function fillColor(depth) {
  switch (true) {
    case depth > 90:
      return "#ea2c2c";
    case depth > 70:
      return "#ea822c";
    case depth > 50:
      return "#ee9c00";
    case depth > 30:
      return "#eecc00";
    case depth > 10:
      return "#d4ee00";
    default:
      return "#98ee00";
  }
};