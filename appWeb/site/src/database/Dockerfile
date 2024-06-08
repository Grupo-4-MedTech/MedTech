FROM mysql:8.4.0
WORKDIR ./
COPY ./script.sql ./docker-entrypoint-initdb.d/
ENV MYSQL_ROOT_PASSWORD=medtech123
EXPOSE 3306