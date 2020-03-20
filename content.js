/**
 *  Content script of the extension. Listens to events from background.js 
 *  to know when to refresh the page. 
 * 
 */



/** 
 *  Enables full screen when the page loads. Checks every 1 second
 *  if element to trigger full screen exists.
 */ 
var checkExist = setInterval(function() {
    if ($('#visualizationOptionsMenuBtn').length) {
        $("#visualizationOptionsMenuBtn").click();
        $("div button:contains('Full screen')").click();
        
       clearInterval(checkExist);
    }
 }, 1000); // check every 1000ms


/**
 *  Listens to events from background.js for it to know when to refresh the page
 */
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        
        switch(request.directive) {
            case "trigger-refresh": 
                // refresh the page
                window.location = window.location;
                break;
            default: console.log("Invalid request received: " + request.directive);
        }
        
});

















