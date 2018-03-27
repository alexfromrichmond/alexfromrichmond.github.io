'use strict';

var map = L.map('map', {
  attributionControl: true,
});

var Stamen_Toner = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.{ext}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 18,
  ext: 'png'
});
Stamen_Toner.addTo(map);

// control that shows state info on hover
var info = L.control();

info.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'info');
  this.update();
  return this._div;
};

info.update = function (props) {
  this._div.innerHTML = '<h4>Richmond, Virginia</h4>' +  (props ?
    'Voter District <b>' + props.Name + '</b>'
    : 'Select a voter district');
};

info.addTo(map);

function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 5,
    color: '#ffaa33',
    dashArray: '',
    fillOpacity: 0.7
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }

  info.update(layer.feature.properties);
}

function resetHighlight(e) {
  geoJsonLayer.resetStyle(e.target);
  info.update();
}

function zoomToFeature(e) {
  geoJsonLayer.eachLayer(function(layer) {
    geoJsonLayer.resetStyle(layer);
  });

  highlightFeature(e);

  map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
  layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		click: zoomToFeature
  });
}

var geoJsonLayer = L.geoJson(DISTRICTS, {
    onEachFeature: onEachFeature
}).addTo(map);

map.fitBounds(geoJsonLayer.getBounds());
