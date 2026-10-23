#!/bin/sh
set -e
echo "Veritabanı bekleniyor..."
i=0
until node -e "const {Client}=require('pg');const c=new Client({connectionString:process.env.DATABASE_URL});c.connect().then(()=>c.end()).then(()=>process.exit(0)).catch(()=>process.exit(1))"; do
  i=$((i+1)); [ $i -gt 60 ] && echo "Veritabanına bağlanılamadı" && exit 1; sleep 2
done
echo "Migration uygulanıyor..."
npx drizzle-kit migrate
echo "Tohum veri (İK admin, seviye tanımları, kanıt türleri)..."
npx tsx scripts/seed.ts
npx tsx scripts/seed-library.ts
echo "Uygulama başlıyor (konteyner içi port ${PORT:-3000}; dışarıdan compose ile http://localhost:3080/giris)"
exec npx next start -p "${PORT:-3000}"
