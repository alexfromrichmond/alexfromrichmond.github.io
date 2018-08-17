'use strict';

var map = L.map('map');
map.createPane('busPane');
map.getPane('busPane').style.zIndex = 640;
map.createPane('injuryPane');
map.getPane('injuryPane').style.zIndex = 650;
map.createPane('fatalPane');
map.getPane('fatalPane').style.zIndex = 660;
var popup = L.popup();
var geoJsonLayer = L.geoJson(null, {
  fillOpacity : 0.5,
  fillColor: '#8856a7',
  color: '#8856a7',
  stroke : true,
  fill : true
}).addTo(map);

for (var walkshed of WALKSHEDS.geometries) {
  geoJsonLayer.addData(walkshed);
}

function onBusClick(e) {
  var props = e.target.feature.properties;
  var text = '<em>' + props.Name + '</em>';

  popup
    .setLatLng(e.latlng)
    .setContent(text)
    .openOn(map);
  map.setView(e.target.getLatLng());
}

function onEachBus(feature, layer) {
	layer.on({
		click: onBusClick,
	});
}

// Creates a dark purple marker with the bus icon
var busMarker = L.AwesomeMarkers.icon({
  prefix: 'fa',
  icon: 'bus',
  markerColor: 'darkpurple',
});

L.geoJSON(grtcPulseStations, {
  pointToLayer: (feature, latlng) => {
    return L.marker(latlng, {
      icon: busMarker,
      pane: 'busPane',
    });
  },
  onEachFeature: onEachBus,
}).addTo(map);

function crashStyle(feature) {
  var paneName = feature.properties.NO_OF_PED_FATALITIES >= 1 ? 'fatalPane' : 'injuryPane';
  var markerColor = feature.properties.NO_OF_PED_FATALITIES >= 1 ? '#f03b20' : '#feb24c';
	return {
    color: 'black',
    fillColor: markerColor,
    fillOpacity: 1.0,
    opacity: 1,
    pane: paneName,
    weight: 1,
	};
}

function onCrashClick(e) {
  var props = e.target.feature.properties;
  var text = '<h2><i class="fa fa-car"></i> <i class="fa fa-exchange"></i> <i class="fa fa-male"></i></h2>'
    + '<dl class="inline-flex"><dt><i class="fa fa-calendar" aria-hidden="true"></i></dt><dd>' + props.CRASH_DATE.split('T')[0] + '</dd>'
    + '<dt><i class="fa fa-clock-o"></i></dt>'
    + '<dd>' + props.CRASH_HOUR + '</dd>'
    + '<dt><i class="fi-skull"></i></dt>'
    + '<dd>' + props.NO_OF_PED_FATALITIES + '</dd>'
    + '<dt><i class="fa fa-stethoscope"></i></dt>'
    + '<dd>' + props.NO_OF_PED_INJURIES + '</dd>'
    + '</dl>';

  popup
    .setLatLng(e.latlng)
    .setContent(text)
    .openOn(map);

  map.setView(e.target.getLatLng());
}

function onEachCrash(feature, layer) {
	layer.on({
		click: onCrashClick,
	});
}

L.geoJson(WALKSHED_CRASHES, {
  pointToLayer: (feature, latlng) => {
    return L.circleMarker(latlng);
  },
  style: crashStyle,
  onEachFeature: onEachCrash,
}).addTo(map);

var Stamen_Toner = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.{ext}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
});
Stamen_Toner.addTo(map);

map.fitBounds(geoJsonLayer.getBounds());
