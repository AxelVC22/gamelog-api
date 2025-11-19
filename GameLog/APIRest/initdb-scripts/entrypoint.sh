#!/bin/bash

exec /opt/mssql/bin/sqlservr &

SQL_PID=$!

echo "Esperando a que SQL Server esté listo..."
for i in {1..15}; do
    /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P .JUg4d0rL0000g. -Q "SELECT 1" &> /dev/null
    if [ $? -eq 0 ]; then
        echo "SQL Server está listo."
        break
    fi
    echo "Esperando..."
    sleep 1
done

/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P .JUg4d0rL0000g. -d master -i sqlinit.sql -C

wait $SQL_PID
