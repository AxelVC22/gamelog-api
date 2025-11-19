#!/bin/sh

if [ ! -f /etc/nginx/cert.pem ]; then
    openssl req -x509 -newkey rsa:4096 -nodes \
        -keyout /etc/nginx/key.pem \
        -out /etc/nginx/cert.pem \
        -days 365 \
        -subj "/CN=gamelog.com"
    chmod 644 /etc/nginx/cert.pem /etc/nginx/key.pem
fi

exec /docker-entrypoint.sh "$@"