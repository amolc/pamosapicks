#!/bin/bash
cp service.server.js  admin/angular/service.js
cp service.server.js  public/angular/service.js

node freshpicks.js

npm install

echo "killing the freshpicks.js"
ps -ef | grep "node freshpicks.js" | grep -v runstatic | awk '{print $2}' | xargs kill -9
echo "Restarting Service"
node freshpicks.js
echo "freshpicks started at port 42000"
