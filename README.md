# node-red-contrib-http-request
**[Deprecated] node-red's native http-request node has migrated to request module since 0.19.0 and support most (if not all) features of this node.**

This is a node-red node for performing http(s) requests that use [Request](https://github.com/request/request) library with optimized proxy support 

## Installation
run npm -g install node-red-contrib-google-calendar

## Features
Add new event on google-calendar<br/>
Get event on google-calendar

# Get Key
Follow to guideline: https://github.com/taminhhienmor/node-red-contrib-google-calendar/blob/master/guidelineGetKey.docx

## Example node

Get event from google calendar...<br>
![get-event](https://cdn.jsdelivr.net/gh/taminhhienmor/node-red-contrib-google-calendar/source/image/addEvent.png)
``` node
[{"id":"10024703.ece9d9","type":"inject","z":"81c8deb7.6db2d","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":320,"y":360,"wires":[["df05d057.adc84"]]},{"id":"e4c18a06.b32d68","type":"debug","z":"81c8deb7.6db2d","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"false","x":720,"y":360,"wires":[]},{"id":"df05d057.adc84","type":"GetEvent","z":"81c8deb7.6db2d","google":"","calendarId":"taminhhien.mor.vn@gmail.com","time":"03/24/2020 12:00 AM - 03/24/2020 11:59 PM","x":520,"y":360,"wires":[["e4c18a06.b32d68"]]}]
```

Add event to google calendar...<br>
![add-event](https://cdn.jsdelivr.net/gh/taminhhienmor/node-red-contrib-google-calendar/source/image/getEvent.png)
![calendar-success](https://cdn.jsdelivr.net/gh/taminhhienmor/node-red-contrib-google-calendar/source/image/getEventSuccess.png)
``` node
[{"id":"1b7a6e62.038442","type":"inject","z":"81c8deb7.6db2d","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":200,"y":160,"wires":[["2d095a31.3d2dc6"]]},{"id":"fda646ee.5e2fa8","type":"debug","z":"81c8deb7.6db2d","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"false","x":590,"y":160,"wires":[]},{"id":"2d095a31.3d2dc6","type":"addEvent","z":"81c8deb7.6db2d","google":"","calendarId2":"taminhhien.mor.vn@gmail.com","tittle":"Test title","description":"This is description","location":"Ho Chi Minh","time":"03/24/2020 12:00 AM - 03/25/2020 11:59 PM","attend":"1","email1":"abc@example.com","name1":"ABC","email2":"","name2":"","email3":"","name3":"","email4":"","name4":"","email5":"","name5":"","x":390,"y":160,"wires":[["fda646ee.5e2fa8"]]}]
```

## Reference
node-red-node-google