var L = require('leaflet');
var LD = require('leaflet-draw')
var Lfullscreen = require('leaflet-fullscreen')
var MiniMap = require('leaflet-minimap');
//var markercluster = require('leaflet-markercluster');
var utils = require('./utils.js');

L.Icon.Default.imagePath = 'node_modules/leaflet/dist/images/';

/* Base Setup of the Map*/
// center of the map
var center = [40.5853, -105.0844];

// Create the map
var map = L.map('map');
map.setView(center, 5);

var tiles = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
// Set up the OSM layer
var mainlayer = L.tileLayer(tiles, {
    attribution: 'Data © <a href="http://osm.org/copyright">OpenStreetMap</a>',
    maxZoom: 18,
});

mainlayer.addTo(map);

//Add the map scale
L.control.scale().addTo(map);

//////////////////////////////On click interactivity
var popup = L.popup();
function onMapClick(e) {
    map.flyTo(e.latlng);
    popup
        .setLatLng(e.latlng)
        .setContent("<strong>" + e.latlng.lat.toFixed(2).toString() + "," + e.latlng.lng.toFixed(2).toString() + "</strong>")
        .openOn(map);
    //breadcrumb update
}

map.on("click", onMapClick);
/////////////////////////////END on click interactivity

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


//////////////////////////start fullscreen CONTROL ON THE MAP
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
//////////////////////////end fullscreen CONTROL ON THE MAP

// //////////////////////////START Minimap CONTROL ON THE MAP
// var osmUrl = "http://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}"; //"http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
// var osmAttrib = "Map data &copy; OpenStreetMap contributors";
// //Minimap Plugin magic goes here! Note that you cannot use the same layer object again, as that will confuse the two map controls
// var osm2 = new L.TileLayer(osmUrl, { minZoom: 0, maxZoom: 11 });
// var minimap_options={ toggleDisplay: true, width: 200, height: 200, collapsedHeight:19,collapsedWidth:19,zoomOffset:map.getZoom()-1 }
// var miniMap = new L.Control.MiniMap(osm2,minimap_options).addTo(map);
// //////////////////////////END Minimap CONTROL ON THE MAP

/*Performance check by adding large  number of circle markers*/
////////////// control that shows state info on hover
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create("div", "info legend");
    this.update();
    return this._div;
};

info.update = function (props,state="") {
    this._div.innerHTML = "<h4>Test: </h4>" + (props ? "<b>" + props.name.toString() +", " + props.timestamp.toString() + " ms</b><br />" : "Starting Experiment");
};

info.addTo(map);
////////////END control that shows state info on hover

const starttime = Date.now();
var preplotpoints = [];
for(i = 0; i < 150;i++){
    var fig = utils.getRandomGeoJson(map,"Polygon",10)
//    if(preplotpoints.indexOf(fig) === -1) preplotpoints.push(fig); //unique lines condition
    preplotpoints.push(fig);
    editableLayers.addLayer(L.geoJSON(fig));
    if(i % 50000 === 0){
        console.log(i);
    }
}
updateProps = {
    name: preplotpoints.length,
    timestamp: Date.now() - starttime,
};
info.update(updateProps);
console.log(" plotting "+ preplotpoints.length.toString() +"stored points takes " + ((Date.now() - starttime)/1000).toString() +" seconds ");
console.log(" plotting "+ preplotpoints.length.toString() +"stored points takes " + (performance.memory.usedJSHeapSize / 1000000).toString() + " Mbytes ");


module.exports = {
    map
}