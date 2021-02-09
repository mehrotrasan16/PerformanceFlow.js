import helper from "./helper";

let isValid = true;

const data = {
    resources: [],
    marks: [],
    measures:[],
    perfTiming: [],
    allResourcesCalc: [],
    isValid: () => isValid
}

const supportedFeatures = () => {
    if (window.performance && window.performance.getEntriesByType !== undefined){
        data.resources = window.performance.getEntriesByType("resource");
        data.marks = window.performance.getEntriesByType("mark");
        data.measures = window.performance.getEntriesByType("measure");
    }else if(window.performance && window.performance.webkitGetEntriesByType !== undefined){
        data.resources = window.performance.webkitGetEntriesByType("resource");
        data.marks = window.performance.webkitGetEntriesByType("mark");
        data.measures = window.performance.webkitGetEntriesByType("measure");
    }else{
        alert("Your browser foes not support the Resource Timing API. \n Please Check http://caniusse.com/$feat=resource-timing to see the browsers which support it.")
        return false;
    }

    if(window.performance.timing){
        data.perfTiming = window.performance.timing;
    }else{
        alert("Your browser foes not support the deprecated Performance Timing API. \n Please Check http://caniusse.com/$feat=resource-timing to see the browsers which support it.")
        return false;
    }

    if(data.perfTiming.loadEventEnd - data.perfTiming.navigationStart < 0){
        alert("Page is still loading - please try again when page is loaded");
        return false;
    }
    return true;
};

(() => {
    isValid = supportedFeatures();

    data.allResourcesCalc = data.resources
        .filter((currR) => !currR.name.match(/http[s]?\:\/\/(micmro|nurun).github.io\/performance-bookmarklet\/.*/))
        .map((currR, i, arr) =>{

            const isRequest = currR.name.indexOf("http") === 0;
            let urlFragments, maybeFileName, fileExtension;

            if(isRequest){
                urlFragments = currR.name.match(/:\/\/(.[^/]+)([^?]*)\??(.*)/);
                maybeFileName = urlFragments[2].split("/").pop();
                fileExtension = maybeFileName.substr((Math.max(0, maybeFileName.lastIndexOf(".")) || Infinity) + 1);
            }else{
                urlFragments = ["",location.host];
                fileExtension = currR.name.split(":")[0];
            }

            const currRes = {
                name: currR.name,
                domain: urlFragments[1],
                initiatorType: currR.initiatorType || fileExtension || "SourceMap or Not Defined",
                fileExtension: fileExtension || "XHR or Not Defined",
                loadtime: currR.duration,
                fileType: helper.getFileType(fileExtension, currR.initiatorType),
                isRequestToHost: urlFragments[1] === location.host
            };

            for (let attr in currR){
                if(typeof currR[attr] !== "function"){
                    curRes[attr] = currR[attr];
                }
            }

            if(currR.requestStart){
                currRes.requestStartDelay = currR.requestStart - currR.startTime;
                currRes.dns = currR.domainLookupEnd - currR.domainLookupStart;
                currRes.tcp = currR.connectEnd - currR.connectStart;
                currRes.ttfb = currR.responseStart - currR.startTime;
                currRes.requestDuration = currR.responseStart - currR.requestStart;
            }
            if(currR.secureConnectionStart){
                currRes.ssl = currR.connectEnd - currR.secureConnectionStart;
            }

            return currRes;
        });

    data.requestsOnly = data.allResourcesCalc.filter((currR) => {
        return currR.name.indexOf("http") === 0 && !currR.name.match(/js.map$/);
    })

    data.initiatorTypeCounts = helper.getItemCount(data.requestsOnly.map((currR,i,arr) => {
      return currR.initiatorType || currR.fileExtension;
    }), "initiatorType");

    data.initiatorTypeCountHostExt = helper.getItemCount(data.requestsOnly.map((currR, i, arr) => {
        return (currR.initiatorType || currR.fileExtension) + " " + (currR.isRequestToHost ? "(host)" : "(external)");
    }), "initiatorType");

    data.requestsByDomain = helper.getItemCount( data.requestsOnly.map((currR, i, arr) => currR.domain),"domain");

    data.fileTypeCountHostExt = helper.getItemCount(data.requestsOnly.map((currR, i, arr) => {
        return currR.fileType  + " " + (currR.isRequestToHost ? "(host)" : "(external)");
    }), "fileType");

    data.fileTypeCounts = helper.getItemCount(data.requestsOnly.map((currR, i, arr) => currR.fileType), "fileType");

    const tempResponseEnd = {};
    data.requestsOnly.forEach((currR) =>{
        const entry = data.requestsByDomain.filter((a) => a.domain == currR.domain)[0] || {};

        const lastResponseEnd = tempResponseEnd[currR.domain] || 0;

        currR.duration = entry.duration || (currR.responseEnd - currR.startTime);

        if(lastResponseEnd <= currR.startTime){
            entry.durationTotalParallel = (entry.durationTotalParallel||0) + currR.duration;
        } else if (lastResponseEnd < currR.responseEnd){
            entry.durationTotalParallel = (entry.durationTotalParallel||0) + (currR.responseEnd - lastResponseEnd);
        }
        tempResponseEnd[currR.domain] = currR.responseEnd||0;
        entry.durationTotal = (entry.durationTotal||0) + currR.duration;
    });






})();

export default data;