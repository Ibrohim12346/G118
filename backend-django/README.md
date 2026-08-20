# G118 Backend — Django REST Framework

Wholesale clothing store (Premium Bulk) uchun REST API backend.

## Texnologiyalar

| Qatlam | Texnologiya |
|---|---|
| Framework | Django 5.2 + Django REST Framework |
| Auth | JWT (djangorestframework-simplejwt) — access (30 min) + refresh (14 kun) |
| Token saqlash | HttpOnly `access_token` / `refresh_token` cookie'lar |
| Parol hashing | Argon2 (argon2-cffi) |
| Rate limiting | Login urinishlari DB orqali kuzatiladi (5 ta urinish / 15 daqiqa blok) |
| CSRF | Django CsrfViewMiddleware + X-CSRFToken header |
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
python manage.py create_admin --email admin@odega.uz --password Admin1234 --name "Admin" --role superadmin
python manage.py runserver      # http://127.0.0.1:8000
```

> Izoh: Port 8000 band bo'lsa: `python manage.py runserver 127.0.0.1:8001`

## Admin foydalanuvchilarni yaratish

```bash
python manage.py create_admin --email seller@odega.uz --password Seller1234 --role seller
python manage.py create_admin --email manager@odega.uz --password Manager1234 --role manager
```

Rollar: `superadmin`, `admin`, `manager`, `seller`.

## Auth API Endpointlar

Barcha `POST` endpointlar **X-CSRFToken** header talab qiladi. Avval:

```bash
curl http://127.0.0.1:8000/api/auth/csrf/   # csrftoken cookie'sini o'rnatadi
```

| Metod | Endpoint | Tavsif | Ruxsat |
|---|---|---|---|
| GET | `/api/auth/csrf/` | CSRF token + cookie | Ochiq |
| POST | `/api/auth/login/` | Login — access+refresh cookie'lar | Ochiq |
| POST | `/api/auth/register/` | Admin yaratish (`email`, `password`, `role`) | Superadmin |
| POST | `/api/auth/logout/` | Refresh tokenni blacklist qilish, cookie'lar | Autentifikatsiya |
| GET | `/api/auth/me/` | Joriy foydalanuvchi | Autentifikatsiya |
| POST | `/api/auth/refresh/` | Refresh orqali access yangilash (rotation) | Ochiq (cookie) |
| POST | `/api/auth/forgot-password/` | Emailga reset havola | Ochiq |
| POST | `/api/auth/reset-password/` | Yangi parol (`token`, `password`, `confirm_password`) | Ochiq |
| POST | `/api/auth/change-password/` | Parolni o'zgartirish + sessiyalarni invalidate | Autentifikatsiya |
| GET | `/api/auth/users/` | Adminlar ro'yxati | Superadmin |
| PATCH | `/api/auth/users/{id}/` | Rol / bloklash | Superadmin |
| DELETE | `/api/auth/users/{id}/` | Foydalanuvchini o'chirish | Superadmin |
| GET | `/api/admin/stats/` | Dashboard statistikasi | superadmin/admin/manager |
| GET | `/api/admin/customers/` | Mijozlar (buyurtmalardan agregatsiya) | superadmin/admin/manager |

### Login request

```json
{ "email": "admin@odega.uz", "password": "Admin1234" }
```

### Login response

```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "Admin",
    "email": "admin@odega.uz",
    "username": "admin",
    "role": "superadmin",
    "role_label": "Super Admin"
  },
  "message": "Login successful"
}
```

Tokenlar `Set-Cookie` orqali yuboriladi:

```
Set-Cookie: access_token=...; HttpOnly; SameSite=Lax; Path=/
Set-Cookie: refresh_token=...; HttpOnly; SameSite=Lax; Path=/
```

Production'da cookie'lar `Secure` flag bilan yuboriladi (`DJANGO_DEBUG=False`).

## Role-based ruxsatlar (backend majburiy)

| Rol | Ruxsat |
|---|---|
| superadmin | Hamma narsa (Adminlar boshqaruvi) |
| admin | Dashboard, Mahsulotlar, Buyurtmalar, Mijozlar, Kategoriyalar, Statistika |
| manager | Dashboard, Buyurtmalar, Mijozlar, Mahsulotlarni ko'rish |
| seller | Mahsulotlarni ko'rish, Buyurtmalarni ko'rish, Status o'zgartirish |

Frontend'da role tekshiruvidan tashqari backend'da ham `accounts.permissions` sinflari
(`IsSuperAdmin`, `IsAdminOrAbove`, `IsManagerOrAbove`, `IsStaffRole`) orqali
majburiy tekshiruv amalga oshiriladi.

## Mahsulot API Endpointlar

| Metod | Endpoint | Tavsif | Ruxsat |
|---|---|---|---|
| GET | `/api/products/` | Mahsulotlar ro'yxati | Ochiq |
| GET | `/api/products/?category=Men's Wear` | Kategoriya bo'yicha filtr | Ochiq |
| GET | `/api/products/?featured=true` | Tanlanganlar | Ochiq |
| GET | `/api/products/?search=jacket` | Qidiruv | Ochiq |
| GET | `/api/products/{id}/` | Bitta mahsulot | Ochiq |
| POST | `/api/products/` | Mahsulot yaratish | superadmin/admin |
| PATCH | `/api/products/{id}/` | Mahsulotni tahrirlash | superadmin/admin |
| DELETE | `/api/products/{id}/` | Mahsulotni o'chirish | superadmin/admin |
| GET | `/api/categories/` | Kategoriyalar | Ochiq |
| POST | `/api/categories/` | Kategoriya yaratish | superadmin/admin |
| GET | `/api/reviews/` | Sharhlar | Ochiq |
| POST | `/api/reviews/` | Sharh qoldirish | Ochiq |
| POST | `/api/orders/` | Buyurtma berish | Ochiq |
| GET | `/api/orders/` | Buyurtmalar | Admin panel (barcha rollar) |
| PATCH | `/api/orders/{id}/` | Status o'zgartirish | Admin panel (barcha rollar) |
| POST | `/api/subscribers/` | Newsletter obuna | Ochiq |

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

- **CSRF** — `X-CSRFToken` header + `csrftoken` cookie (`/api/auth/csrf/` orqali)
- **JWT** — access 30 daqiqa, refresh 14 kun, refresh rotation + blacklist
- **HttpOnly cookie** — tokenlar JS'dan o'qilmaydi, localStorage'ga yozilmaydi
- **Parol hashing** — Argon2
- **Brute-force himoyasi** — har bir email+IP uchun 5 urinish, keyin 15 daqiqa blok
- **Account bloklash** — `is_blocked` (Profile) orqali
- **Sessiya invalidatsiyasi** — parol o'zgarganda barcha refresh token va sessiyalar o'chiriladi
- **Backend authorization** — har bir admin endpoint roli backend'da tekshiriladi
- **SECRET_KEY** — `.env` orqali, prod'da o'zgartirish kerak