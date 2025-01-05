import pkg from 'pg';
const { Pool } = pkg;

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });



pool.connect()
  .then(() => console.log('Connected to DB'))
  .catch((err) => console.error('DB Connection Error:', err));
export { prisma };
