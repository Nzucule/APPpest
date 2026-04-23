FROM php:8.2-apache

WORKDIR /var/www/html

# Instalar dependências
RUN apt-get update && apt-get install -y \
    git curl zip unzip libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql

# Ativar mod_rewrite
RUN a2enmod rewrite

# Copiar projeto
COPY . .

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Instalar Laravel
RUN composer install --no-dev --optimize-autoloader

# Permissões
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# 🔥 FORÇAR Apache a usar /public
RUN sed -i 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/000-default.conf
RUN sed -i 's!/var/www/html!/var/www/html/public!g' /etc/apache2/apache2.conf

# Garantir index.php
RUN echo "DirectoryIndex index.php index.html" >> /etc/apache2/apache2.conf

EXPOSE 80

CMD ["apache2-foreground"]