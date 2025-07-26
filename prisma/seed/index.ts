import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const statusTodo = await prisma.status.upsert({
    where: { name: 'Pendente' },
    update: {},
    create: {
      name: 'Pendente',
    },
  });

  const statusDone = await prisma.status.upsert({
    where: { name: 'Concluída' },
    update: {},
    create: {
      name: 'Concluída',
    },
  });

  const encryptedPassword = await bcrypt.hash('password', 10);

  const user = await prisma.user.upsert({
    where: { email: 'admin@gsw.com' },
    update: {},
    create: {
      name: 'Admin',
      lastname: 'User',
      email: 'admin@gsw.com',
      password: encryptedPassword,
    },
  });

  await prisma.task.createMany({
    data: [
      {
        title: 'Tarefa 1',
        description: 'Descrição da tarefa 1',
        userId: user.id,
        statusId: statusDone.id,
      },
      {
        title: 'Tarefa 2',
        description: 'Descrição da tarefa 2',
        userId: user.id,
        statusId: statusTodo.id,
				deletedAt: new Date,
      },
    ],
  });

  console.log('Seed concluído.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
