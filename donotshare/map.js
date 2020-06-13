$(document).ready(init);

function init() {
  mapboxgl.accessToken = 'pk.eyJ1Ijoic2hpbWl6dSIsImEiOiJjam95MDBhamYxMjA1M2tyemk2aHMwenp5In0.i2kMIJulhyPLwp3jiLlpsA';
  
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [-77.433594, 37.538758],
    zoom: 11,
    minZoom: 9,
    maxZoom: 19
  });
  
  map.fitBounds([
    [-77.38530301,37.44656788],
    [-77.60117281,37.60244496]
  ], {
    padding: 50
  });
  
  // const url = 'https://axwn.github.io/donotshare/test.geojson';
  const url = 'test.geojson';
  
  // get color depending on population density value
  function getColor(d) {
    return d >= 100 ? '#2c7bb6' :
    '#fdae61';
  }
  
  const mystops = [];
  for (const d in zoning_districts) {
    if (zoning_districts[d].housing_allowed) {
      if (zoning_districts[d].multi_family_allowed) {
        mystops.push([d, getColor(zoning_districts[d].max_units_per_acre)]);
      } else {
        mystops.push([d, "#d7191c"]);
      }
    } else {
      mystops.push([d, "black"]);
    }
  }
  
  map.on('load', function() {
    map.addSource("geojson", {
      type: "geojson",
      buffer: 0,
      data: url
    });
    
    map.addLayer({
      "id": "geojsonLayer",
      "type": "fill",
      "source": "geojson",
      "layout": {},
      "paint": {
        "fill-color": {
          property: 'Name',
          type: 'categorical',
          stops: mystops
        },
        "fill-opacity": 0.5
      }
    });
  });
  
  var layers = ['No housing allowed', 'Apartments not allowed', 'A few apartments allowed', 'Many apartments allowed'];
  var colors = ['black', '#d7191c', '#fdae61', '#2c7bb6'];
  
  for (i = 0; i < layers.length; i++) {
    var layer = layers[i];
    var color = colors[i];
    var item = document.createElement('div');
    var key = document.createElement('small');
    key.className = 'legend-key';
    key.style.backgroundColor = color;
    
    var value = document.createElement('small');
    value.innerHTML = layer;
    item.appendChild(key);
    item.appendChild(value);
    legend.appendChild(item);
  }

  // Add geolocate control to the map.
  map.addControl(
    new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    })
  );
  
  // map.on('mousemove', function(e) {
  //   var features = map.queryRenderedFeatures(e.point);
    
  //   // Limit the number of properties we're displaying for
  //   // legibility and performance
  //   var displayProperties = [
  //     'properties',
  //   ];
    
  //   var displayFeatures = features.map(function(feat) {
  //     var displayFeat = {};
  //     displayProperties.forEach(function(prop) {
  //       displayFeat[prop] = feat[prop];
  //     });
  //     return displayFeat;
  //   });
    
  //   document.getElementById('features').innerHTML = JSON.stringify(
  //     displayFeatures,
  //     null,
  //     2
  //     );
  // });
}