# Use the 'db' folder

The files inside the 'db' folder are used to test website's backend features communicating with a postgresql db

## The docker-compose

The `docker-compose.yml` file is used to start a db container on your local machine using the `docker.env` as postgres configuration start-up. The postgres db will listen on the port 5438 on your machine.

## The template.sql

The template.sql is mounted inside the postgres container. It used when we want to add new tables or data inside the database.