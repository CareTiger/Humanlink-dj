import gzip
import logging
import os
import sys

logging.basicConfig(format='%(levelname)s:%(message)s', level=logging.INFO)
logging.basicConfig(format='%(levelname)s:%(asctime)s | %(filename)s.%(funcName)s - %(lineno)d | %(message)s',
                    level=logging.ERROR)
logger = logging.getLogger('cron_tasks')
logger.setLevel(logging.INFO)

PROJECT_ROOT = os.path.dirname(os.path.realpath(__file__))
THIRD_PARTY_ROOT = os.path.join(PROJECT_ROOT, 'third_party')

sys.path.extend([PROJECT_ROOT, THIRD_PARTY_ROOT, ])
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "settings.cron")


def clear_sessions():
	logger.info('Running clear_sessions')
	from django.core.management import call_command
	call_command('clearsessions')


def full_backup():
	logger.info('Running full_backup')
	from django.utils import timezone
	from django.core.management import call_command
	now = timezone.now()

	file_name = 'backup-%s-%s-%s-%s-%s.json' % (now.year, now.month, now.day, now.hour, now.minute)
	file_path = os.path.join(PROJECT_ROOT, 'backups', file_name)

	dir = os.path.dirname(file_path)
	try:
		os.stat(dir)
	except:
		os.mkdir(dir)

	# we will temporarilly redirect stdout to a file to capture the data from the dumpdata cmd
	stdout = sys.stdout
	try:
		sys.stdout = open(file_path, 'w')
		call_command('dumpdata', use_natural_foreign_keys=True, use_natural_primary_keys=True)
		sys.stdout.close()
	except Exception as exc:
		logger.error(exc)

	# Put stdout back to what it was
	sys.stdout = stdout

	# Now zip the file
	zip_file_path = os.path.join(PROJECT_ROOT, 'backups', file_name + '.gz')
	zipfile = gzip.GzipFile(zip_file_path, "wb")
	try:
		inputFile = open(file_path, "r")
		zipfile.write(inputFile.read())
	finally:
		zipfile.close()

	# Delete the original uncompressed file
	os.remove(file_path)


if __name__ == "__main__":
	logger.info('Running cron tasks')
	from django import setup

	setup()

	# Clear expired Sessions
	try:
		clear_sessions()
	except Exception as exc:
		logger.error(exc)

	# Backup
	try:
		full_backup()
	except Exception as exc:
		logger.error(exc)

	logger.info('Finished running cron tasks')
