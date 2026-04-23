FROM php:8.2-cli

WORKDIR /app

# dependências
RUN apt-get update && apt-get install -y \
    git curl zip unzip libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql

# copiar projeto
COPY . .

# composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

RUN composer install --no-dev --optimize-autoloader

# permissões
RUN chmod -R 775 storage bootstrap/cache

EXPOSE 10000

# 🔥 usa servidor embutido do Laravel (SEM Apache)
CMD php artisan serve --host=0.0.0.0 --port=10000