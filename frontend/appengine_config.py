"""`appengine_config` gets loaded when starting a new application instance."""
import os.path

import util
import vendor

# Pip requirements.
vendor.add('lib/pip')


if not os.environ.get('BACKEND'):
    raise ValueError('Backend is not specified in app.yaml!')


# Workaround the SSL issue on dev_appserver.
if util.is_localhost():
    import imp
    import chunk
    from google.appengine.tools.devappserver2.python import sandbox

    sandbox._WHITE_LIST_C_MODULES += ['_ssl', '_socket']
    psocket = os.path.join(os.path.dirname(chunk.__file__), 'socket.py')
    imp.load_source('socket', psocket)
