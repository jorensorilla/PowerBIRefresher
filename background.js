/**
 *  Background script of the extension. Receives events from the options.js and content.js.
 *  Mostly interfaces with the Chrome API
 * 
 */


var interval = 120000; // default interval

/** 
 *  Converts the specified time to a Date object
 *  @param  {String} time Time in h:mm AM/PM 12 hour format 
 *  @return {Date}        Current day with the specified time
 * 
 */

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

/**
 *  Calculates the number of milliseconds from the current time to the specified time 
 *  @param  {String} time Time in h:mm AM/PM 12 hour format 
 *  @return {Number}      Number of milliseconds from the current time to the specified time.
 *                        If the specified time has already elapsed on the current day, then 
 *                        the number of milliseconds from now to the specified time on the 
 *                        following day will be calculated.
 */ 

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

/**
 *  Sends a message to content.js to trigger the refresh routine
 * 
 */
function triggerRefresh(){
    chrome.tabs.query({ url: "https://app.powerbi.com/groups/me/apps/*"}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {directive: "trigger-refresh"});
    });
}

/**
 * Updates the interval object
 * @param {JSON} config JSON containing configuration data from chrome.storage.local
 */

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

/**
 * Listens to events from options.js and content.js
 * 
 */
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
                    chrome.storage.local.set({"text":request.text});

                }
                alert("Configurations saved!");
                chrome.alarms.clearAll(); // clears all active alarms
                chrome.runtime.reload(); // reloads the extension (requires the 'management' permission);
                sendResponse({}); // sending back empty response to sender
                break;
            case "get-config":
                chrome.storage.local.get(['refreshtype','interval','unit', 'text'], function (config) { 
                    sendResponse(config);
                });
                break;
            default:
                // when request directive doesn't match
                console.log("Unmatched request of '" + request.directive + "' from script to background.js from " + sender);
        }

        return true;
    }
);

/**
 *  Event handler for when the page loads. Gets configuration data and sets a new chrome.alarm if necessary.
 */
chrome.webNavigation.onCompleted.addListener(function(details) {


    chrome.storage.local.get(['refreshtype','interval','unit', 'text'], function (config) { 

            
            updateInterval(config);
            console.log("Refresh due in " + interval/1000 + " seconds...");
            chrome.alarms.get("refresh", function (alarm) {

                // create alarm if it does not exist yet.
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

/**
 *  Fires a refresh event to let content.js know when to refresh the page.
 */
chrome.alarms.onAlarm.addListener(function(alarm) {
    console.log("refresh triggered");
    triggerRefresh();
});

/**
 *  Configures the page action to only activate on the specified pageUrl and scheme
 */
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

