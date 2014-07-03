#!/bin/bash
[ -d ./virtualenv ] || virtualenv virtualenv
. virtualenv/bin/activate
pip install -r requirements.txt

echo "Upgrading database"
sqlite3 changelog.db < addid.sql
