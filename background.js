var refreshType;
var currInterval;
var currUnit;
var currTime;
var runningTime;
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        
        switch (request.directive) {
            case "save-event":
                
                if(request.refreshtype === 'interval') {

                    chrome.storage.local.set({"refreshtype":request.refreshtype});
                    chrome.storage.local.set({"interval":request.interval});
                    chrome.storage.local.set({"unit":request.unit});
                }else if (request.refreshtype === 'time') {
                    
                    chrome.storage.local.set({"refreshtype": request.refreshtype});
                    chrome.storage.local.set({"time":request.time});

                }
                
                sendResponse({}); // sending back empty response to sender
                return true;
            case "on-load-event":
                // chrome.storage.local.get("refreshtype", function(response) {
                    
                //     if(response == false) {
                //         chrome.storage.local.set({"refreshtype":"interval"});
                //         chrome.storage.local.set({"interval":5000});
                //         chrome.storage.local.set({"unit":"seconds"});
                //     }

                //     sendResponse({refreshtype: "interval", interval:5000, unit:"seconds"});
                // });
                chrome.storage.local.get(['refreshtype','interval','unit', 'time'], function (config) { 
    
                        refreshType = config.refreshtype;
                        currInterval = config.interval;
                        currUnit = config.unit;
                        currTime = config.time;
                        sendResponse(config);
                });
            case "get-config":
                chrome.storage.local.get(['refreshtype','interval','unit', 'time'], function (config) { 
                    sendResponse(config);
                });
                return true;
            case "start-event":
                sendResponse({});
                break;
            default:
                // when request directive doesn't match
                console.log("Unmatched request of '" + request + "' from script to background.js from " + sender);
        }

       
    }
);

chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([
        {
          conditions: [new chrome.declarativeContent.PageStateMatcher({pageUrl:{hostEquals: 'app.powerbi.com', schemes:['https']}})],
          actions: [new chrome.declarativeContent.ShowAction()]
        }
      ]);
    });
  });

