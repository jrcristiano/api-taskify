# 🚀 Taskify API

#### API para gerenciamento de tarefas (Taskify), containerizada com Docker e documentada com Swagger.

---

## 🛠️ Como rodar o projeto

- 1 - **docker-compose up --build -d**
- 2 - **cp .env.example .env** deixei informações de exemplo em .env.example para facilitar a iniciação do projeto
- 3 - **docker exec -it taskify_api sh**
- 4 - Dentro do container taskify_api, rode: **npx prisma migrate dev && npm run seed**
- 5 - Para acessar a api: **http://localhost:3000/tasks**
- 6 - Para acessar o swagger acesse: **http://localhost:3000/api-docs** (opcional)


# 📌 Rotas da API - Tasks

Todas as rotas abaixo estão protegidas com autenticação JWT (`@ApiBearerAuth()`).

## 🔐 Header necessário
```
Authorization: Bearer <token>
```

---

## ✅ Criar uma nova tarefa

- **Método:** `POST`
- **Rota:** `/tasks`
- **Body:**
```json
{
  "title": "string",
  "description": "string (opcional)",
  "statusId": 1
}
```
- **Resposta:** `201 Created`

---

## 📄 Listar tarefas paginadas

- **Método:** `GET`
- **Rota:** `/tasks`
- **Query Params (opcionais):**
  - `page`: número da página (ex: `1`)
  - `perPage`: itens por página (ex: `10`)
  - `withTrashed`: incluir tarefas deletadas? (`true | false`)
- **Resposta:** `200 OK`

---

## 🔍 Buscar uma tarefa por ID

- **Método:** `GET`
- **Rota:** `/tasks/:id`
- **Params:**
  - `id`: ID da tarefa
- **Query Params (opcional):**
  - `withTrashed`: incluir se foi deletada (`true | false`)
- **Resposta:** `200 OK`

---

## ✏️ Atualizar uma tarefa por ID

- **Método:** `PATCH`
- **Rota:** `/tasks/:id`
- **Params:**
  - `id`: ID da tarefa
- **Body:**
```json
{
  "title": "string (opcional)",
  "description": "string (opcional)",
  "statusId": 1
}
```
- **Resposta:** `200 OK`

---

## 🗑️ Deletar (soft delete) uma tarefa

- **Método:** `DELETE`
- **Rota:** `/tasks/:id`
- **Params:**
  - `id`: ID da tarefa
- **Resposta:** `204 No Content`

---

## ❌ Forçar deleção permanente

- **Método:** `DELETE`
- **Rota:** `/tasks/:id/force-delete`
- **Params:**
  - `id`: ID da tarefa
- **Resposta:** `204 No Content`

---

## ♻️ Restaurar uma tarefa deletada

- **Método:** `POST`
- **Rota:** `/tasks/:id/restore`
- **Params:**
  - `id`: ID da tarefa
- **Resposta:** `200 OK`

---

## 🔁 Restaurar todas as tarefas deletadas

- **Método:** `POST`
- **Rota:** `/tasks/restore-all`
- **Resposta:** `200 OK`

---
