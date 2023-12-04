import time
from flask import Flask
import calendar
from datetime import datetime
from flask_restful import reqparse, Api, Resource
import sentry_sdk
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Table, Column, distinct, select
from sqlalchemy.exc import IntegrityError
import settings
from sqlalchemy.orm import declarative_base
from flask_cors import CORS
from flask_compress import Compress

app = Flask(__name__)
Compress(app)

if settings.USE_SENTRY:
    sentry_sdk.init(dsn=settings.SENTRY_DSN, enable_tracing=True)

try:
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///'+settings.DB_PATH
except AttributeError:
    app.config['SQLALCHEMY_DATABASE_URI'] = settings.ALCHEMY_URL

api = Api(app)
db = SQLAlchemy(app)
cors = CORS(app, supports_credentials=True)

json_parser = reqparse.RequestParser()
json_parser.add_argument('criticality', type=int, required=True, location='json')
json_parser.add_argument('unix_timestamp', type=int, required=True, location='json')
json_parser.add_argument('category', type=str, required=True, location='json')
json_parser.add_argument('description', type=str, required=True, location='json')

query_parser = reqparse.RequestParser()
query_parser.add_argument('criticality', type=str)
query_parser.add_argument('hours_ago', type=float, required=True)
query_parser.add_argument('until', type=int)
query_parser.add_argument('category', type=str)
query_parser.add_argument('description', type=str)

annotation_query_parser = reqparse.RequestParser()
annotation_query_parser.add_argument('range', type=dict, required=True, location='json')
annotation_query_parser.add_argument('rangeRaw', type=dict, required=True, location='json')
annotation_query_parser.add_argument('annotation', type=dict, required=True, location='json')
ISO_DATE_STRING = "%Y-%m-%dT%H:%M:%S.%fZ"

Base = declarative_base()
events = Table('events', Base.metadata,
               Column('criticality', db.Integer, index=True),
               Column('unix_timestamp', db.Integer, index=True),
               Column('category', db.String(30), index=True),
               Column('description', db.String(1000), index=True)
               )

with app.app_context():
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


class AnnotationList(Resource):
    def post(self):
        query = annotation_query_parser.parse_args()

        if 'query' not in query['annotation']:  # No tags queried
            return []

        db_query = db.session.query(Event)

        start_date = datetime.strptime(query['range']['from'], ISO_DATE_STRING)
        end_date = datetime.strptime(query['range']['to'], ISO_DATE_STRING)
        category = query['annotation']['query'].split(',')

        db_query = db_query.filter(Event.category.in_(category))

        db_query = db_query.filter(Event.unix_timestamp >= calendar.timegm(start_date.timetuple()))
        db_query = db_query.filter(Event.unix_timestamp <= calendar.timegm(end_date.timetuple()))

        result = db_query.order_by(Event.unix_timestamp.desc()).all()

        events = [
            {
                "annotation": query['annotation'],
                "time": r.unix_timestamp * 1000,
                "title": r.description,
                "tags": [
                    "criticality:{criticality}".format(criticality=r.criticality),
                    "category:{category}".format(category=r.category),
                ],
            } for r in result
        ]
        return events

api.add_resource(EventList, '/api/events')
api.add_resource(AnnotationList, '/annotations')


# Healthcheck, supposing that there is at least one element in the database.
@app.route('/healthcheck')
def healthcheck():
    try:
        db_query = db.session.query(Event)
        db_query = db_query.limit(1)
        result = db_query.all()
        if (len(result) == 0):
            return "1 FAIL: No record is found in the database."
        else:
            return "0 OK: There is at least one record in the database."
    except Exception as e:
        return ("1 FAIL: Some exception occured:\n %s" % str(e))

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/query', methods=['POST'])
def query():
    return '[]', 200

if __name__ == '__main__':
    app.run(debug=True, host=settings.LISTEN_HOST, port=settings.LISTEN_PORT)
