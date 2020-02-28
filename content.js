
var pbiAutoRefresh;
var refreshInterval = 5000;


// refresh once
function clickRefresh() {
    
    if(document.fullscreenEnabled) {
        $("button.exitFullScreenBtn").click();
    }
    $("#moreActionsBtn").click();
    $("div button:contains('Refresh')").click();
    $("#visualizationOptionsMenuBtn").click();
    $("div button:contains('Full screen')").click();
    
    
}

// Start auto refresh 
function startAutoRefresh() {
   
    $("button.exitFullScreenBtn").click();
    $("#moreActionsBtn").click();
    $("div button:contains('Refresh')").click();
    $("#visualizationOptionsMenuBtn").click();
    $("div button:contains('Full screen')").click();
    
    
    console.log("Logging!");
    pbiAutoRefresh = setTimeout(startAutoRefresh, refreshInterval);   
}

// Stop automatically refreshing 
function stopRefresh(){
    clearInterval(pbiAutoRefresh)
}

chrome.runtime.sendMessage({directive:'on-load-event'}, function(response){
        alert(response.config[""])
});
console.log("Auto refresh started!");
clickRefresh();




