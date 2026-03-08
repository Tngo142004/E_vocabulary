FROM php:8.2-apache

# copy toàn bộ code vào apache
COPY . /var/www/html/

# bật extension mysql
RUN docker-php-ext-install mysqli