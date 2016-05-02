import datetime
import decimal
import json
import logging

from django.db.models.fields.files import ImageFieldFile
from django.http import HttpResponse

# Encode our different classes into json
from django.conf import settings

logger = logging.getLogger(__name__)


class DefaultJSONEncoder(json.JSONEncoder):
	def default(self, o):

		if isinstance(o, datetime.time):
			return o.strftime("%I:%M %p")
		if isinstance(o, datetime.datetime):
			return o.strftime("%Y-%m-%dT%H:%M:%S.%s%z")
		if isinstance(o, datetime.date):
			return o.strftime("%Y-%m-%d")
		if isinstance(o, decimal.Decimal):
			# http://stackoverflow.com/a/1960649/1163156
			# wanted a simple yield str(o) in the next line,
			# but that would mean a yield on the line with super(...),
			# which wouldn't work (see my comment below), so...
			return float(o)
		if isinstance(o, ImageFieldFile):
			if o:
				return settings.MEDIA_URL + '/' + o.path
			else:
				return None
		if isinstance(o, float):
			return (str(o) for o in [o])

		return str(o)


def composeJsonResponse(code, message, data):
	returnStatus = {'code': code, 'message': message}
	returnMsg = {'status': returnStatus, 'response': data}

	returnDataType = 'application/json'
	try:
		returnDataString = json.dumps(returnMsg, cls=DefaultJSONEncoder)
		x = type(returnDataString)
	except Exception as exc:
		logger.error(exc)

		returnStatus = {'code': 500, 'message': 'Can not encode return data.'}
		returnMsg = {'status': returnStatus, 'response': ''}
		returnDataString = json.dumps(returnMsg, cls=DefaultJSONEncoder)

	return HttpResponse(returnDataString, content_type=returnDataType)
