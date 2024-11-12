#!/bin/bash
cp service.server-c2.js  toodls/angular/service.js
cp service.server-c2.js  superadmin/angular/service.js
npm install
node server.js
