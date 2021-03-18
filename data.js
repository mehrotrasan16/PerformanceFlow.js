import {onEachFeature,preplotpoints,editableLayers, info, mypagefn} from "./app";

export async function getLoadData(num_states){
    var stateshapes = [];
    // let num_states = 30
    const starttime = Date.now();
//https://medium.com/@maptastik/loading-external-geojson-a-nother-way-to-do-it-with-jquery-c72ae3b41c01 dynamically load geojson
    for(var i = 1 ; i <= num_states; i++){
        let statenumber=(i < 10)? '0'+i.toString():i.toString()
        let filename='cb_2018_'+statenumber+'_tract_500k.json';
        stateshapes[i] = $.ajax({
            url: "https://raw.githubusercontent.com/mehrotrasan16/us-census-tracts-shapefiles-and-geojson/master/USA-cb_tract_500k-geojson/"+filename,
            dataType: "json",
            success: function (data){
                console.log(filename + " Retrieved");
                // console.log(performanceAnalyzerData);
                editableLayers.addLayer(L.geoJSON(data,{
                        onEachFeature: onEachFeature
                    })
                );

                var updateProps = {
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
                if(i === num_states-1){
                    console.log(" plotting "+ preplotpoints.length.toString() +"stored tracts takes " + ((Date.now() - starttime)/1000).toString() +" seconds ");
                    console.log(" plotting "+ preplotpoints.length.toString() +"stored tracts takes " + (performance.memory.usedJSHeapSize / 1000000).toString() + " Mbytes ");
                }
            }
        })
    }
}

export function getGeneratePoints(num_points) {
    const starttime = Date.now();
    let geojson_fc = random.point(num_points,[-60.95, 25.84 , -130.67, 49.38]); //WSEN
    console.log(geojson_fc);
    editableLayers.addLayer(L.geoJson(geojson_fc,{
        onEachFeature: onEachFeature,
        pointToLayer: function (geoJsonPoint,latlng){
            return L.circle(latlng);
        }
    }));

    var updateProps = {
        name: preplotpoints.length,
        timestamp: Date.now() - starttime,
    };

    info.update(updateProps);

    console.log(" plotting "+ preplotpoints.length.toString() +"stored points takes " + ((Date.now() - starttime)/1000).toString() +" seconds ");
    console.log(" plotting "+ preplotpoints.length.toString() +"stored points takes " + (performance.memory.usedJSHeapSize / 1000000).toString() + " Mbytes ");

}

export async function getLoadPoints(num_point_files){
    var points = [];
    const starttime = Date.now();
    performance.mark("all points: loading");
    for(var i = 1 ; i <= num_point_files; i++){
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

                var updateProps = {
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

export async function getLoadShapes(num_shape_files){
    var shapes = [];
    const starttime = Date.now();
    performance.mark("all shapes: loading");
    for(var i = 1 ; i <= num_shape_files; i++){
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
                var updateProps = {
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
                if(i === num_shape_files-1){
                    console.log(" plotting "+ preplotpoints.length.toString() +"stored shapes takes " + ((Date.now() - starttime)/1000).toString() +" seconds ");
                    console.log(" plotting "+ preplotpoints.length.toString() +"stored shapes takes " + (performance.memory.usedJSHeapSize / 1000000).toString() + " Mbytes ");
                }
            }
        })
    }
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// module.exports = {
//     map,getLoadPoints, getLoadData,getLoadShapes
// }
/** Helper class to handle loading training and test data. */
// export class PerfDataset {
//     constructor() {
//         // Arrays to hold the data.
//         this.trainFeatures = null;
//         this.trainTarget = null;
//         this.testFeatures = null;
//         this.testTarget = null;
//     }
//
//     get numFeatures() {
//         // If numFetures is accessed before the data is loaded, raise an error.
//         if (this.trainFeatures == null) {
//             throw new Error('\'loadData()\' must be called before numFeatures')
//         }
//         return this.trainFeatures[0].length;
//     }
//
//     /** Loads training and test data. */
//     async loadData(features,values) {
//         [this.trainFeatures, this.trainTarget, this.testFeatures, this.testTarget] =
//             await Promise.all([
//
//             ]);
//
//         shuffle(this.trainFeatures, this.trainTarget);
//         shuffle(this.testFeatures, this.testTarget);
//     }
// }

// export const featureDescriptions = ["resourceLoad","dataLoad","totalData","jsHeapRatio"];
//
// /**
//  * Shuffles data and target (maintaining alignment) using Fisher-Yates
//  * algorithm.flab
//  */
// export function shuffle(data, target) {
//     let counter = data.length;
//     let temp = 0;
//     let index = 0;
//     while (counter > 0) {
//         index = (Math.random() * counter) | 0;
//         counter--;
//         // data:
//         temp = data[counter];
//         data[counter] = data[index];
//         data[index] = temp;
//         // target:
//         temp = target[counter];
//         target[counter] = target[index];
//         target[index] = temp;
//     }
// };