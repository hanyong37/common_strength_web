#!/bin/sh

export LOG=/Users/junpeng.guan/myspace/iyooh-management/webapp/logs
export APP_PATH=/Users/junpeng.guan/myspace/iyooh-management/webapp
export APP=$APP_PATH/app.js

forever -p $APP_PATH -l $LOG/access.log -e $LOG/error.log -o $LOG/out.log  --watchDirectory $APP_PATH  -aw stop $APP
