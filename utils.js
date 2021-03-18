var L = require('leaflet')
var webVitals = require('web-vitals');
var correlation = require('node-correlation');
var Cookies = require('js-cookie');
// var MiniMap = require('leaflet-minimap');


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

function network_performance_timings() {
    var p = {};

    p.prerequestTime = performance.timing.requestStart - performance.timing.navigationStart;
    p.latencyTime = performance.timing.responseStart - performance.timing.requestStart;
    p.serverTime = performance.timing.responseEnd - performance.timing.responseStart;
    p.domLoadingTime = performance.timing.domInteractive - performance.timing.responseEnd;
    p.domCompleteTime = performance.timing.domComplete - performance.timing.domInteractive;
    p.loadTime = performance.timing.loadEventEnd - performance.timing.domComplete;

    // Test to make sure these two variables match.
    // p.onloadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    p.totalTime = p.prerequestTime + p.latencyTime + p.serverTime + p.domLoadingTime + p.domCompleteTime + p.loadTime;

    p.dns  = performance.timing.domainLookupEnd - performance.timing.domainLookupStart,
    p.tcp  = performance.timing.connectEnd - performance.timing.connectStart,
    p.ssl = performance.timing.requestStart - performance.timing.secureConnectionStart,
    p.waitingTime = performance.timing.responseStart - performance.timing.requestStart,
    p.contentTime = performance.timing.responseEnd - performance.timing.responseStart,
    p.requestTime = performance.timing.responseEnd - performance.timing.requestStart,
    p.networkTime = (p.dns + p.tcp + p.waitingTime + p.contentTime),
    p.pageloadTime = performance.timing.loadEventStart - performance.timing.navigationStart;

    return p;
}

exports.network_perf_info = network_performance_timings;

function memory_performance_info() {
    var p = {};

    if(performance.memory) {
        p.jsHeapSizeLimit = performance.memory.jsHeapSizeLimit;
        p.totalJSHeapSize = performance.memory.totalJSHeapSize;
        p.usedJSHeapSize = performance.memory.usedJSHeapSize;
    }
    return p;
}

exports.memory_performance_info = memory_performance_info;

function get_web_vitals() {
    var p = {};
    console.log("web-vitals:");
    webVitals.getTTFB((metric) => {p.TTFB = metric;
    //console.log(metric)
    });
    webVitals.getFCP((metric) => {p.FCP = metric;
    //console.log(metric)
    });
    webVitals.getCLS((metric) => {p.CLS = metric;
    //console.log(metric)
    });
    webVitals.getLCP((metric) => {p.LCP = metric;
    //console.log(metric)
    });
    webVitals.getFID((metric) => {p.FID = metric;
    //console.log(metric)
    });
    return p;
}

exports.get_web_vitals = get_web_vitals;

function calculateCorrelation(matrix){
    if(!matrix){
        console.log("undefined matrix")
        return;
    }
    // console.log("here");
    // console.log(matrix);
    const correlations = [];
    for(let numColumn = 0; numColumn < matrix[0].length; numColumn ++) {
        const rowCorrelations = [];
        for(let numColumn2 = 0; numColumn2 < matrix[0].length; numColumn2 ++) {
            const array1 = [];
            const array2 = [];
            for(let index in matrix) {
                array1.push(matrix[index][numColumn]);
                array2.push(matrix[index][numColumn2]);
            }
            const correlationValue = correlation.calc(array1, array2);
            rowCorrelations.push(correlationValue);
        }
        correlations.push(rowCorrelations);
    }

    return correlations;
}

exports.calculateCorrelation = calculateCorrelation;


