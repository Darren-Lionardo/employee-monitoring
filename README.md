## Project Structure

- Backend
  - api -> HTTP Gateway
  - employee-service -> Microservice #1
  - attendance-service -> Microservice #2
- Frontend

## Project setup backend

1. Install Node Packages

```bash
$ npm install
```

2. Copy .env

```bash
$ cp .env.example .env
```

3. Generate prisma files (untuk database)

```bash
$ npx prisma generate
```

4. Jalankan project

```bash
$ npm run start
```

5. Buat akun HRD baru, hit ke project backend/api

```bash
Endpoint: POST /auth/register
Body: {
    "email": "admin@gmail.com",
    "password": "admin"
}
```

## Project setup frontend

1. Install node package

```bash
$ npm install
```

2. Copy .env

```bash
$ cp .env.example .env
```

3. Jalankan project

```bash
$ npm run dev
```

## Route Endpoints

### Authentication

Base path: `/auth`

| Method | Endpoint         | Description                                  |
| ------ | ---------------- | -------------------------------------------- |
| POST   | `/auth/login`    | Login user dan set JWT di HTTP-only cookie   |
| POST   | `/auth/logout`   | Logout user dan hapus JWT cookie             |
| GET    | `/auth/profile`  | Ambil data user yang terautentikasi sekarang |
| POST   | `/auth/register` | Melakukan registrasi HRD (Testing only)      |

---

### Employees (HRD only)

Base path: `/employees`

| Method | Endpoint         | Description                        |
| ------ | ---------------- | ---------------------------------- |
| GET    | `/employees`     | Ambil semua data employees         |
| POST   | `/employees`     | Menambahkan employee baru          |
| GET    | `/employees/:id` | Ambil data employee berdasarkan ID |
| PATCH  | `/employees/:id` | Merubah data employee              |
| DELETE | `/employees/:id` | Menghapus employee                 |

---

### Attendance

Base path: `/attendance`

| Method | Endpoint                  | Description                                     |
| ------ | ------------------------- | ----------------------------------------------- |
| POST   | `/attendance/clock-in`    | Clock in (opsional upload foto) (Employee only) |
| POST   | `/attendance/clock-out`   | Clock out (Employee only)                       |
| GET    | `/attendance/:employeeId` | Ambil data attendance history                   |

---

### File Uploads

| Method | Endpoint             | Description                 |
| ------ | -------------------- | --------------------------- |
| GET    | `/uploads/:filename` | Melihat foto yang di upload |

---

## Authentication & Authorization

- Autentikasi menggunakan **JWT**
- JWT disimpan di **HTTP-only cookies**
- API Gateway mengatur:
  - Validasi JWT
  - Akses kontrol untuk setiap role (HRD/Employee)
- Microservice employee dan attendance berkomunikasi melalui **TCP**

---

## Roles

| Role     | Description                           |
| -------- | ------------------------------------- |
| HRD      | Ketika login, redirect ke /employees  |
| EMPLOYEE | Ketika login, redirect ke /attendance |
