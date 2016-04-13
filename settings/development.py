from .base import *

logging.log(logging.INFO, 'loading settings for ' + __name__)

DEBUG = True

DEVELOPMENT = True

DEFAULT_INDEX_TABLESPACE = "table"

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'sqlite3/local.db'),
    }
}

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
    },
}

SESSION_COOKIE_AGE = 7200
SESSION_EXPIRE_AT_BROWSER_CLOSE = False
