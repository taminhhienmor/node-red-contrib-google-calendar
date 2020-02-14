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
        node.on('input', function(msg) {
            msg.payload = {
                summary: config.tittle,
                description: config.description,
                location: config.location,
                start: {dateTime: new Date(config.start)},
                end: {dateTime: new Date(config.end)},
                attendees: arrAttend
            }
            var api = 'https://www.googleapis.com/calendar/v3/calendars/'
            var url = api + config.calendarId + '/events'
            msg.url = url;
            msg.headers = {
                Authorization: "Bearer " + config.token
            }
            node.send(msg);
        });
    }
    RED.nodes.registerType("addEvent",addEvent);
}