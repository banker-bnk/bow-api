--sudo apt update
--sudo apt install postgresql-15-cron

--Locate the file (commonly at /etc/postgresql/<version>/main/postgresql.conf or /var/lib/pgsql/<version>/data/postgresql.conf).
--sudo -u postgres nano /path/to/postgresql.conf
--shared_preload_libraries = 'pg_cron'
--sudo systemctl restart postgresql
--cron.database_name = 'bow'
--sudo systemctl restart postgresql

--CREATE EXTENSION pg_cron;

SELECT cron.schedule(
    'set_boolean_daily',
    '0 0 * * *', -- Run at midnight every day
    $$UPDATE gifts
      SET active = TRUE
      WHERE endDate = CURRENT_DATE;$$
);