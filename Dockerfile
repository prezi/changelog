FROM ubuntu:jammy

ENV DEBIAN_FRONTEND=noninteractive

# Install system-level dependencies
# python-is-python3 is required to keep compatibility with ancient node libraries (node-sass, using node-gyp)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        python3 python3-dev python3-pip \
        python-is-python3 \
        sqlite3 \
        netbase \
        gzip \
        curl && \
    rm -rf /var/lib/apt/lists/*


# it's ancient, will be upgraded later
ARG NODEJS_VERSION=v4.2.6
# Installing nodejs from nodesource.com installs unwanted python distributions as dependencies
# Downloading gzipped distribution instead
RUN curl https://nodejs.org/dist/$NODEJS_VERSION/node-$NODEJS_VERSION-linux-x64.tar.gz -fsS | tar -xz --strip-components=1 -C /usr/local

WORKDIR /opt/changelog

COPY requirements*.txt .

# Install application-level dependencies and build frontend
RUN python3 -m pip install -r requirements.txt -r requirements-mysql.txt -r requirements-postgres.txt gunicorn eventlet

COPY package*json .

RUN npm install
RUN npm run build

COPY . /opt/changelog

# Default configuration
ENV CHANGELOG_SETTINGS_PATH=/tmp/custom_settings.py \
    GUNICORN_WORKER_COUNT=2 \
    LISTEN_HOST=0.0.0.0 \
    LISTEN_PORT=5000

EXPOSE $LISTEN_PORT
CMD ["/opt/changelog/run.sh"]
