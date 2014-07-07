import os, sys

PROJECT_DIR = os.path.dirname(__file__)

activate_this = os.path.join(PROJECT_DIR, 'virtualenv', 'bin', 'activate_this.py')
try:
	execfile(activate_this, dict(__file__=activate_this))
except IOError:
	pass #We are not in virtualenv. Do not activate if we can't
sys.path.append(PROJECT_DIR)

def application(environ, start_response):
    if 'CHANGELOG_SETTINGS_PATH' in environ:
        os.environ['CHANGELOG_SETTINGS_PATH'] = environ['CHANGELOG_SETTINGS_PATH']
    from application import app as _application
    return _application(environ, start_response)
