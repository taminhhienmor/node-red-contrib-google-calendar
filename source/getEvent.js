module.exports = function(RED) {
    "use strict";
    function getEvent(n) {
        RED.nodes.createNode(this,n);
        this.google = RED.nodes.getNode(n.google);
        var calendarId = n.calendarId || ""

        if (!this.google || !this.google.credentials.accessToken) {
            this.warn(RED._("calendar.warn.no-credentials"));
            return;
        }    
             
        var node = this;        
        node.on('input', function(msg) {      
            calendarId = msg.calendarId? msg.calendarId : calendarId      
            var timeMaxInit = msg.payload.timemax? msg.payload.timemax : n.time.split(" - ")[1]
            var timeMinInit = msg.payload.timemin? msg.payload.timemin : n.time.split(" - ")[0]            
            var timeMaxConvert = timeMaxInit ? new Date(timeMaxInit).toISOString() : ''
            var timeMinConvert = timeMinInit ? new Date(timeMinInit).toISOString() : ''
            
            var timeMax = 'timeMax=' + encodeURIComponent(timeMaxConvert)        
            var timeMin = '&timeMin=' + encodeURIComponent(timeMinConvert)

            var linkAPI = 'https://www.googleapis.com/calendar/v3/calendars/' + encodeURIComponent(calendarId) + '/events?singleEvents=true&' + timeMax + timeMin          
            node.google.request(linkAPI, function(errData, data) {
                if (errData) {
                    node.error(errData,{});
                    node.status({fill:"red",shape:"ring",text:"calendar.status.failed"});
                    return;
                }
                var arrObj = [];
                
                if (typeof(data.items) == "undefined") {                 
                    msg.payload = "No data!"
                    node.send(msg);
                    return;
                }
                arrObj.push({
                    "Calendar": calendarId
                })        
                data.items.forEach(function (val) {
                    var obj = {};
                    var startDate;
                    var endDate;

                    if(typeof(val.start) != "undefined" && typeof(val.end) != "undefined") {
                        var firstEleObj = Object.keys(val.start)[0];
                        var dateObjStart = new Date(val.start[firstEleObj]);
                        var dateObjEnd = new Date(val.end[firstEleObj]);
                        startDate = dateObjStart.getFullYear() + '/' + (dateObjStart.getMonth() + 1) + '/' + dateObjStart.getDate() + " " + convertTimeFormat(dateObjStart.getHours()) + ':' + convertTimeFormat(dateObjStart.getMinutes());
                        endDate = dateObjEnd.getFullYear() + '/' + (dateObjEnd.getMonth() + 1) + '/' + dateObjEnd.getDate() + " " + convertTimeFormat(dateObjEnd.getHours()) + ':' + convertTimeFormat(dateObjEnd.getMinutes());                            
                    } else {
                        startDate = '';
                        endDate = '';
                    }
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
                node.status({});
            })
        });
    }
    RED.nodes.registerType("GetEvent", getEvent);

    function convertTimeFormat(time) {
        return time > 9 ? time : '0' + time;
    }

    RED.httpAdmin.get('/cal-get', function(req, res) {
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
