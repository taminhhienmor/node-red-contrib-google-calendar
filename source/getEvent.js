module.exports = function(RED) {
    function getEvent(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        var api = 'https://www.googleapis.com/calendar/v3/calendars/'
        // var timeMaxConvert = new Date(parseInt(config.timeMax)).toISOString()
        // var timeMinConvert = new Date(parseInt(config.timeMin)).toISOString()
        var timeMaxConvert = new Date(config.timeMax)
        var timeMinConvert = new Date(config.timeMin) 
        var timeMax = 'timeMax=' + encodeURIComponent(timeMaxConvert)
        var timeMin = '&timeMin=' + encodeURIComponent(timeMinConvert)
        node.on('input', function(msg) {          
            msg.url = api + config.calendarId + '/events?' + timeMax + timeMin
            msg.headers = {
                Authorization: "Bearer " + config.token
            }
            node.send(msg);
        });
    }
    RED.nodes.registerType("GetEvent",getEvent);
}