chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        switch (request.directive) {
            case "save-event":
                chrome.storage.sync.set({"reporturl": request.reporturl, "reportinterval": request.reportinterval })
                sendResponse({}); // sending back empty response to sender
                break;
            case "on-load-event":
                chrome.storage.sync.get("config-data", function (config) { 
                    sendResponse(config);
                 });
            default:
                // when request directive doesn't match
                console.log("Unmatched request of '" + request + "' from script to background.js from " + sender);
        }
    }
);