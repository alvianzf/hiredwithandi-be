import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const firstNames = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas'];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log('Seeding database...');

  const defaultPassword = 'password123';
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  // 1. Superadmin
  const superadminEmail = process.env.SUPERADMIN_EMAIL || 'superadmin@hiredwithandi.com';
  const existingSuperadmin = await prisma.user.findUnique({ where: { email: superadminEmail } });

  if (!existingSuperadmin) {
    await prisma.user.create({
      data: {
        email: superadminEmail,
        passwordHash: hashedPassword,
        name: 'Super Admin',
        role: 'SUPERADMIN',
      }
    });
    console.log(`Created superadmin: ${superadminEmail}`);
  }

  // 2. Test Organization
  const orgName = 'Test Academy';
  let org = await prisma.organization.findUnique({ where: { name: orgName } });

  if (!org) {
    org = await prisma.organization.create({
      data: {
        name: orgName,
        isTest: true
      }
    });
    console.log(`Created organization: ${orgName}`);
  }

  // 3. Organization Admins
  for (let i = 1; i <= 2; i++) {
    const adminEmail = `admin${i}@testacademy.com`;
    const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (!existingAdmin) {
      await prisma.user.create({
        data: {
          email: adminEmail,
          passwordHash: hashedPassword,
          name: `Admin ${i}`,
          role: 'ADMIN',
          orgId: org.id,
          isTest: true
        }
      });
      console.log(`Created admin: ${adminEmail}`);
    }
  }

  // 4. Batches & Members
  const batchNames = ['Spring 2024', 'Summer 2024', 'Winter 2024'];
  const companies = ['Google', 'Meta', 'Amazon', 'Apple', 'Netflix', 'Microsoft', 'Tesla', 'Airbnb', 'Uber', 'Spotify', 'Twitter', 'LinkedIn', 'Stripe', 'Palantir', 'Adobe'];
  const positions = ['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Fullstack Engineer', 'Mobile Developer', 'Data Scientist', 'DevOps Engineer', 'Security Engineer', 'Product Manager', 'UX Designer'];
  const statusIds = ['wishlist', 'applied', 'hr_interview', 'technical_interview', 'additional_interview', 'offered', 'rejected_company', 'rejected_applicant'];
  const workTypes = ['REMOTE', 'ONSITE', 'HYBRID'];

  async function generateMockJobs(userId: string) {
    const jobCount = getRandomInt(3, 8);
    for (let k = 0; k < jobCount; k++) {
      const company = getRandomElement(companies);
      const position = getRandomElement(positions);
      const status = getRandomElement(statusIds);
      const workType = getRandomElement(workTypes);
      const dateApplied = new Date();
      dateApplied.setDate(dateApplied.getDate() - getRandomInt(1, 30));

      const job = await prisma.job.create({
        data: {
          userId,
          company,
          position,
          status,
          dateApplied,
          boardPosition: k * 1000,
          workType: workType as any,
          location: getRandomElement(['Remote', 'San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA']),
          salary: getRandomInt(80, 180) + 'k',
          notes: 'Mock job generated for testing.',
        }
      });

      // Add history
      await prisma.jobHistory.create({
        data: {
          jobId: job.id,
          status: 'applied',
          enteredAt: dateApplied,
        }
      });

      if (status !== 'applied' && status !== 'wishlist') {
        await prisma.jobHistory.create({
          data: {
            jobId: job.id,
            status: status,
            enteredAt: new Date(),
          }
        });
      }
    }
  }

  for (const name of batchNames) {
    let batch = await prisma.batch.findFirst({
      where: { name, orgId: org.id }
    });

    if (!batch) {
      batch = await prisma.batch.create({
        data: {
          name,
          orgId: org.id
        }
      });
      console.log(`Created batch: ${name}`);
    }

    // Generate 10-15 members per batch
    const memberCount = getRandomInt(10, 15);
    for (let j = 1; j <= memberCount; j++) {
      const firstName = getRandomElement(firstNames);
      const lastName = getRandomElement(lastNames);
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${getRandomInt(100, 999)}@test.com`;

      const existingMember = await prisma.user.findUnique({ where: { email } });
      if (!existingMember) {
        const member = await prisma.user.create({
          data: {
            email,
            passwordHash: hashedPassword,
            name: `${firstName} ${lastName}`,
            role: 'MEMBER',
            orgId: org.id,
            batchId: batch.id,
            isTest: true
          }
        });
        await generateMockJobs(member.id);
      }
    }
    console.log(`Added ${memberCount} members and mock jobs to ${name}`);
  }

  console.log('Seeded successfully. All accounts use "password123"');
}

main()
  .catch((e) => {
    console.error(e);
    // @ts-ignore
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
