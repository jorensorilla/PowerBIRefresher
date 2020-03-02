
var pbiAutoRefresh;
var refreshInterval = 10000;




// Start auto refresh 
function startAutoRefresh() {
   try{
    //$("button.exitFullScreenBtn").click();
    $("#moreActionsBtn").click();
    $("div button:contains('Refresh')").click();
    //$("#visualizationOptionsMenuBtn").click();
    //$("div button:contains('Full screen')").click();
   }catch(e) {

   }

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    
    console.log("Refreshing at " + dateTime);
    pbiAutoRefresh = setTimeout(startAutoRefresh, refreshInterval);   
}

// Stop automatically refreshing 
function stopRefresh(){
    clearInterval(pbiAutoRefresh)
}


console.log("Auto refresh started!");
startAutoRefresh();




