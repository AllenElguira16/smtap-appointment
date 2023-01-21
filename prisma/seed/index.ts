import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

(async () => {
  await prisma.$connect();

  await prisma.user.deleteMany();

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash('12345678', salt);

  await prisma.user.create({
    data: {
      name: 'Admin Admin',
      email: 'admin@admin.com',
      address: 'N/A',
      gender: 'male',
      password,
      role: 'admin',
    },
  });

  await prisma.user.create({
    data: {
      name: 'Carlos John Agas',
      email: 'agas.carlojohn@gmail.com',
      address: 'Dagupan City',
      gender: 'male',
      password,
      createdAt: new Date('2022-11-24'),
    },
  });

  await prisma.user.create({
    data: {
      name: 'Jessel Mae Peralta',
      email: 'peralta.jessel.a@gmail.com',
      address: 'Dagupan City',
      gender: 'female',
      password,
      createdAt: new Date('2022-01-22'),
    },
  });

  await prisma.user.create({
    data: {
      name: 'Christopher Miguel Ferrer',
      email: 'ferrer.christophermiguel.a@gmail.com',
      address: 'Dagupan City',
      gender: 'male',
      password,
      createdAt: new Date('2022-11-19'),
    },
  });

  await prisma.$disconnect();
})();
