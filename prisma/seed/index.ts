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
      },
      {
        title: 'Reunião com equipe',
        description: 'Discutir progresso do projeto atual',
        userId: user.id,
        statusId: statusDone.id,
      },
      {
        title: 'Atualizar documentação',
        description: 'Revisar e atualizar documentação técnica',
        userId: user.id,
        statusId: statusTodo.id,
      },
      {
        title: 'Testar nova funcionalidade',
        description: 'Realizar testes na feature X',
        userId: user.id,
        statusId: statusTodo.id,
      },
      {
        title: 'Refatorar código legado',
        description: 'Melhorar estrutura do módulo Y',
        userId: user.id,
        statusId: statusTodo.id,
      },
      {
        title: 'Configurar ambiente de desenvolvimento',
        description: 'Preparar novo ambiente para estagiário',
        userId: user.id,
        statusId: statusDone.id,
      },
      {
        title: 'Revisar pull requests',
        description: 'Analisar PRs pendentes no GitHub',
        userId: user.id,
        statusId: statusTodo.id,
      },
      {
        title: 'Planejar sprint seguinte',
        description: 'Definir tarefas para próxima sprint',
        userId: user.id,
        statusId: statusTodo.id,
      },
      {
        title: 'Integrar API de pagamento',
        description: 'Implementar conexão com novo gateway',
        userId: user.id,
        statusId: statusDone.id,
      },
      {
        title: 'Otimizar consultas ao banco',
        description: 'Melhorar performance das queries SQL',
        userId: user.id,
        statusId: statusTodo.id,
      },
      {
        title: 'Atualizar dependências',
        description: 'Atualizar pacotes para versões mais recentes',
        userId: user.id,
        statusId: statusTodo.id,
      },
      {
        title: 'Criar relatório mensal',
        description: 'Gerar relatório de métricas do mês',
        userId: user.id,
        statusId: statusDone.id,
      },
      {
        title: 'Implementar autenticação OAuth',
        description: 'Adicionar login com Google e Facebook',
        userId: user.id,
        statusId: statusTodo.id,
      },
      {
        title: 'Resolver bugs críticos',
        description: 'Corrigir issues prioritárias',
        userId: user.id,
        statusId: statusDone.id,
      },
      {
        title: 'Treinar novos desenvolvedores',
        description: 'Ministrar treinamento sobre arquitetura',
        userId: user.id,
        statusId: statusTodo.id,
      },
      {
        title: 'Migrar servidor de produção',
        description: 'Realizar migração para nova infraestrutura',
        userId: user.id,
        statusId: statusTodo.id,
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
