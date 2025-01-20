#!/bin/bash
lsof -t -i:42000 | xargs -r kill -9 && echo "Service on port 42000 terminated" || echo "No service running on port 42000"
cp service.local.js  admin/angular/service.js
cp service.local.js  public/angular/service.js
node freshpicks.js