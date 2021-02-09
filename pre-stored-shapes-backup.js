var L = require('leaflet');
var LD = require('leaflet-draw')
var Lfullscreen = require('leaflet-fullscreen')
var MiniMap = require('leaflet-minimap');
var utils = require('./utils.js');
var LAjax = require('leaflet-ajax');



var tract_01 = require('../../Data/tract-data/USA-cb_tract_500k-geojson/cb_2018_01_tract_500k.json');
var tract_02 = require('../../Data/tract-data/USA-cb_tract_500k-geojson/cb_2018_02_tract_500k.json');
var tract_04 = require('../../Data/tract-data/USA-cb_tract_500k-geojson/cb_2018_04_tract_500k.json');
var tract_05 = require('../../Data/tract-data/USA-cb_tract_500k-geojson/cb_2018_05_tract_500k.json');
var tract_06 = require('../../Data/tract-data/USA-cb_tract_500k-geojson/cb_2018_06_tract_500k.json');
var tract_08 = require('../../Data/tract-data/USA-cb_tract_500k-geojson/cb_2018_08_tract_500k.json');
var tract_09 = require('../../Data/tract-data/USA-cb_tract_500k-geojson/cb_2018_09_tract_500k.json');
var tract_10 = require('../../Data/tract-data/USA-cb_tract_500k-geojson/cb_2018_10_tract_500k.json');
var tract_11 = require('../../Data/tract-data/USA-cb_tract_500k-geojson/cb_2018_11_tract_500k.json');
var tract_12 = require('../../Data/tract-data/USA-cb_tract_500k-geojson/cb_2018_12_tract_500k.json');
var tract_13 = require('../../Data/tract-data/USA-cb_tract_500k-geojson/cb_2018_13_tract_500k.json');
var tract_15 = require('../../Data/tract-data/USA-cb_tract_500k-geojson/cb_2018_15_tract_500k.json');
var tract_16 = require('../../Data/tract-data/USA-cb_tract_500k-geojson/cb_2018_16_tract_500k.json');
var tract_17 = require('../../Data/tract-data/USA-cb_tract_500k-geojson/cb_2018_17_tract_500k.json');
var tract_18 = require('../../Data/tract-data/USA-cb_tract_500k-geojson/cb_2018_18_tract_500k.json');
var tract_19 = require('../../Data/tract-data/USA-cb_tract_500k-geojson/cb_2018_19_tract_500k.json');
var tract_20 = require('../../Data/tract-data/USA-cb_tract_500k-geojson/cb_2018_20_tract_500k.json');
var tract_21 = require('../../Data/tract-data/USA-cb_tract_500k-geojson/cb_2018_21_tract_500k.json');
var tract_22 = require('../../Data/tract-data/USA-cb_tract_500k-geojson/cb_2018_22_tract_500k.json');
var tract_23 = require('../../Data/tract-data/USA-cb_tract_500k-geojson/cb_2018_23_tract_500k.json');
var tract_24 = require('../../Data/tract-data/USA-cb_tract_500k-geojson/cb_2018_24_tract_500k.json');
var tract_25 = require('../../Data/tract-data/USA-cb_tract_500k-geojson/cb_2018_25_tract_500k.json');
var tract_26 = require('../../Data/tract-data/USA-cb_tract_500k-geojson/cb_2018_24_tract_500k.json');
var tract_27 = require('../../Data/tract-data/USA-cb_tract_500k-geojson/cb_2018_27_tract_500k.json');
var tract_28 = require('../../Data/tract-data/USA-cb_tract_500k-geojson/cb_2018_28_tract_500k.json');
var tract_29 = require('../../Data/tract-data/USA-cb_tract_500k-geojson/cb_2018_29_tract_500k.json');
var tract_30 = require('../../Data/tract-data/USA-cb_tract_500k-geojson/cb_2018_30_tract_500k.json');
var tract_31 = require('../../Data/tract-data/USA-cb_tract_500k-geojson/cb_2018_31_tract_500k.json');
var tract_32 = require('../../Data/tract-data/USA-cb_tract_500k-geojson/cb_2018_32_tract_500k.json');
var tract_33 = require('../../Data/tract-data/USA-cb_tract_500k-geojson/cb_2018_33_tract_500k.json');
var tract_34 = require('../../Data/tract-data/USA-cb_tract_500k-geojson/cb_2018_34_tract_500k.json');
var tract_35 = require('../../Data/tract-data/USA-cb_tract_500k-geojson/cb_2018_35_tract_500k.json');
var tract_36 = require('../../Data/tract-data/USA-cb_tract_500k-geojson/cb_2018_36_tract_500k.json');
var tract_37 = require('../../Data/tract-data/USA-cb_tract_500k-geojson/cb_2018_37_tract_500k.json');
var tract_38 = require('../../Data/tract-data/USA-cb_tract_500k-geojson/cb_2018_38_tract_500k.json');
var tract_39 = require('../../Data/tract-data/USA-cb_tract_500k-geojson/cb_2018_39_tract_500k.json');
var tract_40 = require('../../Data/tract-data/USA-cb_tract_500k-geojson/cb_2018_40_tract_500k.json');
var tract_41 = require('../../Data/tract-data/USA-cb_tract_500k-geojson/cb_2018_41_tract_500k.json');
var tract_42 = require('../../Data/tract-data/USA-cb_tract_500k-geojson/cb_2018_42_tract_500k.json');
// var tract_43 = require('../../Data/tract-data/USA-cb_tract_500k-geojson/cb_2018_43_tract_500k.json');
var tract_44 = require('../../Data/tract-data/USA-cb_tract_500k-geojson/cb_2018_44_tract_500k.json');
var tract_45 = require('../../Data/tract-data/USA-cb_tract_500k-geojson/cb_2018_45_tract_500k.json');
var tract_46 = require('../../Data/tract-data/USA-cb_tract_500k-geojson/cb_2018_46_tract_500k.json');
var tract_47 = require('../../Data/tract-data/USA-cb_tract_500k-geojson/cb_2018_47_tract_500k.json');
var tract_48 = require('../../Data/tract-data/USA-cb_tract_500k-geojson/cb_2018_48_tract_500k.json');
var tract_49 = require('../../Data/tract-data/USA-cb_tract_500k-geojson/cb_2018_49_tract_500k.json');
var tract_50 = require('../../Data/tract-data/USA-cb_tract_500k-geojson/cb_2018_50_tract_500k.json');
var tract_51 = require('../../Data/tract-data/USA-cb_tract_500k-geojson/cb_2018_51_tract_500k.json');
var tract_53 = require('../../Data/tract-data/USA-cb_tract_500k-geojson/cb_2018_53_tract_500k.json');

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

