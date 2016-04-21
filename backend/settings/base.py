import logging
import os
import re

logging.log(logging.INFO, 'loading settings for ' + __name__)

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
PROJECT_ROOT = BASE_DIR

DEVELOPMENT = False

ADMINS = ('info@millcreeksoftware.biz',)  # THESE GET 500 ERROR EMAILS
MANAGERS = ('info@millcreeksoftware.biz',)  # THESE GET 404 ERROR EMAILS

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 't8%+b87azv!0)#)bc^x!1h*m(ar#z7flxls!r6mu*+pj6n_q!4'

# Mandril API Key
MANDRILL_API_KEY = '<mandril-key>'

# Pusher Keys
PUSHER_KEY = '1019dcd6d219db50d37e'
PUSHER_SECRET = '9550fb09aacce399eeb6'
APP_ID = '199731'

# SECURITY WARNING: don't run with debug turned on in production!
ALLOWED_HOSTS = ['*', ]

SITE_ID = 1

# EMAIL SETTINGS
EMAIL_HOST = 'smtp.webfaction.com'
EMAIL_HOST_USER = 'millcreek_noreply'
EMAIL_HOST_PASSWORD = 'jupit99'
EMAIL_PORT = '25'
DEFAULT_FROM_EMAIL = "Millcreek Software <noreply@millcreeksoftware.biz>"
ONLINE_CONTACT_EMAIL = 'kellym@millcreeksoftware.biz'

# Application definition
INSTALLED_APPS = (
	'django.contrib.auth',
	'django.contrib.contenttypes',
	'django.contrib.sessions',
	'django.contrib.sites',
	'django.contrib.messages',
	'django.contrib.staticfiles',
	'django.contrib.sitemaps',
	# 3rd Party Applications
	'filebrowser',
	'suit',
	'django.contrib.admin',
	'reversion',
	'classytags',
	'mptt',
	# My Applications
	'webapp',
	'message',
	'org',
	'webapp_admin',
	'account'
)

