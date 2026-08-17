# G118 Backend — Django REST Framework

Wholesale clothing store (Premium Bulk) uchun REST API backend.

## Texnologiyalar

| Qatlam | Texnologiya |
|---|---|
| Framework | Django 5.2 + Django REST Framework |
| Auth | JWT (djangorestframework-simplejwt) |
| CORS | django-cors-headers (React frontend uchun) |
| Ma'lumotlar bazasi | SQLite (dev) — PostgreSQL ga almashtirish mumkin |
| Rasmlar | Pillow (ImageField) |

## O'rnatish

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows
pip install -r requirements.txt
copy .env.example .env          # Windows
python manage.py migrate
python manage.py seed           # namunaviy ma'lumotlar
python manage.py createsuperuser
python manage.py runserver      # http://127.0.0.1:8000
```

> Izoh: Port 8000 band bo'lsa: `python manage.py runserver 127.0.0.1:8001`

## API Endpointlar

| Metod | Endpoint | Tavsif | Ruxsat |
|---|---|---|---|
| GET | `/api/products/` | Mahsulotlar ro'yxati | Ochiq |
| GET | `/api/products/?category=Men's Wear` | Kategoriya bo'yicha filtr | Ochiq |
| GET | `/api/products/?featured=true` | Tanlanganlar | Ochiq |
| GET | `/api/products/?search=jacket` | Qidiruv | Ochiq |
| GET | `/api/products/{id}/` | Bitta mahsulot | Ochiq |
| POST | `/api/products/` | Mahsulot yaratish | Admin |
| GET | `/api/categories/` | Kategoriyalar | Ochiq |
| GET | `/api/reviews/` | Sharhlar | Ochiq |
| POST | `/api/reviews/` | Sharh qoldirish | Ochiq |
| POST | `/api/orders/` | Buyurtma berish | Ochiq |
| GET | `/api/orders/` | Buyurtmalar | Admin |
| POST | `/api/subscribers/` | Newsletter obuna | Ochiq |
| POST | `/api/token/` | JWT token olish (`username`, `password`) | Ochiq |
| POST | `/api/token/refresh/` | Access tokenni yangilash | Ochiq |

Admin panel: `http://127.0.0.1:8000/admin/`

## Buyurtma formati

```json
{
  "full_name": "Ali",
  "phone": "+998900000000",
  "email": "ali@example.com",
  "address": "Tashkent",
  "note": "optional",
  "items": [
    { "product": 1, "quantity": 2 }
  ]
}
```

Total price server tomonida avtomatik hisoblanadi.

## Xavfsizlik

Django o'rnatilgan himoyalar (default):

- **CSRF** — `CsrfViewMiddleware` (formlar uchun)
- **XSS** — template auto-escaping + `XFrameOptionsMiddleware`
- **SQL injection** — ORM parameterized queries
- **Password hashing** — PBKDF2 (bcrypt/argon2 ga almashtirish mumkin)
- **JWT auth** — SimpleJWT access + refresh token
- **SECRET_KEY** — `.env` orqali, prod'da o'zgartirish kerak