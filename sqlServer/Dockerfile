
FROM mcr.microsoft.com/mssql/server:2019-latest
WORKDIR ./
COPY /appWeb/site/src/database/sqlserver.sql sqlserver.sql

ENV SA_PASSWORD=#Gf24030085830

ENV ACCEPT_EULA=Y
RUN cp sqlserver.sql /tmp

##  /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P '#Gf24030085830' -i /tmp/sqlserver.sql
##  /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P '#Gf24030085830'

##  USE medtech;
##  GO

## SELECT * FROM hospital;
## GO


EXPOSE 1433
CMD ["/opt/mssql/bin/sqlservr"]