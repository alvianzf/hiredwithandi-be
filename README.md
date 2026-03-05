# HiredWithAndi Backend

![Version](https://img.shields.io/badge/version-v0.5-blue)
![CI/CD](https://github.com/alvianzf/hiredwithandi-be/actions/workflows/ci-cd.yml/badge.svg?branch=main)
![Node.js](https://img.shields.io/badge/Node.js-v22-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-v4.21-000000?style=flat&logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-v5.7-3178C6?style=flat&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-v6.4-2D3748?style=flat&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v16-4169E1?style=flat&logo=postgresql&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-v3.24-3E67B1?style=flat&logo=zod&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-v2.9-3448C5?style=flat&logo=cloudinary&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-v9.0-000000?style=flat&logo=jsonwebtokens&logoColor=white)

A scalable, maintainable, and type-safe backend for the HiredWithAndi ecosystem. Built with Node.js, Express, and PostgreSQL.

## Tech Stack

- **Runtime**: Node.js (v20+)
- **Framework**: Express.js (ESM)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Zod
- **Authentication**: JWT & Bcrypt
- **Storage**: Cloudinary (via Base64 upload)

---

## 🚀 Ubuntu VPS Setup Guide (Nginx + PM2)

This guide assumes a fresh Ubuntu 22.04/24.04 LTS server.

### 1. System Update & Dependencies

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git nginx postgresql postgresql-contrib
```

### 2. Database Setup

Log into PostgreSQL and create the database/user:

```bash
sudo -u postgres psql
```

```sql
CREATE DATABASE hiredwithandi;
CREATE USER hwa_user WITH PASSWORD 'your_strong_password';
GRANT ALL PRIVILEGES ON DATABASE hiredwithandi TO hwa_user;
\q
```

### 3. Node.js Installation (nvm)

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
```

### 4. Application Deployment

```bash
git clone https://github.com/alvianzf/hiredwithandi-be.git
cd hiredwithandi-be
npm install
```

Create `.env` file:

```bash
cp .env.example .env
nano .env
```

Update `DATABASE_URL` to: `postgresql://hwa_user:your_strong_password@localhost:5432/hiredwithandi?schema=public`

Push schema and build:

```bash
npx prisma db push
npm run build
```

### 5. Process Management (PM2)

```bash
npm install -g pm2
pm2 start dist/server.js --name hwa-backend
pm2 save
pm2 startup
```

### 6. Nginx Reverse Proxy

```bash
sudo nano /etc/nginx/sites-available/hwa-backend
```

Add configuration:

```nginx
server {
    listen 80;
    server_name your_domain_or_ip;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and restart:

```bash
sudo ln -s /etc/nginx/sites-available/hwa-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 📖 API Documentation

### Base URL

`https://your-api-domain.com/api`

### 1. Authentication (`/auth`)

**Login Flow:**

1. The frontend first calls `/auth/check-email` to see if the user exists.
2. If `exists: true`, prompt for password and call `/auth/login`.
3. If `exists: false`, prompt for name/password and call `/auth/register`.

| Method | Endpoint            | Description                     | Auth |
| ------ | ------------------- | ------------------------------- | ---- |
| POST   | `/auth/check-email` | Check if email exists in system | None |
| POST   | `/auth/register`    | Register new user               | None |
| POST   | `/auth/login`       | Login and get JWT               | None |
| POST   | `/auth/refresh`     | Refresh access token using RT   | None |

### 2. Organizations (`/`)

| Method | Endpoint         | Description            | Auth | Role       |
| ------ | ---------------- | ---------------------- | ---- | ---------- |
| GET    | `/organizations` | List all organizations | JWT  | Superadmin |
| POST   | `/organizations` | Create organization    | JWT  | Superadmin |

### 3. Users (`/`)

| Method | Endpoint    | Description                | Auth | Role             |
| ------ | ----------- | -------------------------- | ---- | ---------------- |
| GET    | `/students` | List organization students | JWT  | Admin/Superadmin |
| GET    | `/stats`    | Global system stats        | JWT  | Superadmin       |

### 4. Job Tracking (`/jobs`)

| Method | Endpoint           | Description             | Auth |
| ------ | ------------------ | ----------------------- | ---- |
| GET    | `/jobs`            | List all user jobs      | JWT  |
| POST   | `/jobs`            | Create new job post     | JWT  |
| PATCH  | `/jobs/:id/status` | Update job status/order | JWT  |
| PATCH  | `/jobs/:id`        | Update job details      | JWT  |
| DELETE | `/jobs/:id`        | Delete job application  | JWT  |

---

## 📦 Data Models (Sample Payloads)

### Job Object

**Sample Response / Request Body**

```json
{
  "id": "u-u-i-d",
  "company": "Google",
  "position": "Software Engineer",
  "url": "https://careers.google.com/jobs/...",
  "salary": "10k - 15k",
  "notes": "Referral from Andi",
  "workType": "Remote",
  "location": "Jakarta, Indonesia",
  "jobFitPercentage": 85,
  "status": "applied",
  "boardPosition": 1.0,
  "dateApplied": "2024-03-20T10:00:00Z",
  "statusChangedAt": "2024-03-20T10:00:00Z"
}
```

### User / Student Object

**Sample Response**

```json
{
  "id": "u-u-i-d",
  "email": "student@example.com",
  "name": "Alvian Azfa",
  "role": "STUDENT",
  "status": "ACTIVE",
  "orgId": "org-u-u-i-d",
  "bio": "Passionate developer",
  "avatarUrl": "https://..."
}
```

### Authentication Response

**Sample Response (`POST /auth/login`)**

```json
{
  "data": {
    "token": "eyJhbGci...",
    "user": {
      "id": "u-u-i-d",
      "email": "user@example.com",
      "name": "User Name",
      "role": "STUDENT",
      "orgId": "org-uuid"
    }
  }
}
```

---

## Development

**Note**: The backend CORS policy allows requests from all `localhost` and `127.0.0.1` ports to ease local frontend development.

```bash
# Watch mode
npm run dev

# Generate Prisma Client
npx prisma generate

# Database Migration (Push)
npx prisma db push

# Seed Database (Creates default Superadmin based on .env)
# SUPERADMIN_EMAIL and SUPERADMIN_PASSWORD
npx prisma db seed
```
