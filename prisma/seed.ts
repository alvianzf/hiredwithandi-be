import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const superadminEmail = 'superadmin@hiredwithandi.com';

  const existingSuperadmin = await prisma.user.findUnique({
    where: { email: superadminEmail }
  });

  if (!existingSuperadmin) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const superadmin = await prisma.user.create({
      data: {
        email: superadminEmail,
        passwordHash: hashedPassword,
        name: 'Super Admin',
        role: 'SUPERADMIN',
      }
    });
    console.log(`Created superadmin: ${superadmin.email}`);
  } else {
    console.log('Superadmin already exists.');
  }

  console.log('Seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
