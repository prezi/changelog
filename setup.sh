#!/bin/bash
[ -d ./virtualenv ] || virtualenv virtualenv
. virtualenv/bin/activate
pip install -r requirements.txt

echo "All done. You can now start the application with"
echo ". virtualenv/bin/activate; python application.py"
echo
echo "In production, point a WSGI server at application.wsgi"
