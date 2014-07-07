#!/bin/bash
[ -d ./virtualenv ] || virtualenv virtualenv
. virtualenv/bin/activate
pip install -r requirements.txt

cat <<EOF

All done. You can now start the application with
. virtualenv/bin/activate; python application.py

In production, point a WSGI server at application.wsgi

You may want to install a database client binding after
activating the virtualenv.
 - MySQL: pip install -r requirements-mysql.txt
 - PostgreSQL: pip install -r requirements-postgresql.txt
EOF
