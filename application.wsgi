import os, sys

PROJECT_DIR = '/var/opt/prezi/changelog'

activate_this = os.path.join(PROJECT_DIR, 'virtualenv', 'bin', 'activate_this.py')
execfile(activate_this, dict(__file__=activate_this))
sys.path.append(PROJECT_DIR)

from application import app as application
