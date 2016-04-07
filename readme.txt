Cron Setup for cron tasks
30 2 * * * python2.7 $HOME/webapps/djangowebsite/<appname>/cron_tasks.py 2>&1 >> $HOME/logs/user/cron_tasks.log



Restoring from backup steps
python manage.py flush --no-initial-data
python manage.py loaddata <name of gz file>