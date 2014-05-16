FROM ubuntu:14.04

RUN apt-get update
RUN apt-get install -y python python-dev python-virtualenv sqlite3

ADD . /opt/changelog
RUN cd /opt/changelog && ./setup.sh

RUN /opt/changelog/virtualenv/bin/pip install gunicorn eventlet

CMD cd /opt/changelog && /opt/changelog/virtualenv/bin/gunicorn -w 2 -k eventlet -b 0.0.0.0:8000 application:app