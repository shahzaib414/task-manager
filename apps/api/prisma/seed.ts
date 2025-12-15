import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Add your seed data here
  // Example:
  // await prisma.user.createMany({
  //   data: [
  //     { email: 'user1@example.com', name: 'User 1' },
  //     { email: 'user2@example.com', name: 'User 2' },
  //   ],
  // });

  console.log('Database seed completed!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
