// prisma/seed-admin.ts
import { PrismaClient } from '../src/generated/prisma';
import { hashPassword } from '../src/lib/auth';

const prisma = new PrismaClient();

async function main() {
  console.log('Creating admin user...');

  // Check if admin already exists
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: 'admin@packlite.com' },
  });

  if (existingAdmin) {
    console.log('Admin user already exists!');
    console.log('Email: admin@packlite.com');
    return;
  }

  // Create admin user
  const hashedPassword = await hashPassword('admin123');

  const admin = await prisma.admin.create({
    data: {
      email: 'admin@packlite.com',
      password: hashedPassword,
      name: 'Admin User',
    },
  });

  console.log('Admin user created successfully!');
  console.log('Email: admin@packlite.com');
  console.log('Password: admin123');
  console.log('\n⚠️  IMPORTANT: Please change this password after first login!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
