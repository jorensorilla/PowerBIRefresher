
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
    

    if ($('#popup-form')[0].checkValidity() === true) {
        var message;
        var interval = $('#refresh-interval').val();
        var interval_category = $('#interval-category').val();
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

        if($('#interval-radio').is(':checked')) {
            message = {directive:'save-event', 
                       refreshtype: 'interval', 
                       interval:interval_in_ms,
                       unit:$('#interval-category').val()}
        } else {
        
            message = {directive:'save-event', 
                       refreshtype: 'time', 
                       time:$('#time-field').val()}
        }

         
        chrome.runtime.sendMessage(message);
    } else {
        
        event.preventDefault();
        //event.stopPropagation();
        
        $('#popup-form')[0].classList.add('was-validated');
    }
}

function refreshHandler() {
    chrome.runtime.sendMessage({directive:'refresh-event'}, function(){
        console.log("refreshHandler");
        
    });

}

document.addEventListener('DOMContentLoaded', function () {
    
    
    chrome.storage.local.get(['refreshtype','interval','unit', 'time'], function (config) { 
        
        if(config.refreshtype == 'interval') {
            $('#interval-radio').prop('checked', true);
            $('#refresh-interval').val(config.interval);
            $('#interval-category').val(config.unit);
            $('#interval-group').show();
            $('#time-group').hide();
        } else if (config.refreshtype == 'time'){
            $('#time-radio').prop('checked', true);
            $('#time-field').val(config.time);
            $('#time-group').show();
            $('#interval-group').hide();
        }

        
    });

    $('#interval-radio').click(function () {
        $('#interval-group').show();
        $('#time-group').hide();

    });

    $('#time-radio').click(function () {
        $('#interval-group').hide();
        $('#time-group').show();

    });

    $('#save-button').click(saveHandler);

    $('#refresh-button').click(function() {
        
        
    });


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
   
    console.log("popup.js add event listener");
})
















