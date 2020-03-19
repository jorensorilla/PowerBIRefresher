

window.onload = function () {
    $("#visualizationOptionsMenuBtn").click();
    $("div button:contains('Full screen')").click();
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        
        switch(request.directive) {
            case "trigger-refresh": 


                var today = new Date();
                var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
                var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                var dateTime = date+' '+time;
                
                console.log("Refreshed at " + dateTime);
                window.location = window.location;
                break;
            default: console.log("Invalid request received: " + request.directive);
        }
        
});

















