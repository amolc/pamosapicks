#!/usr/bin/env bash
set -e
cd "$(dirname $0)"
SCRIPTS_DIR="$PWD"

config_name=$1

cp $SCRIPTS_DIR/configs/$config_name.sh $SCRIPTS_DIR/configs/config.sh


source $SCRIPTS_DIR/configs/config.sh

echo "Update repo code"
cd "$FRONTEND_REPO_DIR"
git fetch
git checkout "$FRONTEND_REPO_BRANCH"
git pull > /dev/null
git log -n 1

echo "Update project directory"
cd "$FRONTEND_DEST"

rsync_excluded=""
for dir in ${FRONTEND_EXCLUDE_DIRS}
do
    rsync_excluded+=" --exclude $dir "
done

rsync -a --info=NAME,PROGRESS --delete ${rsync_excluded} "$FRONTEND_REPO_DIR/" .

cp service.server.js  web/angular/service.js
cp service.server.js  web/admin/angular/service.js
cp service.server.js  superadmin/angular/service.js
cp service.server.js  client/angular/service.js

pm2 restart prod
