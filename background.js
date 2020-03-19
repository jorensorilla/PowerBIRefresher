
var interval = 120000; // default

// Converts text time in h:mm AM/PM format to Date
function convertTimeToDate(time){
    var isPM = time.match('PM')?true:false;
    var timeArr = time.split(':')
    var hours;

    var seconds = timeArr[1].split(' ')[0];
    
    if(isPM) {
    		hours = parseInt(timeArr[0])
    		if (hours == 12) {
        	hours = '12';
        } else {
        	hours+=12;
        }
         
        
    } else {
        hours = parseInt(timeArr[0])
        if (hours == 12) {
        	hours = '00';
        }
    }
   
    if (hours.toString().length === 1){
    	 hours='0' + hours;
    }
    var today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, seconds, 0)
    

}

// Calculates the number of milliseconds to the specified time (in h:mm AM/PM format). 
// If the specified time has already elapsed on the current day, then the number of milliseconds
// from now to the specified time on the following day will be calculated.
function calculateTimeInMs (time) {

    var dateInput = convertTimeToDate(time);
    var diffMs = dateInput.getTime() - Date.now();
    var timeInMs;
    if(diffMs >= 0) {
        timeInMs = diffMs;
    }else {
        dateInput.setDate(dateInput.getDate() + 1);
        timeInMs = dateInput.getTime() - Date.now();

    }

    return timeInMs;
}

// Sends a message to content.js to trigger the refresh routine
function triggerRefresh(){
    chrome.tabs.query({ url: "https://app.powerbi.com/groups/me/apps/*"}, function(tabs) {
        // try {
            chrome.tabs.sendMessage(tabs[0].id, {directive: "trigger-refresh"});
        // } catch (exception) {
        //     console.log("Current tab is invalid!");
        // }
        
    });
}


function updateInterval(config) {
    // get interval in milliseconds
    if (config.refreshtype === 'interval') {
        interval = config.interval;
    } else {
        interval = calculateTimeInMs(config.text);
    }

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    
    console.log("Interval set to " + this.interval + " on " + dateTime);
   
}

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
                alert("Configurations saved!");
                chrome.alarms.clearAll(); // clears all active alarms
                chrome.runtime.reload(); // reloads the extension (requires the 'management' permission);
                sendResponse({}); // sending back empty response to sender
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
            default:
                // when request directive doesn't match
                console.log("Unmatched request of '" + request.directive + "' from script to background.js from " + sender);
        }

        return true;
    }
);

// execute when page loads
chrome.webNavigation.onCompleted.addListener(function(details) {
   
    
    // if (!is_active) {
    //     console.log("Clearing interval...");
    //     //clearInterval(timeout_id);
    //     chrome.alarms.create("refresh", {when: Date.now() + this.interval });
    // } 

    chrome.storage.local.get(['refreshtype','interval','unit', 'time', 'text'], function (config) { 

            
            updateInterval(config);
            console.log("Refresh due in " + interval/1000 + " seconds...");
            chrome.alarms.get("refresh", function (alarm) {
                if(alarm == null) {
                    chrome.alarms.create("refresh", {when: Date.now() + interval });
                    console.log("Alarm created.");
                } else {
                    console.log("Alarm already created.");
                }
        
            });
    });
    
}, {
    url: [{
        hostContains: 'app.powerbi.com'
    }]
});

chrome.alarms.onAlarm.addListener(function(alarm) {
    console.log("refresh triggered");
    triggerRefresh();
});

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

