# node-red-contrib-http-request
**[Deprecated] node-red's native http-request node has migrated to request module since 0.19.0 and support most (if not all) features of this node.**

This is a node-red node for performing http(s) requests that use [Request](https://github.com/request/request) library with optimized proxy support 

## Installation
run npm -g install node-red-contrib-google-calendar

## Features
Add new event on google-calendar
Get event on google-calendar

## Example node
[{"id":"c07d2426.b09828","type":"inject","z":"c0cc4cd.3edecb","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":260,"y":360,"wires":[["a2cf819.73dc58"]]},{"id":"a2cf819.73dc58","type":"GetEvent","z":"c0cc4cd.3edecb","token":"ya29.Il-9Bx7J0HVkwzu7YRe4KRJwe8hEC6i-SzJiqE05TLVRBe3hmBfhMNxsTSmciI-6V9xZRSyqARB6-863w_hHfdCq2dtViZCZX16tv8Hhlg0JLcrS0kVsdqIMtis1oofQbg","calendarId":"taminhhien.mor.vn@gmail.com","timeMin":"Feb 17, 2020 10:30:00","timeMax":"Feb 17, 2020 11:30:00","x":440,"y":360,"wires":[["d22a423c.fde51"]]},{"id":"d22a423c.fde51","type":"debug","z":"c0cc4cd.3edecb","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"false","x":670,"y":360,"wires":[]},{"id":"a3fb4d93.e8096","type":"inject","z":"c0cc4cd.3edecb","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":260,"y":280,"wires":[["7589d235.c0dfac"]]},{"id":"7589d235.c0dfac","type":"addEvent","z":"c0cc4cd.3edecb","token":"ya29.Il-9B3-3EdtuTPQGBVi33Y_d98XC1ngmgLkd6qXa3parE20grv9IiLWOzdLsW55IiQfGzuOiqTG2bTPiQwdtw921X-mhc2SGWyhtiFNq7d30eeL41aJ6ZlV13XyLemmJuA","calendarId":"taminhhien.mor.vn@gmail.com","tittle":"Enebular Demo Calendar","description":"Enebular Demo Calendar","location":"Ho Chi Minh City, Vietnam","start":"Feb 18, 2020 11:15:00","end":"Feb 18, 2020 12:15:00","attend":"1","email1":"john@example.com","name1":"john","email2":"","name2":"","email3":"","name3":"","email4":"","name4":"","email5":"","name5":"","x":450,"y":280,"wires":[["ad19d8f7.293f08"]]},{"id":"ad19d8f7.293f08","type":"debug","z":"c0cc4cd.3edecb","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"payload","targetType":"msg","x":670,"y":280,"wires":[]}]
