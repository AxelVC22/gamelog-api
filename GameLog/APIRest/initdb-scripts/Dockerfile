FROM mcr.microsoft.com/mssql/server:2022-CU14-ubuntu-22.04

USER root
RUN apt-get update && apt-get install -y dos2unix

RUN mkdir -p /usr/config && \
    mkdir -p /var/opt/mssql && \
    chown -R mssql:mssql /var/opt/mssql && \
    chmod -R 750 /var/opt/mssql
WORKDIR /usr/config

COPY . /usr/config/

RUN dos2unix /usr/config/entrypoint.sh
RUN chmod +x /usr/config/entrypoint.sh

ENTRYPOINT ["/usr/config/entrypoint.sh"]
