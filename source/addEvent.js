var request = require('request');
module.exports = function(RED) {
    "use strict";
    function addEvent(n) {
        RED.nodes.createNode(this,n);
            
        this.google = RED.nodes.getNode(n.google);        
        
        var calendarId = n.calendarId || 0
        var isNum = Number.isInteger(parseInt(calendarId))
        var linkCalendarId = ""
        this.calendar = n.calendar || 'primary';
        this.ongoing = n.ongoing || false;

        if (!this.google || !this.google.credentials.accessToken) {
            this.warn(RED._("calendar.warn.no-credentials"));
            return;
        }

        var node = this;
        node.on('input', function(msg) {
            node.status({fill:"blue",shape:"dot",text:"calendar.status.querying"});
            node.google.request('https://www.googleapis.com/calendar/v3/users/me/calendarList', function(err, calendarIdData) {
                if (err) {
                    node.error(err,{});
                    node.status({fill:"red",shape:"ring",text:"calendar.status.failed"});
                    return;
                }
                node.status({});
                n.tittle = msg.tittle ? msg.tittle : n.tittle
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
                    summary: n.tittle,
                    description: n.description,
                    location: n.location,
                    start: {dateTime: new Date(timeStart)},
                    end: {dateTime: new Date(timeEnd)},
                    attendees: arrAttend
                }
                // check calendar primary
                for (var i = 0; i < calendarIdData.items.length; i++) {
                    if (calendarIdData.items[i].primary) {
                        linkCalendarId = calendarIdData.items[i].id;
                    }               
                }

                if (isNum) {                        
                    if (calendarIdData.items[calendarId-1] || typeof(calendarIdData.items[calendarId-1]) != "undefined") {                     
                        linkCalendarId = calendarIdData.items[calendarId-1].id
                    }
                } else {
                    linkCalendarId = calendarId;
                }
                
                var linkUrl = api + encodeURIComponent(linkCalendarId) + '/events'
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
                        msg.payload = "Successfully add event to " + linkCalendarId
                    } else {
                        msg.payload = "Fail"
                    }
                    
                    node.send(msg);
                })
            });            
        });
    }
    RED.nodes.registerType("addEvent", addEvent);

    function validateEmail(email) {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }
};
