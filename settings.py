DB_NAME = 'changelog.db'  # this is the db created by setup.sh; be sure to keep this and the actual db name in sync
LISTEN_PORT = 5000

# Use these to enable sending problems to Sentry
USE_SENTRY = False
SENTRY_DSN = None

# Loading site-specific override settings
import os
extra_settings_path = os.getenv('EXTRA_SETTINGS_PATH')
if extra_settings_path is not None:
    print 'Loading extra settings from %s' % extra_settings_path
    import imp
    extra_settings_module = imp.load_source('extra_settings', extra_settings_path)
    globals().update(dict([(key, value) for key, value in extra_settings_module.__dict__.iteritems() if not key.startswith('__')]))

print 'Starting with settings', dict([(key, value) for key, value in globals().items() if key.isupper()])
