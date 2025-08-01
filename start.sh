#!/bin/sh
set -e

# Применяем миграции и сидим данные
npx prisma db push
npx prisma db seed

# Запускаем приложение
exec npm start