import performanceAnalyzerHelper from "./performance-analyzer-helper";

let isValid = true;

const performanceAnalyzerData = {
    resources: [],
    marks: [],
    measures:[],
    perfTiming: [],
    allResourcesCalc: [],
    isValid: () => isValid
}

const supportedFeatures = () => {
    if (window.performance && window.performance.getEntriesByType !== undefined){
        performanceAnalyzerData.resources = window.performance.getEntriesByType("resource");
        performanceAnalyzerData.marks = window.performance.getEntriesByType("mark");
        performanceAnalyzerData.measures = window.performance.getEntriesByType("measure");
    }else if(window.performance && window.performance.webkitGetEntriesByType !== undefined){
        performanceAnalyzerData.resources = window.performance.webkitGetEntriesByType("resource");
        performanceAnalyzerData.marks = window.performance.webkitGetEntriesByType("mark");
        performanceAnalyzerData.measures = window.performance.webkitGetEntriesByType("measure");
    }else{
        alert("Your browser foes not support the Resource Timing API. \n Please Check http://caniusse.com/$feat=resource-timing to see the browsers which support it.")
        return false;
    }

    if(window.performance.timing){
        performanceAnalyzerData.perfTiming = window.performance.timing;
    }else{
        alert("Your browser foes not support the deprecated Performance Timing API. \n Please Check http://caniusse.com/$feat=resource-timing to see the browsers which support it.")
        return false;
    }

    if(performanceAnalyzerData.perfTiming.loadEventEnd - performanceAnalyzerData.perfTiming.navigationStart < 0){
        alert("Page is still loading - please try again when page is loaded");
        return false;
    }
    return true;
};

(() => {
    isValid = supportedFeatures();

    performanceAnalyzerData.allResourcesCalc = performanceAnalyzerData.resources
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
                fileType: performanceAnalyzerHelper.getFileType(fileExtension, currR.initiatorType),
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

    performanceAnalyzerData.requestsOnly = performanceAnalyzerData.allResourcesCalc.filter((currR) => {
        return currR.name.indexOf("http") === 0 && !currR.name.match(/js.map$/);
    })

    performanceAnalyzerData.initiatorTypeCounts = performanceAnalyzerHelper.getItemCount(performanceAnalyzerData.requestsOnly.map((currR, i, arr) => {
      return currR.initiatorType || currR.fileExtension;
    }), "initiatorType");

    performanceAnalyzerData.initiatorTypeCountHostExt = performanceAnalyzerHelper.getItemCount(performanceAnalyzerData.requestsOnly.map((currR, i, arr) => {
        return (currR.initiatorType || currR.fileExtension) + " " + (currR.isRequestToHost ? "(host)" : "(external)");
    }), "initiatorType");

    performanceAnalyzerData.requestsByDomain = performanceAnalyzerHelper.getItemCount( performanceAnalyzerData.requestsOnly.map((currR, i, arr) => currR.domain),"domain");

    performanceAnalyzerData.fileTypeCountHostExt = performanceAnalyzerHelper.getItemCount(performanceAnalyzerData.requestsOnly.map((currR, i, arr) => {
        return currR.fileType  + " " + (currR.isRequestToHost ? "(host)" : "(external)");
    }), "fileType");

    performanceAnalyzerData.fileTypeCounts = performanceAnalyzerHelper.getItemCount(performanceAnalyzerData.requestsOnly.map((currR, i, arr) => currR.fileType), "fileType");

    const tempResponseEnd = {};
    performanceAnalyzerData.requestsOnly.forEach((currR) =>{
        const entry = performanceAnalyzerData.requestsByDomain.filter((a) => a.domain == currR.domain)[0] || {};

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

    //Request counts
    performanceAnalyzerData.hostRequests = performanceAnalyzerData.requestsOnly
        .filter((domain) => domain.domain === location.host).length;

    performanceAnalyzerData.currAndSubdomainRequests = performanceAnalyzerData.requestsOnly
        .filter((domain) => domain.domain.split(".").slice(-2).join(".") === location.host.split(".").slice(-2).join("."))
        .length;

    performanceAnalyzerData.crossDocDomainRequests = performanceAnalyzerData.requestsOnly
        .filter((domain) => !performanceAnalyzerHelper.endsWith(domain.domain, document.domain)).length;

    performanceAnalyzerData.hostSubdomains = performanceAnalyzerData.requestsByDomain
        .filter((domain) => performanceAnalyzerHelper.endsWith(domain.domain, location.host.split(".").slice(-2).join(".")) && domain.domain !== location.host)
        .length;


    performanceAnalyzerData.slowestCalls = [];
    performanceAnalyzerData.average = undefined;

    if(performanceAnalyzerData.allResourcesCalc.length > 0){
        performanceAnalyzerData.slowestCalls = performanceAnalyzerData.allResourcesCalc
            .filter((a) => a.name !== location.href)
            .sort((a, b) => b.duration - a.duration);

        performanceAnalyzerData.average = Math.floor(performanceAnalyzerData.slowestCalls.reduceRight((a, b) => {
            if(typeof a !== "number"){
                return a.duration + b.duration
            }
            return a + b.duration;
        }) / performanceAnalyzerData.slowestCalls.length);
    }

})();

export default performanceAnalyzerData;