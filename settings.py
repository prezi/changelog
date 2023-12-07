ALCHEMY_URL = 'sqlite:///changelog.db' #Any valid SQLAlchemy connection string.
LISTEN_HOST = "127.0.0.1"
LISTEN_PORT = 5000

# Use these to enable sending problems to Sentry
USE_SENTRY = False
SENTRY_DSN = None

# Loading site-specific override settings
import os
extra_settings_path = os.getenv('CHANGELOG_SETTINGS_PATH')
if extra_settings_path is not None:
    try:
        print('Loading user-specified settings from %s' % extra_settings_path)
    except IOError:
        pass
    import imp
    extra_settings_module = imp.load_source('extra_settings', extra_settings_path)
    globals().update(dict([(key, value) for key, value in extra_settings_module.__dict__.items() if not key.startswith('__')]))

try:
    print('Starting with settings: %s' % dict([(key, value) for key, value in globals().items() if key.isupper()]))
except IOError:
    pass
