FROM mysql:8.4.0
WORKDIR ./
COPY ./appWeb/site/src/database/script.sql/ /docker-entrypoint-initdb.d/
ENV MYSQL_ROOT_PASSWORD=MEDTECH123
EXPOSE 3306