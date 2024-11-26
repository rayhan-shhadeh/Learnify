import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$connect();
    const users = await prisma.answer.findMany();  // Example: Change 'user' to your actual model

  console.log('Database connection successful');

console.log(users);
  } catch (error) {
    console.error('Error connecting to the database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
