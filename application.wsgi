import os, sys

PROJECT_DIR = '/opt/prezi/changelog'

activate_this = os.path.join(PROJECT_DIR, 'virtualenv', 'bin', 'activate_this.py')
execfile(activate_this, dict(__file__=activate_this))
sys.path.append(PROJECT_DIR)

import db
db.DATABASE = os.path.join(PROJECT_DIR, db.DATABASE)

from application import app as application
