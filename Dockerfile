FROM node:14.14-alpine
RUN apk add --no-cache git python2 make g++
RUN git clone https://github.com/sourcifyeth/h5ai.git

ARG HIDE_OPEN_IN_REMIX
COPY hide-open-in-remix.patch /hide-open-in-remix.patch 
RUN if [ "$HIDE_OPEN_IN_REMIX" = "1" ]; then cd h5ai && git apply --verbose /hide-open-in-remix.patch; fi

RUN cd h5ai && npm install && npm run build 
RUN mv $(ls -1 /h5ai/build/*.zip) /h5ai/build/h5ai.zip
RUN ls /h5ai/build/

# Build the form page
COPY select-contract-form/ /select-contract-form 
RUN mkdir /redirects
WORKDIR /select-contract-form 
RUN npm install
RUN npm run build

# Specific version to avoid apt version change
FROM nginx:1.20.2

ENV DEBIAN_FRONTEND=noninteractive

COPY --from=0 /h5ai/build/h5ai.zip /tmp/h5ai.zip
COPY --from=0 /redirects /redirects

# Avoid version mismatch on php-fpm
RUN apt update && \
	apt install -y --no-install-recommends php-fpm apache2-utils wget ca-certificates unzip zip && \
	mkdir /repository && \
	unzip /tmp/h5ai.zip -d /h5ai && \
	chown -R www-data: /h5ai/ && \
	rm -f /etc/nginx/conf.d/* /tmp/* && \
	usermod -aG www-data nginx

# Fix data location
COPY class-setup.php /h5ai/_h5ai/private/php/core/class-setup.php

# Copy entrypoint
COPY entrypoint.sh /root/entrypoint.sh
RUN chmod +x /root/entrypoint.sh

RUN apt install curl -y 

COPY options.json /h5ai/_h5ai/private/conf/options.json
COPY types.json /h5ai/_h5ai/private/conf/types.json 

RUN apt install -y php-mbstring

COPY formatAddress.php /h5ai/_h5ai/public/formatAddress.php
COPY Kekkak.php /h5ai/_h5ai/public/Kekkak.php

# Create nginx configuration
COPY h5ai-nginx.conf.template /etc/nginx/conf.d/h5ai-nginx.conf.template

COPY nginx.conf /etc/nginx/nginx.conf

CMD ["bash", "/root/entrypoint.sh"] 

LABEL org.opencontainers.image.source https://github.com/ethereum/sourcify
LABEL org.opencontainers.image.licenses MIT
