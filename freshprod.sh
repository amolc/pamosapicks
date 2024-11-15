#!/bin/bash

mydir=$(dirname $0)
ps -ef | grep "node freshpicks.js" | awk '{print $2}' | xargs kill -9


cp service.server.js  web/angular/service.js
cp service.server.js  admin/angular/service.js
cp service.server.js  staffadmin/angular/service.js
cp service.server.js  app/angular/service.js
cp service.server.js  client/angular/service.js
cp service.server.js  public/angular/service.js
node freshpicks.js


