#!/bin/sh

export LOG=/var/www/common_strength/web/iyooh-management/webapp/logs
export APP_PATH=/var/www/common_strength/web/iyooh-management/webapp
export APP=$APP_PATH/app.js

forever -p $APP_PATH -l $LOG/access.log -e $LOG/error.log -o $LOG/out.log  --watchDirectory $APP_PATH  -aw restart $APP
