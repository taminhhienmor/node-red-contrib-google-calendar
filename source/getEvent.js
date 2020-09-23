module.exports = function(RED) {
    "use strict";
    function getEvent(n) {
        RED.nodes.createNode(this,n);
        this.google = RED.nodes.getNode(n.google);
        if (!this.google || !this.google.credentials.accessToken) {
            this.warn(RED._("calendar.warn.no-credentials"));
            return;
        }    
             
        let node = this;

        node.on('input', function(msg) {      
            let calendarId = n.calendarId || msg.calendarId || "";
            let timeMaxInit = msg.payload.timemax? msg.payload.timemax : n.time.split(" - ")[1];
            let timeMinInit = msg.payload.timemin? msg.payload.timemin : n.time.split(" - ")[0];           
            let timeMaxConvert = timeMaxInit ? new Date(timeMaxInit).toISOString() : '';
            let timeMinConvert = timeMinInit ? new Date(timeMinInit).toISOString() : '';
            
            let timeMax = 'timeMax=' + encodeURIComponent(timeMaxConvert)        
            let timeMin = '&timeMin=' + encodeURIComponent(timeMinConvert)

            let linkAPI = 'https://www.googleapis.com/calendar/v3/calendars/' + encodeURIComponent(calendarId) + '/events?singleEvents=true&' + timeMax + timeMin          
            node.google.request(linkAPI, function(errData, data) {
                if (errData) {
                    node.error(errData,{});
                    node.status({fill:"red",shape:"ring",text:"calendar.status.failed"});
                    return;
                }
                let arrObj = [];
                
                if (typeof(data.items) == "undefined") {                 
                    msg.payload = "No data!"
                    node.send(msg);
                    return;
                }
                arrObj.push({
                    "Calendar": calendarId
                })        
                data.items.forEach(function (val) {
                    let obj = {};
                    let startDate;
                    let endDate;

                    if(typeof(val.start) != "undefined" && typeof(val.end) != "undefined") {
                        let firstEleObj = Object.keys(val.start)[0];
                        let dateObjStart = new Date(val.start[firstEleObj]);
                        let dateObjEnd = new Date(val.end[firstEleObj]);
                        startDate = dateObjStart.getFullYear() + '/' + (dateObjStart.getMonth() + 1) + '/' + dateObjStart.getDate() + " " + convertTimeFormat(dateObjStart.getHours()) + ':' + convertTimeFormat(dateObjStart.getMinutes());
                        endDate = dateObjEnd.getFullYear() + '/' + (dateObjEnd.getMonth() + 1) + '/' + dateObjEnd.getDate() + " " + convertTimeFormat(dateObjEnd.getHours()) + ':' + convertTimeFormat(dateObjEnd.getMinutes());                            
                    } else {
                        startDate = '';
                        endDate = '';
                    }
                    let title = '(No title)';
                    if(val.summary) title = val.summary;
                    let attend = [];
                    if(val.attendees) attend = val.attendees
                    
                    obj = {
                        "CalendarId": data.summary,
                        "EventId" : val.id,
                        "Description" : val.description,
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
        let googleId = req.query.id;

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
