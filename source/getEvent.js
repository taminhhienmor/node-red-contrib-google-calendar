var request = require('request');

module.exports = function(RED) {
    function getEvent(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        var api = 'https://www.googleapis.com/calendar/v3/calendars/'
        var timeMaxConvert = new Date(config.timeMax).toISOString()
        var timeMinConvert = new Date(config.timeMin).toISOString()
        var timeMax = 'timeMax=' + encodeURIComponent(timeMaxConvert)
        var timeMin = '&timeMin=' + encodeURIComponent(timeMinConvert)
        var linkUrl = api + config.calendarId + '/events?' + timeMax + timeMin

        var opts = {
            method: "GET",
            url: linkUrl,
            headers: {
                "content-type": "application/json",
                "Authorization": "Bearer " + config.token
            }
        };

        node.on('input', function(msg) {            
            request(opts, function (error, response, body) {
                if(!body) {
                    msg.payload = "error!"
                } else {                            
                    var arrObj = [];
                    JSON.parse(body).items.forEach(function (val) {
                        var obj = {};
                        var dateObj = new Date(val.start.dateTime);
                        var startDate = dateObj.getFullYear() + '/' + (dateObj.getMonth() + 1) + '/' + dateObj.getDate() + " " + dateObj.getHours() + ':' + dateObj.getMinutes();
                        dateObj = new Date(val.end.dateTime);                      
                        var endDate = dateObj.getFullYear() + '/' + (dateObj.getMonth() + 1) + '/' + dateObj.getDate() + " " + dateObj.getHours() + ':' + dateObj.getMinutes();
                        var title = '(No title)';
                        if(val.summary) title = val.summary;
                        var attend = [];
                        if(val.attendees) attend = val.attendees
                        
                        obj = {
                            "StartDate" : startDate,
                            "EndDate" : endDate,
                            "Title" : title,
                            "Attendees" : attend
                        }
                        arrObj.push(obj);
                    })                
                    msg.payload = arrObj;
                    node.send(msg);
                }  
            })           
            
        });
    }
    RED.nodes.registerType("GetEvent",getEvent);
}