// content.js
var pbiAutoRefresh;
var refreshInterval = 5000;

/* Click refresh */
function clickRefresh() {
   
    $("button.exitFullScreenBtn").click();
    $("#moreActionsBtn").click();
    $("div button:contains('Refresh')").click();
    $("#visualizationOptionsMenuBtn").click();
    $("div button:contains('Full screen')").click();
    
    
    console.log("Logging!");
    pbiAutoRefresh = setTimeout(clickRefresh, refreshInterval);   
}

/* Stop automatically refreshing */
function stopRefresh(){
    clearInterval(pbiAutoRefresh)
}

chrome.runtime.sendMessage({directive:'on-load-event'}, function(response){
        alert(response.config[""])
});
console.log("Auto refresh started!");
clickRefresh();




