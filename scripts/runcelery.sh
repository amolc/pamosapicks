#!/usr/bin/env bash
mydir=$(dirname $0)
ps -ef | grep "celery -A restserver worker" | grep -v runcelery | awk '{print $2}' | xargs kill -9

repodir=$(dirname $mydir)
conffile=$repodir/scripts/configs/config.sh
source $conffile
DJANGO_BASE_DIR=$PROJECT_DEST/$APISERVER

cd $DJANGO_BASE_DIR
source venv/bin/activate
celery -A restserver worker --loglevel=warning
#checking if only warning can work
