import sqlite3
from flask import _app_ctx_stack

import settings


def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d


def connect_db():
    return sqlite3.connect(settings.DB_PATH)


def get_db():
    """Opens a new database connection if there is none yet for the
    current application context.
    """
    top = _app_ctx_stack.top
    if not hasattr(top, 'sqlite_db'):
        sqlite_db = connect_db()
        sqlite_db.row_factory = dict_factory
        top.sqlite_db = sqlite_db

    return top.sqlite_db


def close_db_connection_on_app_teardown(app):
    @app.teardown_appcontext
    def close_db_connection(exception):
        """Closes the database again at the end of the request."""
        top = _app_ctx_stack.top
        if hasattr(top, 'sqlite_db'):
            top.sqlite_db.close()

