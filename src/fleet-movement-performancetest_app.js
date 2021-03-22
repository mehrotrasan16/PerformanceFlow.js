
/*
Author: Sanket M
References:
1. http://kuanbutts.com/2019/08/31/mbgl-vs-leaflet/
2. https://makerlog.org/posts/leaflet-basics
*/

var L = require('leaflet');
var LD = require('leaflet-draw')
var Lfullscreen = require('leaflet-fullscreen')
var MiniMap = require('leaflet-minimap');
var utils = require('../utils.js');

L.Icon.Default.imagePath = 'node_modules/leaflet/dist/images/';

/* Base Setup of the Map*/
// center of the map
var center = [40.5853, -105.0844];

// Create the map
var map = L.map('map');
map.setView(center, 6);

var tiles = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
// Set up the OSM layer
var mainlayer = L.tileLayer(tiles, {
    attribution: 'Data © <a href="http://osm.org/copyright">OpenStreetMap</a>',
    maxZoom: 18,
});

mainlayer.addTo(map);

//Add the map scale
L.control.scale().addTo(map);


//////////////////////////DRAW CONTROL ON THE MAP

// // Read the state data shapes present in us-state.js
// // add the statesData layer to the map
// var StatesgeoJson; //used later put here for global scope

// Initialise the FeatureGroup to store editable layers
var editableLayers = new L.FeatureGroup();
map.addLayer(editableLayers);

var options = {
    position: "topleft",
    draw: {
        polygon: {
            allowIntersection: false, // Restricts shapes to simple polygons
            drawError: {
                color: "#e1e100", // Color the shape will turn when intersects
                message: "<strong>Oh snap!<strong> you can't draw that!", // Message that will show when intersect
            },
            shapeOptions: {
                color: "#97009c",
            },
        },
        polyline: {
            shapeOptions: {
                color: "#f357a1",
                weight: 10,
            },
        },
        // disable toolbar item by setting it to false
        polyline: true,
        circle: true, // Turns off this drawing tool
        polygon: true,
        marker: true,
        rectangle: true,
    },
    edit: {
        featureGroup: editableLayers, //REQUIRED!!
        remove: true,
    },
};

// Initialise the draw control and pass it the FeatureGroup of editable layers
var drawControl = new L.Control.Draw(options);
map.addControl(drawControl);
map.on("draw:created", function (e) {
    var type = e.layerType,
        layer = e.layer;

    if (type === "polyline") {
        layer.bindPopup("A polyline!");
    } else if (type === "polygon") {
        layer.bindPopup("A polygon!");
    } else if (type === "marker") {
        layer.bindPopup("marker!");
    } else if (type === "circle") {
        layer.bindPopup("A circle!");
    } else if (type === "rectangle") {
        layer.bindPopup("A rectangle!");
    }

    editableLayers.addLayer(layer);
});
//////////////////////////END DRAW CONTROL ON THE MAP

//fullscreen control
map.addControl(new L.Control.Fullscreen());
map.on('fullscreenchange', function () {
    if (map.isFullscreen()) {
        console.log('entered fullscreen');
        fscrinfo.addTo(map);

    } else {
        console.log('exited fullscreen');
        fscrinfo.remove();
    }
});


//Minimap control
var osmUrl = "http://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}"; //"http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
var osmAttrib = "Map data &copy; OpenStreetMap contributors";
//Minimap Plugin magic goes here! Note that you cannot use the same layer object again, as that will confuse the two map controls
var osm2 = new L.TileLayer(osmUrl, { minZoom: 0, maxZoom: 11 });
var minimap_options={ toggleDisplay: true, width: 200, height: 200, collapsedHeight:19,collapsedWidth:19,zoomOffset:map.getZoom()-1 }
var miniMap = new L.Control.MiniMap(osm2,minimap_options).addTo(map);
// new MiniMap(layer, options).addTo(map);

/*Performance check by adding large  number of circle markers*/
// control that shows state info on hover
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create("div", "info");
    this.update();
    return this._div;
};

info.update = function (string,state="") {
    this._div.innerHTML = "<h4>"+ string +" dots</h4>" //"<h4>US Population Density</h4>" + (props ? "<b>" + props.name +", " + props.state + "</b><br />" + props.density + " people / mi<sup>2</sup>" : "Hover over a state");
};

info.addTo(map);

const allCircles = [];

const circlesUpdater = setInterval(() => {
    allCircles.forEach(circleMeta => {
        const ll = circleMeta.circle.getLatLng();

        const earthRadius = 6378;
        const dy = 0.01 * circleMeta.theta;
        const dx = 0.01 * circleMeta.theta;
        const degreeFactor = circleMeta.theta * 180;
        const newLat = ll.lat + (dy/earthRadius) * (degreeFactor/Math.PI);
        const newLng = ll.lng + (dx/earthRadius) * (degreeFactor/Math.PI) / Math.cos(ll.lat * Math.PI/degreeFactor);

        const newPos = new L.LatLng(newLat,newLng);
        if (map.getBounds().contains(newPos)){
            circleMeta.circle.setLatLng(newPos);
        }
        else{
            circleMeta.circle.setLatLng(utils.getRandomLatLng(map));
        }
    });

    //document.getElementById('info').textContent = `${allCircles.length} dots`;
    info.update(allCircles.length);

    if (allCircles.length > 2000) {
        clearInterval(circlesUpdater);
    }
    const newCircle = L.circle(utils.getRandomLatLng(map), 50, {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5
    }).addTo(map);

    allCircles.push({
        circle: newCircle,
        theta: (Math.random() * 2) - 1,
    });

},5)

module.exports = {
    map
}