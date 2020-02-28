function saveHandler() {
    var interval = document.getElementById("refresh-interval").value
    var interval_category = document.getElementById("interval-category").value
    var interval_in_ms;
    switch(interval_category) {
        case "seconds": interval_in_ms = parseInt(interval*1000); 
                        break;
        case "minutes": interval_in_ms = parseInt(interval*1000*60);
                        break;
        case "hours": interval_in_ms = parseInt(interval*1000*60*60);  
                      break;
        default:
            alert("Interval category invalid!");
    }
    chrome.runtime.sendMessage({directive:'save-event', reportinterval: interval_in_ms }, function(){
        console.log("saveHandler");
        
    });
}

function refreshHandler() {
    chrome.runtime.sendMessage({directive:'refresh-event'}, function(){
        console.log("refreshHandler");
        
    });

}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('save-button').addEventListener('click', saveHandler);
    document.getElementById('refresh-button').addEventListener('click', refreshHandler);
    console.log("popup.js add event listener");
})