/* END Base Setup of the Map*/


////////////////////////////// On click interactivity
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

info.update = function (props,state="") {
    this._div.innerHTML = "<h4>Test: </h4>" + (props ? "<b id='num_shapes'>" + props.name.toString() +", " + props.timestamp.toString() + " ms</b><br />" : "Starting Experiment");
};

info.addTo(map);
////////////END control that shows state info on hover

const starttime = Date.now();
function onEachFeature(feature, layer) {
    // console.log(feature.properties.NAME);
    if (feature.properties && feature.properties.NAME) {
        layer.bindPopup(feature.properties.NAME);
    }
    preplotpoints.push(feature.properties.NAME);
}
var preplotpoints = [];
editableLayers.addLayer(L.geoJSON(tract_01, {
        style: function (feature) {
            return {"color": "#f8984f"}
        },
        onEachFeature:onEachFeature
    })
);
console.log("Features in Alabama:" + preplotpoints.length.toString());

// editableLayers.addLayer(L.geoJSON(tract_02, {
//         style: function (feature) {
//             return {"color": "#f8984f"}
//         },
//         onEachFeature:onEachFeature
//     })
// );
// console.log("Features in Alabama+Alaska:" + preplotpoints.length.toString());
//
// editableLayers.addLayer(L.geoJSON(tract_04, {
//         style: function (feature) {
//             return {"color": "#f8984f"}
//         },
//         onEachFeature:onEachFeature
//     })
// );
//console.log("Features in Alabama+Alaska+Arizona:" + preplotpoints.length.toString());
// editableLayers.addLayer(L.geoJSON(tract_05, {
//         style: function (feature) {
//             return {"color": "#f8984f"}
//         },
//         onEachFeature:onEachFeature
//     })
// );
// console.log("Features in Alabama+Alaska+Arizona+Arkansas:" + preplotpoints.length.toString());
// editableLayers.addLayer(L.geoJSON(tract_06, {
//         style: function (feature) {
//             return {"color": "#f8984f"}
//         },
//         onEachFeature:onEachFeature
//     })
// );
editableLayers.addLayer(L.geoJSON(tract_08, {
        style: function (feature) {
            return {"color": "#f8984f"}
        },
        onEachFeature:onEachFeature
    })
);
editableLayers.addLayer(L.geoJSON(tract_09, {
        style: function (feature) {
            return {"color": "#f8984f"}
        },
        onEachFeature:onEachFeature
    })
);
editableLayers.addLayer(L.geoJSON(tract_10, {
        style: function (feature) {
            return {"color": "#f8984f"}
        },
        onEachFeature:onEachFeature
    })
);
editableLayers.addLayer(L.geoJSON(tract_11, {
        style: function (feature) {
            return {"color": "#f8984f"}
        },
        onEachFeature:onEachFeature
    })
);
editableLayers.addLayer(L.geoJSON(tract_53, {
        style: function (feature) {
            return {"color": "#f8984f"}
        },
        onEachFeature:onEachFeature
    })
);
// editableLayers.addLayer(L.geoJSON(tract_12, {
//         style: function (feature) {
//             return {"color": "#f8984f"}
//         },
//         onEachFeature:onEachFeature
//     })
// );
editableLayers.addLayer(L.geoJSON(tract_13, {
        style: function (feature) {
            return {"color": "#f8984f"}
        },
        onEachFeature:onEachFeature
    })
);
editableLayers.addLayer(L.geoJSON(tract_15, {
        style: function (feature) {
            return {"color": "#f8984f"}
        },
        onEachFeature:onEachFeature
    })
);
editableLayers.addLayer(L.geoJSON(tract_16, {
        style: function (feature) {
            return {"color": "#f8984f"}
        },
        onEachFeature:onEachFeature
    })
);
editableLayers.addLayer(L.geoJSON(tract_17, {
        style: function (feature) {
            return {"color": "#f8984f"}
        },
        onEachFeature:onEachFeature
    })
);
editableLayers.addLayer(L.geoJSON(tract_18, {
        style: function (feature) {
            return {"color": "#f8984f"}
        },
        onEachFeature:onEachFeature
    })
);
// editableLayers.addLayer(L.geoJSON(tract_19, {
//         style: function (feature) {
//             return {"color": "#f8984f"}
//         },
//         onEachFeature:onEachFeature
//     })
// );
// editableLayers.addLayer(L.geoJSON(tract_20, {
//         style: function (feature) {
//             return {"color": "#f8984f"}
//         },
//         onEachFeature:onEachFeature
//     })
// );
// editableLayers.addLayer(L.geoJSON(tract_21, {
//         style: function (feature) {
//             return {"color": "#f8984f"}
//         },
//         onEachFeature:onEachFeature
//     })
// );
// editableLayers.addLayer(L.geoJSON(tract_22, {
//         style: function (feature) {
//             return {"color": "#f8984f"}
//         },
//         onEachFeature:onEachFeature
//     })
// );
// editableLayers.addLayer(L.geoJSON(tract_23, {
//         style: function (feature) {
//             return {"color": "#f8984f"}
//         },
//         onEachFeature:onEachFeature
//     })
// );
// editableLayers.addLayer(L.geoJSON(tract_24, {
//         style: function (feature) {
//             return {"color": "#f8984f"}
//         },
//         onEachFeature:onEachFeature
//     })
// );
// editableLayers.addLayer(L.geoJSON(tract_25, {
//         style: function (feature) {
//             return {"color": "#f8984f"}
//         },
//         onEachFeature:onEachFeature
//     })
// );
// editableLayers.addLayer(L.geoJSON(tract_26, {
//         style: function (feature) {
//             return {"color": "#f8984f"}
//         },
//         onEachFeature:onEachFeature
//     })
// );
// editableLayers.addLayer(L.geoJSON(tract_27, {
//         style: function (feature) {
//             return {"color": "#f8984f"}
//         },
//         onEachFeature:onEachFeature
//     })
// );
// editableLayers.addLayer(L.geoJSON(tract_28, {
//         style: function (feature) {
//             return {"color": "#f8984f"}
//         },
//         onEachFeature:onEachFeature
//     })
// );
// editableLayers.addLayer(L.geoJSON(tract_29, {
//         style: function (feature) {
//             return {"color": "#f8984f"}
//         },
//         onEachFeature:onEachFeature
//     })
// );
// editableLayers.addLayer(L.geoJSON(tract_30, {
//         style: function (feature) {
//             return {"color": "#f8984f"}
//         },
//         onEachFeature:onEachFeature
//     })
// );
// editableLayers.addLayer(L.geoJSON(tract_31, {
//         style: function (feature) {
//             return {"color": "#f8984f"}
//         },
//         onEachFeature:onEachFeature
//     })
// );
// editableLayers.addLayer(L.geoJSON(tract_32, {
//         style: function (feature) {
//             return {"color": "#f8984f"}
//         },
//         onEachFeature:onEachFeature
//     })
// );
// editableLayers.addLayer(L.geoJSON(tract_33, {
//         style: function (feature) {
//             return {"color": "#f8984f"}
//         },
//         onEachFeature:onEachFeature
//     })
// );
// editableLayers.addLayer(L.geoJSON(tract_34, {
//         style: function (feature) {
//             return {"color": "#f8984f"}
//         },
//         onEachFeature:onEachFeature
//     })
// );
// editableLayers.addLayer(L.geoJSON(tract_35, {
//         style: function (feature) {
//             return {"color": "#f8984f"}
//         },
//         onEachFeature:onEachFeature
//     })
// );
// editableLayers.addLayer(L.geoJSON(tract_36, {
//         style: function (feature) {
//             return {"color": "#f8984f"}
//         },
//         onEachFeature:onEachFeature
//     })
// );
// editableLayers.addLayer(L.geoJSON(tract_37, {
//         style: function (feature) {
//             return {"color": "#f8984f"}
//         },
//         onEachFeature:onEachFeature
//     })
// );
// editableLayers.addLayer(L.geoJSON(tract_38, {
//         style: function (feature) {
//             return {"color": "#f8984f"}
//         },
//         onEachFeature:onEachFeature
//     })
// );
// editableLayers.addLayer(L.geoJSON(tract_39, {
//         style: function (feature) {
//             return {"color": "#f8984f"}
//         },
//         onEachFeature:onEachFeature
//     })
// );
// editableLayers.addLayer(L.geoJSON(tract_40, {
//         style: function (feature) {
//             return {"color": "#f8984f"}
//         },
//         onEachFeature:onEachFeature
//     })
// );
// editableLayers.addLayer(L.geoJSON(tract_41, {
//         style: function (feature) {
//             return {"color": "#f8984f"}
//         },
//         onEachFeature:onEachFeature
//     })
// );
// editableLayers.addLayer(L.geoJSON(tract_42, {
//         style: function (feature) {
//             return {"color": "#f8984f"}
//         },
//         onEachFeature:onEachFeature
//     })
// );
// editableLayers.addLayer(L.geoJSON(tract_44, {
//         style: function (feature) {
//             return {"color": "#f8984f"}
//         },
//         onEachFeature:onEachFeature
//     })
// );
// editableLayers.addLayer(L.geoJSON(tract_45, {
//         style: function (feature) {
//             return {"color": "#f8984f"}
//         },
//         onEachFeature:onEachFeature
//     })
// );
// editableLayers.addLayer(L.geoJSON(tract_46, {
//         style: function (feature) {
//             return {"color": "#f8984f"}
//         },
//         onEachFeature:onEachFeature
//     })
// );
// editableLayers.addLayer(L.geoJSON(tract_47, {
//         style: function (feature) {
//             return {"color": "#f8984f"}
//         },
//         onEachFeature:onEachFeature
//     })
// );
// editableLayers.addLayer(L.geoJSON(tract_48, {
//         style: function (feature) {
//             return {"color": "#f8984f"}
//         },
//         onEachFeature:onEachFeature
//     })
// );
// editableLayers.addLayer(L.geoJSON(tract_49, {
//         style: function (feature) {
//             return {"color": "#f8984f"}
//         },
//         onEachFeature:onEachFeature
//     })
// );
// editableLayers.addLayer(L.geoJSON(tract_50, {
//         style: function (feature) {
//             return {"color": "#f8984f"}
//         },
//         onEachFeature:onEachFeature
//     })
// );
// editableLayers.addLayer(L.geoJSON(tract_51, {
//         style: function (feature) {
//             return {"color": "#f8984f"}
//         },
//         onEachFeature:onEachFeature
//     })
// );

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