MIDDLEWARE_CLASSES = (
	'django.contrib.sessions.middleware.SessionMiddleware',
	'django.middleware.common.CommonMiddleware',
	'django.middleware.csrf.CsrfViewMiddleware',
	'django.contrib.auth.middleware.AuthenticationMiddleware',
	'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
	'django.contrib.messages.middleware.MessageMiddleware',
	'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

IGNORABLE_404_URLS = (
	re.compile(r'\.(php|cgi)$'),
	re.compile(r'^/phpmyadmin/'),
	re.compile(r'^/apple-touch-icon.*\.png$'),
	re.compile(r'^/favicon\.ico$'),
	re.compile(r'^/robots\.txt$'),
)

# from django.conf.global_settings import TEMPLATE_CONTEXT_PROCESSORS as TCP
#
# TEMPLATE_CONTEXT_PROCESSORS = TCP + (
#     'django.core.context_processors.request',
#     'common_context_processors.common_context',
# )

ROOT_URLCONF = 'webapp.urls'

WSGI_APPLICATION = 'webapp.wsgi.application'

# Internationalization
# https://docs.djangoproject.com/en/dev/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'America/Chicago'

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Absolute filesystem path to the directory that will hold user-uploaded files.
# Example: "/home/media/media.lawrence.com/media/"
MEDIA_ROOT = os.path.join(PROJECT_ROOT, 'media')

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash.
# Examples: "http://media.lawrence.com/media/", "http://example.com/media/"
MEDIA_URL = '/media/'

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/dev/howto/static-files/
STATIC_ROOT = os.path.join(PROJECT_ROOT, 'static')
STATIC_URL = '/static/'


TEMPLATES = [
	{
		'BACKEND': 'django.template.backends.django.DjangoTemplates',
		'APP_DIRS': True,
		'DIRS': [os.path.join(BASE_DIR, 'templates'), ],
		'OPTIONS': {
			'context_processors': [
				'django.template.context_processors.debug',
				'django.template.context_processors.request',
				'django.contrib.auth.context_processors.auth',
				'django.contrib.messages.context_processors.messages',
			],
		},
	},
]

FILE_UPLOAD_PERMISSIONS = 0644

SESSION_COOKIE_AGE = 3600
SESSION_EXPIRE_AT_BROWSER_CLOSE = True
SESSION_SAVE_EVERY_REQUEST = True

LOGGING = {
	'version': 1,
	'disable_existing_loggers': True,
	'formatters': {
		'verbose': {
			'format': '%(levelname)s %(asctime)s %(filename)s %(funcName)s %(lineno)d %(message)s'
		},
		'normal': {
			'format': '%(levelname)s %(asctime)s %(funcName)s %(message)s'
		},
		'simple': {
			'format': '%(levelname)s %(message)s'
		},
	},
	'filters': {
		'require_debug_false': {
			'()': 'django.utils.log.RequireDebugFalse'
		}
	},
	'handlers': {
		'console': {
			'level': 'ERROR',
			'class': 'logging.StreamHandler',
			'formatter': 'verbose'
		},
	},
	'loggers': {
		'django.request': {
			'handlers': ['console'],
			'level': 'ERROR',
			'propagate': True,
		},
		'webapp': {
			'handlers': ['console'],
			'level': 'ERROR',
			'propagate': True,
		},
		'': {
			'handlers': ['console'],
			'level': 'ERROR',
		},
	}
}

SUIT_CONFIG = {
	'ADMIN_NAME': 'Mill Creek Software',
	'HEADER_DATE_FORMAT': 'l, F jS, Y',
	'HEADER_TIME_FORMAT': 'h:i a',
	'SHOW_REQUIRED_ASTERISK': True,  # Default True
	'CONFIRM_UNSAVED_CHANGES': True,  # Default True
	'SEARCH_URL': '/admin/auth/user/',
	'MENU_ICONS': {
		'sites': 'icon-leaf',
		'auth': 'icon-lock',
	},
	'MENU_OPEN_FIRST_CHILD': True,  # Default True
	'MENU': (
		{'app': 'auth', 'label': 'Users', 'icon': 'icon-lock', 'models': ('user', 'group')},
		{'app': 'site_content', 'label': 'Site Content', 'icon': 'icon-file',
		 'models': ('logo', 'sociallink', 'instagram')},
		{'app': 'navigation', 'icon': 'icon-list'},
		{'app': 'page_content', 'label': 'Pages', 'icon': 'icon-file'},
		{'app': 'home_content', 'label': 'Home Content', 'icon': 'icon-file',
		 'models': ('homesection', 'billboard', 'minibillboard')},
		{'app': 'contact', 'icon': 'icon-user'},
		{'app': 'account', 'icon': 'icon-user'},
		{'app': 'message', 'icon': 'icon-user'},
		{'app': 'org', 'icon': 'icon-user'},
		{'label': 'Your Media', 'icon': 'icon-picture', 'url': '/admin/filebrowser/browse/'},
	),
	'LIST_PER_PAGE': 30
}

FILEBROWSER_SUIT_TEMPLATE = True

ADAPTOR_INPLACEEDIT = {'auto_fk': 'inplaceeditform_extra_fields.fields.AdaptorAutoCompleteForeingKeyField',
                       'auto_m2m': 'inplaceeditform_extra_fields.fields.AdaptorAutoCompleteManyToManyField',
                       'image_thumb': 'inplaceeditform_extra_fields.fields.AdaptorImageThumbnailField',
                       'tiny': 'inplaceeditform_extra_fields.fields.AdaptorTinyMCEField'}

DJANGO_FRONT_KEY = 'Ih0ITxt2IXvhYbjb9LVrZtlcRGvLv'  # MAKE THIS UNIQUE PER SETTINGS FILE
