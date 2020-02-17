var request = require('request');

module.exports = function(RED) {
    function addEvent(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        var arrAttend = [];        
        if (config.attend > 0) {
            for (let index = 1; index < parseInt(config.attend) + 1; index++) {
                arrAttend.push({
                    email: config["email" + index],
                    displayName: config["name" + index]
                })                
            }            
        }

        var api = 'https://www.googleapis.com/calendar/v3/calendars/'
        var linkUrl = api + config.calendarId + '/events'
        var newObj = {
            summary: config.tittle,
            description: config.description,
            location: config.location,
            start: {dateTime: new Date(config.start)},
            end: {dateTime: new Date(config.end)},
            attendees: arrAttend
        }

        var opts = {
            method: "POST",
            url: linkUrl,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + config.token
            },
            body: JSON.stringify(newObj)
        };        

        node.on('input', function(msg) {
            request(opts, function (error, response, body) {
            
                if (JSON.parse(body).kind == "calendar#event") {
                    msg.payload = "Success"
                } else {
                    msg.payload = "Fail"
                }
                
                node.send(msg);
            })
        });
    }
    RED.nodes.registerType("addEvent",addEvent);
}