
var pbiAutoRefresh;
var refreshInterval = 5000; // default

window.onerror = function(message, url, lineNumber) {  
    // code to execute on an error  
    return true; // prevents browser error messages  
};

function convertTo24hrFormat(time){
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
    
    return hours+':'+seconds+':00'
    

}

// refresh once
function clickRefresh() {
    
  
    $("button.exitFullScreenBtn").click();
    $("#moreActionsBtn").click();
    $("div button:contains('Refresh')").click();
    $("#visualizationOptionsMenuBtn").click();
    setTimeout($("div button:contains('Full screen')").click(), 1000);

}

function setRefreshValue() {
    chrome.runtime.sendMessage({directive:'get-config'}, function (config) { 
        
        if(config.refreshtype == 'interval') {
            refreshInterval = config.interval;
            console.log("Interval set to: " + refreshInterval);
        } else if (config.refreshtype == 'time'){
            //to do
        }
        
        
    });
}

// Start auto refresh 
function startAutoRefresh() {
    setRefreshValue();
    clickRefresh();

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    
    console.log("Refreshed at " + dateTime);

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
        // prevent default behaviour of browser 
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
    
    // chrome.runtime.sendMessage({directive:'on-load-event'}, function(config) {
    //     if(config.refreshtype == 'interval') {
    //         $('#interval-radio').prop('checked', true);
    //         $('#refresh-interval').val(config.interval);
    //         $('#interval-category').val(config.unit);
    //         $('#interval-group').show();
    //         $('#time-group').hide();
    //     } else if (config.refreshtype == 'time'){
    //         $('#time-radio').prop('checked', true);
    //         $('#time-field').val(config.time);
    //         $('#time-group').show();
    //         $('#interval-group').hide();
    //     }
    // });
    chrome.runtime.sendMessage({directive:'on-load-event'}, function (config) { 
        
        if(config.refreshtype == 'interval') {
            $('#interval-radio').prop('checked', true);

            $('#interval-category').val(config.unit);
            switch(config.unit) {
                case "seconds": $('#refresh-interval').val (config.interval/1000); break;
                case "minutes": $('#refresh-interval').val (config.interval/60000); break;
                case "hours": $('#refresh-interval').val(config.interval/(60000*60)); break;
                default: $('#refresh-interval').val(config.interval); 
            }

            $('#interval-group').show();
            $('#time-group').hide();
           
        } else if (config.refreshtype == 'time'){
            $('#time-radio').prop('checked', true);
            $('#time-field').val(config.time);
            $('#time-group').show();
            $('#interval-group').hide();
        }else { 
            $('#interval-group').hide();
            $('#time-group').hide();
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

    $('#stop-button').click(stopRefresh);


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


startAutoRefresh();














