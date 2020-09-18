//PATCH https://www.googleapis.com/calendar/v3/calendars/calendarId/events/eventId
// calendarId
// eventId
// description
// sendUpdates=all
var request = require('request');
module.exports = function (RED) {
    "use strict";
    function updateEvent(n) {
        RED.nodes.createNode(this, n);
        this.google = RED.nodes.getNode(n.google);
        if (!this.google || !this.google.credentials.accessToken) {
            this.warn(RED._("calendar.warn.no-credentials"));
            return;
        }

        var node = this;

        node.on('input', function (msg) {
            let calendarId = n.calendarId || msg.calendarId || "",
                eventId = n.eventId || msg.eventId || "",
                description = n.description || msg.description || "",
                title = n.title || msg.title || "",
                location = n.location || msg.location || "",
                emailNotify = n.emailNotify || msg.emailNotify ? "?sendUpdates=all" : "";

            let baseApi = 'https://www.googleapis.com/calendar/v3/calendars/';
            let patchObj = {
                summary: title,
                description: description,
                location: location
            }
            
            //remove empty fields
            Object.keys(patchObj).forEach(key => patchObj[key] === '' && delete patchObj[key]);
            
            if (!Object.keys(patchObj).length) {
                node.status({ fill: "red", shape: "ring", text: "No param specified" });
                return;
            }

            var linkUrl = baseApi + encodeURIComponent(calendarId) + '/events/' + eventId + emailNotify;
            var opts = {
                method: "PATCH",
                url: linkUrl,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + node.google.credentials.accessToken
                },
                body: JSON.stringify(patchObj)
            };
            
            request(opts, function (error, response, body) {
                if (error) {
                    node.error(error, {});
                    node.status({ fill: "red", shape: "ring", text: "calendar.status.failed" });
                    return;
                }
                
                if (JSON.parse(body).kind == "calendar#event") {
                    msg.payload = "Successfully update event of " + calendarId
                } else {
                    msg.payload = "Fail to update"
                }

                node.send(msg);
            })
        });
    }
    RED.nodes.registerType("updateEvent", updateEvent);

    RED.httpAdmin.get('/get-calendar-list', function (req, res) {
        var googleId = req.query.id;

        RED.nodes.getNode(googleId).request('https://www.googleapis.com/calendar/v3/users/me/calendarList', function (err, data) {
            if (err) return;

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
            arrCalendar.forEach(function (element) {
                arrData.push(element)
            })
            res.json(arrData)
        })
    })
};
