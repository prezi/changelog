FROM ubuntu:17.04

WORKDIR /opt/changelog
ADD . /opt/changelog

# Install system-level dependencies
RUN set -x \
 && apt-get update \
 && apt-get install -y --no-install-recommends \
        python python-dev virtualenv \
        nodejs npm nodejs-legacy \
        sqlite3 \
        libmysqlclient-dev mysql-client \
        build-essential libpq-dev \
        netbase

# Install application-level dependencies and build frontend
RUN set -x \
 && /opt/changelog/setup.sh \
 && /opt/changelog/virtualenv/bin/pip install -r requirements-mysql.txt -r requirements-postgres.txt gunicorn eventlet \
 && cd /opt/changelog \
 && npm run build

# Default configuration
ENV CHANGELOG_SETTINGS_PATH=/tmp/custom_settings.py \
    GUNICORN_WORKER_COUNT=2 \
    LISTEN_HOST=0.0.0.0 \
    LISTEN_PORT=5000

EXPOSE $LISTEN_PORT
CMD /opt/changelog/run.sh
