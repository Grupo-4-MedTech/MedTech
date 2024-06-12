
FROM mcr.microsoft.com/mssql/server:2019-latest
WORKDIR ./
## COPY /appWeb/site/src/database/sqlserver.sql sqlserver.sql

ENV SA_PASSWORD=medtech123

ENV ACCEPT_EULA=Y
## RUN cp sqlserver.sql /tmp

##  /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P '' -i /tmp/sqlserver.sql
##  /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P ''

##  USE medtech;
##  GO

## SELECT * FROM hospital;
## GO


EXPOSE 1433
CMD ["/opt/mssql/bin/sqlservr"]