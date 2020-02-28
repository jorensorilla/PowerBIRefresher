
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
    // load config here
    $('#interval-group').hide();
    $('#time-group').hide();

    $('#interval-radio').click(function () {
        $('#interval-group').show();
        $('#time-group').hide();

    });

    $('#time-radio').click(function () {
        $('#interval-group').hide();
        $('#time-group').show();

    });

    $(function () {
        $('input.timepicker').timepicker({
            timeFormat: 'h:mm p',
            interval: 60,
            minTime: '6',
            maxTime: '10:00pm',
            defaultTime: '7',
            startTime: '6:00',
            dynamic: false,
            dropdown: true,
            scrollbar: true
        });
    });
    console.log("popup.js add event listener");
})



chrome.runtime.sendMessage({directive:'on-load-event'}, function(response){
        alert(response.config["aaa"]);
});


console.log("Auto refresh started!");
clickRefresh();




