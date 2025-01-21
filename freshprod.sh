#!/bin/bash

cp service.server.js  admin/angular/service.js
cp service.server.js  public/angular/service.js
cp server.config.js  public/api/config.js

npm install
echo "killing the freshpicks.js"
lsof -t -i:42000 | xargs -r kill -9 && echo "Service on port 42000 terminated" || echo "No service running on port 42000"
echo "Restarting Service"
node freshpicks.js
echo "freshpicks started at port 42000"


