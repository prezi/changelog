FROM ubuntu:jammy

ENV DEBIAN_FRONTEND=noninteractive

# Install system-level dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        python3 python3-dev python3-pip python3-mysqldb \
        sqlite3 \
        netbase \
        gzip \
        curl && \
    rm -rf /var/lib/apt/lists/*


ARG NODEJS_VERSION=v20.10.0
# Installing nodejs from nodesource.com installs unwanted python distributions as dependencies
# Downloading gzipped distribution instead
RUN curl https://nodejs.org/dist/$NODEJS_VERSION/node-$NODEJS_VERSION-linux-x64.tar.gz -fsS | tar -xz --strip-components=1 -C /usr/local

WORKDIR /opt/changelog

COPY requirements*.txt .

# Install application-level dependencies and build frontend
RUN python3 -m pip install -r requirements.txt -r requirements-mysql.txt -r requirements-postgres.txt gunicorn eventlet

COPY package*json .
COPY npm-shrinkwrap.json .
COPY webpack*js .

RUN npm install
COPY . /opt/changelog
RUN npm run build

# Default configuration
ENV CHANGELOG_SETTINGS_PATH=/tmp/custom_settings.py \
    GUNICORN_WORKER_COUNT=2 \
    LISTEN_HOST=0.0.0.0 \
    LISTEN_PORT=5000

EXPOSE $LISTEN_PORT
CMD ["/opt/changelog/run.sh"]
