#!/bin/bash

# Generate password protected area
#htpasswd -cb /etc/nginx/.htpasswd ${USERNAME} ${PASSWORD}

# Start php fpm
/etc/init.d/php7.4-fpm start

# Patch index.html to insert config parameter in the global window object
CONFIG_STRING='\
    <script> \
      window.configs = { \
        "SERVER_URL":"'"${SERVER_URL}"'", \
      } \
    </script>'
sed -i "s@<script></script>@${CONFIG_STRING}@" /redirects/index.html

# Start nginx
nginx -g "daemon off;"
