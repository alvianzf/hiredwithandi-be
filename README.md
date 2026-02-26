# HiredWithAndi Backend

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

| Method | Endpoint         | Description       | Auth |
| ------ | ---------------- | ----------------- | ---- |
| POST   | `/auth/register` | Register new user | None |
| POST   | `/auth/login`    | Login and get JWT | None |

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
  "workType": "REMOTE",
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

```bash
# Watch mode
npm run dev

# Generate Prisma Client
npx prisma generate

# Database Migration (Push)
npx prisma db push
```
