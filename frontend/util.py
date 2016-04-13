import os


def is_localhost():
    """Returns whether or not running in dev_appserver."""
    return os.environ.get('SERVER_SOFTWARE', '').startswith('Development')
