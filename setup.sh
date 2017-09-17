#!/bin/bash
[ -d ./virtualenv ] || virtualenv virtualenv
. virtualenv/bin/activate
pip install -r requirements.txt
npm install

cat <<EOF

All done. You can now start the application with

   . virtualenv/bin/activate; python application.py

For development, you'll want to also run the frontend
build process:

    npm run watch

For production, point a WSGI server at application.wsgi.
Build the production client bundle with:

    npm run build

You may want to install a database client binding after
activating the virtualenv.
 - MySQL: pip install -r requirements-mysql.txt
 - PostgreSQL: pip install -r requirements-postgresql.txt
EOF
