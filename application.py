import time
from flask import Flask, render_template
from flask.ext.restful import reqparse, Api, Resource
from db import get_db, close_db_connection_on_app_teardown

app = Flask(__name__)
api = Api(app)


close_db_connection_on_app_teardown(app)


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


class EventList(Resource):
    def get(self):
        query = query_parser.parse_args()
        # time
        filters = ['unix_timestamp >= ?']
        if query['until'] != -1:
            filters.append('unix_timestamp <= ?')
            sql_parameters = [query['until'] - query['hours_ago'] * 3600, query['until']]
        else:
            sql_parameters = [time.time() - query['hours_ago'] * 3600]
        # criticality
        if query['criticality'] is not None:
            criticality = map(int, query['criticality'].split(','))
            filters.append('criticality in (%s)' % ','.join(['?'] * len(criticality)))
            sql_parameters += criticality
        #category
        if query['category'] is not None:
            category = query['category'].split(',')
            filters.append('category in (%s)' % ','.join(['?'] * len(category)))
            sql_parameters += category
        sql = 'select * from events'
        if len(filters) > 0:
            sql += ' where ' + ' and '.join(filters)
        sql += ' order by unix_timestamp desc'
        return get_db().execute(sql, sql_parameters).fetchall()

    def post(self):
        json = json_parser.parse_args()
        db = get_db()
        db.execute('insert into events (criticality, unix_timestamp, description, category) '
                   'VALUES (?, ?, ?, ?)',
                   [json['criticality'], json['unix_timestamp'], json['description'], json['category']])
        db.commit()
        return 'OK', 201


api.add_resource(EventList, '/api/events')


@app.route('/')
def index():
    categories = [row['category'] for row in get_db().execute('select distinct category from events').fetchall()]
    return render_template('index.html', categories=categories)


if __name__ == '__main__':
    app.run(debug=True)
