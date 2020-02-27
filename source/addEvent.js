var request = require('request');
module.exports = function(RED) {
    "use strict";
    function addEvent(n) {
        RED.nodes.createNode(this,n);
            
        this.google = RED.nodes.getNode(n.google);
        
        

        this.calendar = n.calendar || 'primary';
        this.ongoing = n.ongoing || false;

        if (!this.google || !this.google.credentials.accessToken) {
            this.warn(RED._("calendar.warn.no-credentials"));
            return;
        }

        var node = this;
        node.status({fill:"blue",shape:"dot",text:"calendar.status.querying"});
        calendarList(node, function(err) {
            if (err) {
                node.error(err,{});
                node.status({fill:"red",shape:"ring",text:"calendar.status.failed"});
                return;
            }
            node.status({});

            

            node.on('input', function(msg) {
                n.tittle = msg.tittle ? msg.tittle : n.tittle
                n.description = msg.description ? msg.description : n.description
                n.location = msg.location ? msg.location : n.location
                n.start = msg.start ? msg.start : n.start
                n.end = msg.end ? msg.end : n.end
                n.arrAttend = msg.arrAttend ? msg.arrAttend : n.arrAttend

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
                    start: {dateTime: new Date(n.start)},
                    end: {dateTime: new Date(n.end)},
                    attendees: arrAttend
                }
                var linkUrl = api + node.calendars.primary.id + '/events'
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
            
                    if (JSON.parse(body).kind == "calendar#event") {
                        msg.payload = "Success"
                    } else {
                        msg.payload = "Fail"
                    }
                    
                    node.send(msg);
                })
            });            
        });
    }
    RED.nodes.registerType("addEvent", addEvent);

    function calendarList(node, cb) {
        node.calendars = {};
        node.google.request('https://www.googleapis.com/calendar/v3/users/me/calendarList', function(err, data) {
            if (err) {
                cb(RED._("calendar.error.fetch-failed", {message:err.toString()}));
                return;
            }
            if (data.error) {
                cb(RED._("calendar.error.fetch-failed", {message:data.error.message}));
                return;
            }
            for (var i = 0; i < data.items.length; i++) {
                var cal = data.items[i];
                if (cal.primary) {
                    node.calendars.primary = cal;
                }
                node.calendars[cal.id] = cal;
            }
            cb(null);
        });
    }

    function validateEmail(email) {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }
};
