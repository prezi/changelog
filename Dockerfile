FROM ubuntu:14.04

WORKDIR /opt/changelog
ADD . /opt/changelog

RUN apt-get update && \
    apt-get install -y python python-dev python-virtualenv \
                       sqlite3 \
                       libmysqlclient-dev mysql-client \
                       libpq-dev && \
    apt-get clean && \
    /opt/changelog/setup.sh && \
    /opt/changelog/virtualenv/bin/pip install -r requirements-mysql.txt -r requirements-postgres.txt gunicorn gevent

CMD /opt/changelog/run.sh
