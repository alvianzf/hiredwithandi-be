# Test Accounts & User Flows

This document provides credentials and instructions for testing the HiredWithAndi ecosystem.

## 🚀 How to Seed Test Data

If you are setting up the project for the first time or want to reset test data, run the following command in the `hiredwithandi` directory:

```bash
npm run build && npx prisma db seed
```

---

## 🔐 Credentials

All accounts use the default password: `password123`

> [!NOTE]
> These accounts are flagged with `isTest: true` and are **excluded** from the Superadmin analytics dashboard to ensure platform metrics only reflect real data.

### 1. Global Superadmin

- **Email**: `superadmin@hiredwithandi.com`
- **Role**: Access to everything across all organizations.

### 2. Organization Admins (Test Academy)

- **Email 1**: `admin1@testacademy.com`
- **Email 2**: `admin2@testacademy.com`
- **Role**: Manage batches and students within "Test Academy".

### 3. Student / Member Accounts

Members are generated with randomized names. You can find them in the `job-admin` dashboard or directly in the database. Examples:

- `james.smith.123@test.com`
- `mary.johnson.456@test.com`

---

## 🔄 User Flows

### 1. Superadmin Flow (System Management)

1. **Login**: Use Superadmin credentials.
2. **System Overview**: View global platform stats (Active Organizations vs Total).
3. **Organizations**: Create a new organization or toggle existing ones (Enable/Disable).
4. **Platform Users**: Global search for any user, reset passwords, or disable accounts.

### 2. Admin Flow (Organization Management)

1. **Login**: Use one of the "Test Academy" admin accounts.
2. **Dashboard**: View organization-specific analytics (Application velocity, Job fit).
3. **Members**: Add students individually or via **Batch CSV Upload**.
4. **Member View**: Click a student to see their personal job tracker and generate a **PDF Report**.
5. **Batches**: Manage batches (Spring/Summer/Winter) and toggle their active status.

### 3. Member Flow (Job Tracking)

1. **Login**: Use a student account.
2. **Kanban**: Drag and drop jobs across stages (Wishlist → Applied → Interviewing).
3. **Analytics**: Review metrics in the Dashboard and view timeline in the Gantt chart.
4. **Read-Only Mode**: If the account or organization is disabled, the user sees a banner and cannot perform any mutations (Add/Edit/Delete).
