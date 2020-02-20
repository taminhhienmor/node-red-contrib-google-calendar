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
``` node
[{"id":"c07d2426.b09828","type":"inject","z":"c0cc4cd.3edecb","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":260,"y":360,"wires":[["8bec3e0d.5e395"]]},{"id":"d22a423c.fde51","type":"debug","z":"c0cc4cd.3edecb","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"false","x":670,"y":360,"wires":[]},{"id":"a3fb4d93.e8096","type":"inject","z":"c0cc4cd.3edecb","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":260,"y":280,"wires":[["bdfac1a9.59fd2"]]},{"id":"ad19d8f7.293f08","type":"debug","z":"c0cc4cd.3edecb","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"payload","targetType":"msg","x":670,"y":280,"wires":[]},{"id":"bdfac1a9.59fd2","type":"GetEvent","z":"c0cc4cd.3edecb","google":"","timeMin":"Feb 13, 2020 06:15:00","timeMax":"Feb 18, 2020 06:15:00","x":440,"y":280,"wires":[["ad19d8f7.293f08"]]},{"id":"8bec3e0d.5e395","type":"addEvent","z":"c0cc4cd.3edecb","google":"","tittle":"Test no calendar ID","description":"this is my test","location":"Ho Chi Minh","start":"Feb 19. 2020 18:12:12","end":"Feb 19. 2020 19:12:12","attend":"1","email1":"abc@example.com","name1":"abc","email2":"","name2":"","email3":"","name3":"","email4":"","name4":"","email5":"","name5":"","x":450,"y":360,"wires":[["d22a423c.fde51"]]}]
```

## Reference
node-red-node-google