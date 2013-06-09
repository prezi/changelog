CREATE TABLE events (
    criticality INTEGER NOT NULL,
    unix_timestamp INTEGER NOT NULL,
    category VARCHAR NOT NULL,
    description VARCHAR NOT NULL
);

CREATE INDEX events_criticality_index on events(criticality);
CREATE INDEX events_unix_timestamp_index ON events(unix_timestamp);
CREATE INDEX events_category_index ON events(category);
CREATE UNIQUE INDEX unique_events on events(criticality, unix_timestamp, category, description);
