var L = require('leaflet')
// var MiniMap = require('leaflet-minimap');
// var main = require('./app.js')

function getRandomLatLng(map) {
    var bounds = map.getBounds(),
        southWest = bounds.getSouthWest(),
        northEast = bounds.getNorthEast(),
        lngSpan = northEast.lng - southWest.lng,
        latSpan = northEast.lat - southWest.lat;

    return new L.LatLng(
        southWest.lat + latSpan * Math.random(),
        southWest.lng + lngSpan * Math.random());
}
exports.getRandomLatLng = getRandomLatLng;

function getRandomGeoJson(map,type,n_points){
    // https://geojsonlint.com/ - for samples
    var i;
    var templatlng = [];

    if(type === "Point"){
        ll = getRandomLatLng(map);
        templatlng = [ll.lng,ll.lat];
        var geojson = {
            "type": "Point",
            "coordinates": templatlng
        }
    }
    else if(type === "LineString"){
        for( i = 0 ; i < 2; i++){
            ll = getRandomLatLng(map);
            templatlng.push([ll.lng,ll.lat]);
        }
        var geojson = {
            "type": "LineString",
            "coordinates": templatlng
        }
    }
    else if( type === "Polygon"){
        for( i = 0 ; i < n_points; i++){
            ll = getRandomLatLng(map);
            templatlng.push([ll.lng,ll.lat])
        }
        var geojson = {
            "type": "Polygon",
            "coordinates": [
                templatlng
            ]
        }
    }
    else{
        var geojson = {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            -80.724878,
                            35.265454
                        ],
                        [
                            -80.722646,
                            35.260338
                        ],
                        [
                            -80.720329,
                            35.260618
                        ],
                        [
                            -80.718698,
                            35.260267
                        ],
                        [
                            -80.715093,
                            35.260548
                        ],
                        [
                            -80.71681,
                            35.255361
                        ]
                    ]
                ]
            },
            "properties": {
                "name": "Plaza Road Park"
            }
        }
    }

    return geojson;
}
exports.getRandomGeoJson = getRandomGeoJson;
// function getnRandomLAtLngs(map){
//     //map.clear();
//     var preplotpoints = [];
//     for(i = 0; i < 100;i++){
//         var point = this.getRandomLatLng(map)
//         preplotpoints.push(point);
//     }
// // //Loop through the markers array
// //     for (var i=0; i<markers.length; i++) {
// //
// //         var lon = markers[i][0];
// //         var lat = markers[i][1];
// //         var popupText = markers[i][2];
// //
// //         var markerLocation = new L.LatLng(lat, lon);
// //         var marker = new L.Marker(markerLocation);
// //         map.addLayer(marker);
// //
// //         marker.bindPopup(popupText);
// //
// //     }
//
// }

// module.exports = {
//     getRandomLatLng(),
// }
