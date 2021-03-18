var L = require('leaflet');
var LD = require('leaflet-draw')
var Lfullscreen = require('leaflet-fullscreen')
var utils = require('../utils.js');
var random = require('geojson-random');
var easybutton = require('leaflet-easybutton');
// var tf = require('@tensorflow/tfjs');
// var data = require("./data.js");


L.Icon.Default.imagePath = 'node_modules/leaflet/dist/images/';

/* Base Setup of the Map*/
// center of the map
var center = [40.5853, -105.0844];

console.time("Home");

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

/* END Base Setup of the Map*/


//////////////// ////////////// On click interactivity
// var popup = L.popup();
// function onMapClick(e) {
//     map.flyTo(e.latlng);
//     popup
//         .setLatLng(e.latlng)
//         .setContent("<strong>" + e.latlng.lat.toFixed(2).toString() + "," + e.latlng.lng.toFixed(2).toString() + "</strong>")
//         .openOn(map);
//     //breadcrumb update
// }
//
// map.on("click", onMapClick);
/////////////////////////////END on click interactivity

//////////////////////////DRAW CONTROL ON THE MAP

// Initialize the FeatureGroup to store editable layers
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

// Initialize the draw control and pass it the FeatureGroup of editable layers
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

/*Performance check by adding large  number of circle markers*/
////////////// control that shows state info on hover
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create("div", "info legend",);
    this.update();
    return this._div;
};

info.update = function (props) {
    this._div.innerHTML = "<h4>Test: </h4>" + (props ? "<b id='num_shapes'>" + props.name.toString() +", " + props.timestamp.toString() + " ms</b><br />" : "Starting Experiment");
};

info.addTo(map);
////////////END control that shows state info on hover

function onEachFeature(feature, layer) {
    // console.log(feature.properties.NAME);
    if (feature.properties && feature.properties.NAME) {
        layer.bindPopup(feature.properties.NAME);
    }
    preplotpoints.push(feature.properties.NAME);
}

var preplotpoints = [];

function getLoadData(num_states){
    var stateshapes = [];
    // let num_states = 30
    const starttime = Date.now();
//https://medium.com/@maptastik/loading-external-geojson-a-nother-way-to-do-it-with-jquery-c72ae3b41c01 dynamically load geojson
    for(i = 1 ; i <= num_states; i++){
        let statenumber=(i < 10)? '0'+i.toString():i.toString()
        let filename='cb_2018_'+statenumber+'_tract_500k.json';
        stateshapes[i] = $.ajax({
            url: "https://raw.githubusercontent.com/mehrotrasan16/us-census-tracts-shapefiles-and-geojson/master/USA-cb_tract_500k-geojson/"+filename,
            dataType: "json",
            success: function (data){
                console.log(filename + " Retrieved");
                // console.log(data);
                editableLayers.addLayer(L.geoJSON(data,{
                        onEachFeature: onEachFeature
                    })
                );

                updateProps = {
                    name: preplotpoints.length,
                    timestamp: Date.now() - starttime,
                };

                info.update(updateProps);
            },
            error: function (xhr){
                console.log(xhr.statusText);
                //alert(xhr.statusText);
            },
            complete: function(data) {
                if(i === num_states){
                    console.log(" plotting "+ preplotpoints.length.toString() +"stored points takes " + ((Date.now() - starttime)/1000).toString() +" seconds ");
                    console.log(" plotting "+ preplotpoints.length.toString() +"stored points takes " + (performance.memory.usedJSHeapSize / 1000000).toString() + " Mbytes ");
                }
            }
        })
        // $.when(stateshapes[i]).done(function() {
        //     editableLayers.addLayer(L.geoJSON(stateshapes[i].responseJSON,{
        //             onEachFeature: onEachFeature
        //         })
        //     );
        // });
    }
}

// getLoadData(30);

function getGeneratePoints(num_points) {
    const starttime = Date.now();
    let geojson_fc = random.point(num_points,[-60.95, 25.84 , -130.67, 49.38]); //WSEN
    console.log(geojson_fc);
    editableLayers.addLayer(L.geoJson(geojson_fc,{
        onEachFeature: onEachFeature,
        pointToLayer: function (geoJsonPoint,latlng){
            return L.circle(latlng);
        }
    }));

    updateProps = {
        name: preplotpoints.length,
        timestamp: Date.now() - starttime,
    };

    info.update(updateProps);

    console.log(" plotting "+ preplotpoints.length.toString() +"stored points takes " + ((Date.now() - starttime)/1000).toString() +" seconds ");
    console.log(" plotting "+ preplotpoints.length.toString() +"stored points takes " + (performance.memory.usedJSHeapSize / 1000000).toString() + " Mbytes ");

}


