/**
 *  Options page for the extension. Used to modify
 *  the interval of when to refresh the page to 
 *  either by a set time daily or by minutes/hours.
 */

function saveHandler() {
   
    if ($('#popup-form')[0].checkValidity() === true) {
        var message;

        if($('#interval-radio').is(':checked')) {
            var interval = $('#refresh-interval').val();
            var interval_category = $('#interval-category').val();
            var interval_in_ms;

            switch(interval_category) {
                // case "seconds": interval_in_ms = parseInt(interval*1000); 
                //                 break;
                case "minutes": interval_in_ms = parseInt(interval*1000*60);
                                break;
                case "hours": interval_in_ms = parseInt(interval*1000*60*60);  
                                break;
                default:
                    alert("Interval category invalid!");
            }
            message = {directive:'save-event', 
                       refreshtype: 'interval', 
                       interval:interval_in_ms,
                       unit:$('#interval-category').val()}
        } else {
        
            
            message = {directive:'save-event', 
                       refreshtype: 'time',
                       text:$('#time-field').val()}
        }

        
        chrome.runtime.sendMessage(message);
        window.close();
    } else {
        // prevent default behaviour of browser of closing the popup
        event.preventDefault();
        $('#popup-form')[0].classList.add('was-validated');
        
    }

    
}

chrome.runtime.sendMessage({directive:'get-config'}, function (config) { 
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
        $('#time-field').val(config.text);
        $('#time-group').show();
        $('#interval-group').hide();
    }else { 
        $('#interval-group').hide();
        $('#time-group').hide();
    }
    
    
});


document.addEventListener('DOMContentLoaded', function() {
	$('#interval-radio').click(function () {
        $('#interval-group').show();
        $('#time-group').hide();
    
    });
    
    $('#time-radio').click(function () {
        $('#interval-group').hide();
        $('#time-group').show();
    
    });
    
    $('#save-button').click(saveHandler);
    
    
    $('input.timepicker').timepicker({
        timeFormat: 'h:mm p',
        interval: 60,
        minTime: '6',
        maxTime: '10:00pm',
        startTime: '6:00',
        dynamic: false,
        dropdown: true,
        scrollbar: true
    });
    
});