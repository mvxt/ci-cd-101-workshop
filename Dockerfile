# Version 1.0
FROM nginx:alpine

# WORKDIR
WORKDIR /usr/share/nginx/html/

# NGINX Config
COPY ./etc/nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy website files
COPY index.html \
  css \
  img \
  js \
  mail \
  scss \
  ./

