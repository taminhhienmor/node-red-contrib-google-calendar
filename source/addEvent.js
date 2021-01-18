var request = require('request');
module.exports = function(RED) {
    "use strict";
    function addEvent(n) {
        RED.nodes.createNode(this,n);            
        this.google = RED.nodes.getNode(n.google);        
        if (!this.google || !this.google.credentials.accessToken) {
            this.warn(RED._("calendar.warn.no-credentials"));
            return;
        }
        var calendarId = n.calendarId2 || ""
        var node = this;

        node.on('input', function(msg) {
            calendarId = msg.calendarId? msg.calendarId : calendarId
            n.title = msg.title ? msg.title : n.title
            n.description = msg.description ? msg.description : n.description
            n.location = msg.location ? msg.location : n.location
            n.arrAttend = msg.arrAttend ? msg.arrAttend : n.arrAttend

            var timeStart = msg.start ? msg.start : n.time.split(" - ")[0];
            var timeEnd = msg.end ? msg.end : n.time.split(" - ")[1];

            var arrAttend = [];        
            if (n.attend > 0) {
                for (let index = 1; index < parseInt(n.attend) + 1; index++) {
                    if(n["email" + index] || n["name" + index]) {
                        if (validateEmail(n["email" + index])) {
                            arrAttend.push({
                                email: n["email" + index] || '',
                                displayName: n["name" + index] || ''
                            })             
                        }
                    }
                }            
            }                

            var api = 'https://www.googleapis.com/calendar/v3/calendars/'        
            var newObj = {
                summary: n.title,
                description: n.description,
                location: n.location,
                start: {dateTime: new Date(timeStart)},
                end: {dateTime: new Date(timeEnd)},
                attendees: arrAttend
            }
            
            var linkUrl = api + encodeURIComponent(calendarId) + '/events'
            var opts = {
                method: "POST",
                url: linkUrl,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + node.google.credentials.accessToken
                },
                body: JSON.stringify(newObj)
            };
            request(opts, function (error, response, body) {
                if (error) {
                    node.error(error,{});
                    node.status({fill:"red",shape:"ring",text:"calendar.status.failed"});
                    return;
                }            
                if (JSON.parse(body).kind == "calendar#event") {
                    msg.payload = "Successfully add event to " + calendarId
                } else {
                    msg.payload = "Fail"
                }
                
                node.send(msg);
            })        
        });
    }
    RED.nodes.registerType("addEvent", addEvent);

    function validateEmail(email) {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    RED.httpAdmin.get('/cal', function(req, res) {              
        var googleId = res.socket.parser.incoming._parsedUrl.path.split("id=")[1];        
        RED.nodes.getNode(googleId).request('https://www.googleapis.com/calendar/v3/users/me/calendarList', function(err, data) {
            if(err) return;

            var primary = "";
            var arrCalendar = [];

            for (var i = 0; i < data.items.length; i++) {
                var cal = data.items[i];
                if (cal.primary) {
                    primary = cal.id;                    
                } else {
                    arrCalendar.push(cal.id)
                }
            }

            var arrData = [];
            arrData.push(primary);              
            arrCalendar.sort();
            arrCalendar.forEach(function(element) {
                arrData.push(element)
            })           
            res.json(arrData)            
        })
    })
};
