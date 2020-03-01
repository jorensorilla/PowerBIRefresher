
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
                break;
            case "on-load-event":
                
                break;
            case "refresh-event":

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
          conditions: [new chrome.declarativeContent.PageStateMatcher({pageUrl:{hostEquals: 'https://app.powerbi.com/groups/me/apps/*/reports/*'}})],
          actions: [new chrome.declarativeContent.ShowAction()]
        }
      ]);
    });
  });