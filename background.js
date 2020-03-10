var timeout_id;
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
                    chrome.storage.local.set({"text":request.text});

                }
                
                sendResponse({}); // sending back empty response to sender
                break;
            case "on-load-event":
                // chrome.storage.local.get("refreshtype", function(response) {
                    
                //     if(response == false) {
                //         chrome.storage.local.set({"refreshtype":"interval"});
                //         chrome.storage.local.set({"interval":5000});
                //         chrome.storage.local.set({"unit":"seconds"});
                //     }

                //     sendResponse({refreshtype: "interval", interval:5000, unit:"seconds"});
                // });
                chrome.storage.local.get(['refreshtype','interval','unit', 'time', 'text'], function (config) { 
    
                        refreshType = config.refreshtype;
                        currInterval = config.interval;
                        currUnit = config.unit;
                        currTime = config.time;
                        sendResponse(config);
                });
                break;
            case "get-config":
                chrome.storage.local.get(['refreshtype','interval','unit', 'time', 'text'], function (config) { 
                    sendResponse(config);
                });
                break;
            case "refresh-event":
                timeout_id=request.timeout_id;
                sendResponse({});
                break;
            case "stop-event":
                console.log("From background js : " + timeout_id);
                sendResponse({timeout_id:this.timeout_id});
                break;
            default:
                // when request directive doesn't match
                console.log("Unmatched request of '" + request.directive + "' from script to background.js from " + sender);
        }

        return true;
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

