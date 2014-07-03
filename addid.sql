ALTER TABLE events
 ADD id INTEGER AFTER description default 0;

BEGIN;
CREATE INDEX pk_events ON events(id);
pragma writable_schema=1;
UPDATE sqlite_master SET name='sqlite_autoindex_events_1',sql=null WHERE name='pk_events';
COMMIT;