function drawCorrelogram(cookiename) {

    // http://plnkr.co/edit/RJk5vmROVAJGPHIPutVR?p=preview&preview
//     let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
// width=600,height=300,left=100,top=100`;
    // var newWindow = window.open('','test',params);
    // // Graph dimension
    // var margin = {top: 20, right: 20, bottom: 20, left: 20},
    //     width = 430 - margin.left - margin.right,
    //     height = 430 - margin.top - margin.bottom;
    // // Create the svg area
    // var svg = d3.select("#my_dataviz")
    //     .append("svg")
    //     .attr("width", width + margin.left + margin.right)
    //     .attr("height", height + margin.top + margin.bottom)
    //     .append("g")
    //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var rows = JSON.parse(Cookies.get(cookiename));
    // console.log(rows);

    var data = [];
    var cols = ["resourceLoad","dataLoad","totalData","jsHeapRatio"]; //"connType","connMaxSpeed"
    for(i=0; i< rows.length; i++){
        for(j=0; j < cols.length; j++){
            data.push({
                x:cols[i],
                y:cols[j],
                value:rows[i][j]
            });
        }
    }
    // console.log(performanceAnalyzerData);
    var margin = {
            top: 25,
            right: 80,
            bottom: 25,
            left: 25
        },
        width = 500 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom,
        domain = d3.set(data.map(function(d) {
            return d.x
        })).values(),
        num = Math.sqrt(data.length),
        color = d3.scaleLinear()
            .domain([-1, 0, 1])
            .range(["#B22222", "#fff", "#000080"]);

    var x = d3.scalePoint()
            .range([0, width])
            .domain(domain),

        y = d3.scalePoint()
            .range([0, height])
            .domain(domain),

        xSpace = x.range()[1] - x.range()[0],

        ySpace = y.range()[1] - y.range()[0];

    ySpace = y.range()[1] - y.range()[0];

    var svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var cor = svg.selectAll(".cor")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "cor")
        .attr("transform", function(d) {
            return "translate(" + x(d.x) + "," + y(d.y) + ")";
        });

    cor.append("rect")
        .attr("width", xSpace/10)
        .attr("height", ySpace/10)
        .attr("x", -xSpace / 20)
        .attr("y", -ySpace / 20)

    cor.filter(function(d){
        var ypos = domain.indexOf(d.y);
        var xpos = domain.indexOf(d.x);
        for (var i = (ypos + 1); i < num; i++){
            if (i === xpos) return false;
        }
        return true;
    })
        .append("text")
        .attr("y", 5)
        .text(function(d) {
            if (d.x === d.y) {
                return d.x;
            } else {
                return (d.value)? d.value.toFixed(2): "Null";
            }
        })
        .style("fill", function(d){
            if (d.value === 1) {
                return "#000";
            } else {
                return (d.value)? color(d.value): "#000";
            }
        });

    cor.filter(function(d){
        var ypos = domain.indexOf(d.y);
        var xpos = domain.indexOf(d.x);
        for (var i = (ypos + 1); i < num; i++){
            if (i === xpos) return true;
        }
        return false;
    })
        .append("circle")
        .attr("r", function(d){
            return (d.value)? (width / (num * 2)) * (Math.abs(d.value) + 0.1): 0.01;
        })
        .style("fill", function(d){
            if (d.value === 1) {
                return "#000";
            } else {
                return (d.value)? color(d.value):"#0F0";
            }
        });

    var aS = d3.scaleLinear()
        .range([-margin.top + 5, height + margin.bottom - 5])
        .domain([1, -1]);

    var yA = d3.axisRight()
        .scale(aS)
        .tickPadding(7);

    var aG = svg.append("g")
        .attr("class", "y axis")
        .call(yA)
        .attr("transform", "translate(" + (width + margin.right / 2) + " ,0)")

    var iR = d3.range(-1, 1.01, 0.01);
    var h = height / iR.length + 3;
    iR.forEach(function(d){
        aG.append('rect')
            .style('fill',color(d))
            .style('stroke-width', 0)
            .style('stoke', 'none')
            .attr('height', h)
            .attr('width', 10)
            .attr('x', 0)
            .attr('y', aS(d))
    });

    Cookies.remove(cookiename);
};

exports.drawCorrelogram = drawCorrelogram;