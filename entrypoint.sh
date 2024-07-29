#!/bin/bash

# Generate password protected area
#htpasswd -cb /etc/nginx/.htpasswd ${USERNAME} ${PASSWORD}

# Start php fpm
/etc/init.d/php7.4-fpm start

# Patch index.html to insert config parameter in the global window object
sed -i "s@<script></script>@<script>window.configs={SERVER_URL:\"${SERVER_URL}\"}</script>@" /redirects/index.html

# Patch h5ai-nginx.conf
envsubst '$SOURCIFY_SERVER,$SERVER_PATH_PREFIX' < /etc/nginx/conf.d/h5ai-nginx.conf.template > /etc/nginx/conf.d/h5ai-nginx.conf

# Start nginx
nginx -g "daemon off;"
