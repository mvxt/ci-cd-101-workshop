# Version 1.0
FROM nginx:alpine

# WORKDIR
WORKDIR /usr/share/nginx/html/

# NGINX Config
COPY ./etc/nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy website files
COPY index.html \
  dirs.tar.gz \
  ./

# Untar the tarball
RUN tar -xzf dirs.tar.gz