function getLoadPoints(num_point_files){
    var points = [];
    const starttime = Date.now();
    performance.mark("all points: loading");
    for(i = 1 ; i <= num_point_files; i++){
        let filename='points_run_'+ i.toString()+'.json';
        points[i] = $.ajax({
            url: "https://raw.githubusercontent.com/mehrotrasan16/us-census-tracts-shapefiles-and-geojson/master/point-data/"+filename,
            dataType: "json",
            success: function (data){
                console.log(filename + " Retrieved");
                performance.mark("one point file: adding to map");
                editableLayers.addLayer(L.geoJSON(data,{
                        onEachFeature: onEachFeature,
                        pointToLayer: function (geoJsonPoint,latlng){
                            return L.circle(latlng);
                        }
                    }
                    )
                );
                performance.mark("one point file: loaded and added to map");

                updateProps = {
                    name: preplotpoints.length,
                    timestamp: Date.now() - starttime,
                };

                info.update(updateProps);
            },
            error: function (xhr){
                console.log(xhr.statusText);
                //alert(xhr.statusText);
            },
            complete: function(data) {
                performance.mark("all points: loaded")
                if(i === num_point_files-1){
                    console.log(" plotting "+ preplotpoints.length.toString() +"stored points takes " + ((Date.now() - starttime)/1000).toString() +" seconds ");
                    console.log(" plotting "+ preplotpoints.length.toString() +"stored points takes " + (performance.memory.usedJSHeapSize / 1000000).toString() + " Mbytes ");
                }
            }
        })
    }
    return i;
}
// getLoadPoints(4)

function getLoadShapes(num_shape_files){
    var shapes = [];
    const starttime = Date.now();
    performance.mark("all shapes: loading");
    for(i = 1 ; i <= num_shape_files; i++){
        let filename='pentagons_run_' + i.toString() + '.json' //petagons_run_'+ i.toString()+'.json';
        shapes[i] = $.ajax({
            url: "https://raw.githubusercontent.com/mehrotrasan16/us-census-tracts-shapefiles-and-geojson/master/shape-data/"+filename,
            dataType: "json",
            success: function (data){
                console.log(filename + " Retrieved");
                performance.mark('Adding Shape Layer to map')
                editableLayers.addLayer(L.geoJSON(data,{
                        onEachFeature: onEachFeature,
                    }
                    )
                );
                performance.mark('Done Adding Shape Layer to map')
                updateProps = {
                    name: preplotpoints.length,
                    timestamp: Date.now() - starttime,
                };

                info.update(updateProps);
            },
            error: function (xhr){
                console.log(xhr.statusText);
                //alert(xhr.statusText);
            },
            complete: function(data) {
                if(i === num_shape_files){
                    console.log(" plotting "+ preplotpoints.length.toString() +"stored points takes " + ((Date.now() - starttime)/1000).toString() +" seconds ");
                    console.log(" plotting "+ preplotpoints.length.toString() +"stored points takes " + (performance.memory.usedJSHeapSize / 1000000).toString() + " Mbytes ");
                }
            }
        })
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// module.exports = {
//     map,getLoadPoints, getLoadData,getLoadShapes
// }
window.getLoadPoints = getLoadPoints;
window.getLoadShapes = getLoadShapes;
window.getLoadData = getLoadData;
window.sleep = sleep;

//----------------------------------------

var mybtn = L.easyButton({
    id: "random_data_puller",
    position: 'topleft',
    leafletClasses: true,
    states: [{
        stateName: 'center',
        onClick: function(btn, map){
            console.profile("MeME")
            console.time("getLoadData")
            clicked(this);
            console.timeEnd("getLoadData");
            console.profileEnd();
        },
        title: 'Performance',
        icon: '<img src="../images/performance.svg">',
    }]
}).addTo(map);

async function clicked(elem) {
    preplotpoints = [];
    getLoadData(5);
    // getLoadShapes(1);
    getLoadPoints(3);
    performance.measure('button clicked');
    console.log("Page Load timings Info");
    console.log(utils.network_perf_info());
    console.log(utils.get_web_vitals());
    console.log("Network Connection Information! : ");
    console.log(navigator.connection);
}


async function mypagefn() {

    await document.getElementById("random_data_puller").click();

    //Network Connection Information API
    var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    var type = connection.effectiveType;
    function updateConnectionStatus() {
        console.log("Connection type changed from " + type + " to " + connection.effectiveType);
        type = connection.effectiveType;
    }
    connection.addEventListener('change', updateConnectionStatus);


//Data Structure to hold all my features plus their outputs
    var x = await document.getElementsByClassName("legend");
    var shapecount = await x[0].innerHTML.split(",")[0].split('>')[3];
    var resourceLoadingSum = await performance.getEntriesByType('resource').forEach(entry => {

    })
    myWebvitals = await utils.get_web_vitals();

    mydata = {
        x: [[myWebvitals.FCP, myWebvitals.TTFB, connection.effectiveType,connection.downlink]],
        y: [shapecount]
    }
    console.log("mydataframe");
    console.log(mydata);
}

mypagefn();