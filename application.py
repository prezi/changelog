import time
from flask import Flask, render_template
from flask.ext.restful import reqparse, Api, Resource
from raven.contrib.flask import Sentry
from flask.ext.sqlalchemy import SQLAlchemy
from sqlalchemy import Table, Column, distinct, select
from sqlalchemy.exc import IntegrityError
import settings
from sqlalchemy.ext.declarative import declarative_base

app = Flask(__name__)

if settings.USE_SENTRY:
    app.config['SENTRY_DSN'] = settings.SENTRY_DSN
    sentry = Sentry(app)

try:
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///'+settings.DB_PATH
except AttributeError:
    app.config['SQLALCHEMY_DATABASE_URI'] = settings.ALCHEMY_URL

api = Api(app)
db = SQLAlchemy(app)

json_parser = reqparse.RequestParser()
json_parser.add_argument('criticality', type=int, required=True, location='json')
json_parser.add_argument('unix_timestamp', type=int, required=True, location='json')
json_parser.add_argument('category', type=unicode, required=True, location='json')
json_parser.add_argument('description', type=unicode, required=True, location='json')

query_parser = reqparse.RequestParser()
query_parser.add_argument('criticality', type=unicode)
query_parser.add_argument('hours_ago', type=float, required=True)
query_parser.add_argument('until', type=int)
query_parser.add_argument('category', type=unicode)
query_parser.add_argument('description', type=unicode)

Base = declarative_base()
events = Table('events', Base.metadata,
               Column('criticality', db.Integer, index=True),
               Column('unix_timestamp', db.Integer, index=True),
               Column('category', db.String(30), index=True),
               Column('description', db.String(1000), index=True)
               )
Base.metadata.create_all(db.engine)


class Event(db.Model):
    __table__ = events
    __mapper_args__ = {
        'primary_key': [events.c.criticality, events.c.unix_timestamp,
                        events.c.category, events.c.description]
    }
    def __init__(self, criticality, unix_timestamp, category, description):
        self.criticality = criticality
        self.unix_timestamp = unix_timestamp
        self.category = category
        self.description = description


class EventList(Resource):
    def get(self):
        query = query_parser.parse_args()
        db_query = db.session.query(Event)
        # time
        if query['until'] != -1:
            db_query = db_query.filter(Event.unix_timestamp >= query['until'] - query['hours_ago'] * 3600)
            db_query = db_query.filter(Event.unix_timestamp <= query['until'])
        else:
            db_query = db_query.filter(Event.unix_timestamp >= time.time() - query['hours_ago'] * 3600)
        # criticality
        if query['criticality'] is not None:
            criticality = map(int, query['criticality'].split(','))
            db_query = db_query.filter(Event.criticality.in_(criticality))
        #category
        if query['category'] is not None:
            category = query['category'].split(',')
            db_query = db_query.filter(Event.category.in_(category))
        # description
        if query['description'] is not None:
            db_query = db_query.filter(Event.description.like("%%%s%%" % query['description']))
        result = db_query.order_by(Event.unix_timestamp.desc()).all()
        converted = [
            {"criticality": r.criticality,
             "unix_timestamp": r.unix_timestamp,
             "category": r.category,
             "description": r.description} for r in result]
        return converted

    def post(self):
        json = json_parser.parse_args()
        try:
            ev = Event(json['criticality'], json['unix_timestamp'], json['category'], json['description'])
            db.session.add(ev)
            db.session.commit()

        except IntegrityError:
            pass  # This happens if we try to add the same event multiple times
                  # Don't really care about that
        return 'OK', 201


api.add_resource(EventList, '/api/events')


@app.route('/')
def index():
    statement = select([distinct(events.c.category)])
    categories = [str(entry[0]) for entry in db.engine.execute(statement).fetchall()]
    return render_template('index.html', categories=categories)


if __name__ == '__main__':
    app.run(debug=True, host=settings.LISTEN_HOST, port=settings.LISTEN_PORT)
