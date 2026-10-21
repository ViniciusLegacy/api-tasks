# 📋 API Tasks

API RESTful para o **gerenciamento de tarefas de times de desenvolvimento**. Com ela é possível cadastrar usuários, autenticar com JWT, criar times, adicionar membros, criar e atribuir tarefas, filtrar tarefas por status ou prioridade e consultar o histórico de mudanças de status de cada tarefa.

O acesso é controlado por papéis (`admin` e `member`): administradores gerenciam times, membros e todas as tarefas; membros gerenciam apenas as tarefas atribuídas a eles.

> 🎓 **Projeto de estudo**
> Esta API foi desenvolvida para estudar e praticar conceitos como:
> - Arquitetura de **API RESTful** com Node.js e Express
> - **TypeScript** no back-end
> - Modelagem de **banco de dados relacional** (PostgreSQL) com **Prisma ORM** e migrations
> - **Autenticação** com JWT e **autorização** por papéis (RBAC)
> - **Validação de dados** com Zod
> - **Testes automatizados** com Jest e Supertest
> - Conteinerização com **Docker** e **Docker Compose**
> - **Deploy** em nuvem (Render)

---

## 🚀 API em produção

A API está no ar em: **https://api-tasks-g4u0.onrender.com**

> ⚠️ Por se tratar de um projeto de estudo, a API ficará disponível **até 20/11/2026** (30 dias a partir de 21/10/2026).
> Ela está hospedada no plano gratuito do Render, então a **primeira requisição pode demorar alguns segundos** enquanto o serviço "acorda".

Exemplo rápido:

```bash
curl -X POST https://api-tasks-g4u0.onrender.com/users \
  -H "Content-Type: application/json" \
  -d '{"name": "João Silva", "email": "joao@email.com", "password": "123456"}'
```

---

## 📑 Sumário

- [Tecnologias](#️-tecnologias)
- [Funcionalidades e regras de negócio](#-funcionalidades-e-regras-de-negócio)
- [Estrutura do projeto](#-estrutura-do-projeto)
- [Modelo de dados](#️-modelo-de-dados)
- [Como rodar o projeto](#️-como-rodar-o-projeto)
- [Testes](#-testes)
- [Autenticação](#-autenticação)
- [Endpoints](#-endpoints)
- [Tratamento de erros](#-tratamento-de-erros)
- [Scripts](#-scripts)

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
| --- | --- |
| [Node.js 22](https://nodejs.org/) | Ambiente de execução |
| [TypeScript](https://www.typescriptlang.org/) | Tipagem estática |
| [Express 5](https://expressjs.com/) | Framework HTTP / rotas |
| [Prisma ORM 7](https://www.prisma.io/) + `@prisma/adapter-pg` | ORM, migrations e acesso ao banco |
| [PostgreSQL 17](https://www.postgresql.org/) | Banco de dados relacional |
| [Zod 4](https://zod.dev/) | Validação de body, params, query e variáveis de ambiente |
| [JSON Web Token](https://github.com/auth0/node-jsonwebtoken) | Autenticação (token válido por 1 dia) |
| [bcrypt](https://github.com/kelektiv/node.bcrypt.js) | Hash de senhas |
| [Jest](https://jestjs.io/) + ts-jest + [Supertest](https://github.com/ladjs/supertest) | Testes automatizados de integração |
| [tsx](https://github.com/privatenumber/tsx) | Execução em modo de desenvolvimento (watch) |
| [tsup](https://tsup.egoist.dev/) | Build para produção |
| [Docker](https://www.docker.com/) + Docker Compose | Conteinerização da API e do banco |
| [Render](https://render.com/) | Hospedagem |

---

## ✨ Funcionalidades e regras de negócio

- **Usuários**
  - Cadastro público; todo usuário é criado com o papel `member`.
  - E-mail único; nome com no mínimo 3 caracteres; senha com no mínimo 6 caracteres.
  - A senha é armazenada com hash (bcrypt) e nunca é retornada nas respostas.
- **Sessões**: login com e-mail e senha retorna um token JWT válido por 1 dia.
- **Times** (somente `admin`): criar, listar, editar e remover. O nome deve ser único e ter no mínimo 3 caracteres.
- **Membros de times**
  - Adicionar e remover membros: somente `admin`.
  - Listar membros de um time: qualquer usuário autenticado.
  - Um usuário não pode ser adicionado duas vezes ao mesmo time.
- **Tarefas**
  - Ao ser criada, a tarefa é atribuída ao usuário autenticado.
  - `admin` visualiza e gerencia todas as tarefas; `member` visualiza e gerencia **apenas as tarefas atribuídas a ele** (caso contrário recebe `403`).
  - Status: `pending` (padrão) | `in_progress` | `completed`.
  - Prioridade: `low` | `medium` (padrão) | `high`.
  - Filtros por status e por prioridade.
  - Reatribuição da tarefa a outro usuário.
- **Histórico**: toda alteração de status gera um registro com o status antigo, o novo status, quem alterou e quando.

---

## 📁 Estrutura do projeto

```
api-tasks/
├── prisma/
│   ├── migrations/          # Migrations geradas pelo Prisma
│   └── schema.prisma        # Modelos, enums e relacionamentos do banco
├── src/
│   ├── config/
│   │   └── auth.ts          # Configuração do JWT (secret e expiração)
│   ├── controllers/         # Regras de negócio de cada recurso
│   ├── database/
│   │   └── prisma.ts        # Instância do Prisma Client (adapter pg)
│   ├── middlewares/
│   │   ├── ensure-authenticated.ts     # Valida o token JWT
│   │   ├── verifyUserAuthorization.ts  # Valida o papel do usuário (admin/member)
│   │   └── error-handling.ts           # Tratamento global de erros
│   ├── routes/              # Definição das rotas por recurso
│   ├── tests/               # Testes de integração (Jest + Supertest)
│   ├── types/
│   │   └── express.d.ts     # Tipagem de request.user
│   ├── utils/
│   │   └── AppError.ts      # Classe de erro da aplicação
│   ├── app.ts               # Configuração do Express
│   ├── env.ts               # Validação das variáveis de ambiente (Zod)
│   └── server.ts            # Inicialização do servidor
├── .env.example             # Modelo das variáveis de ambiente
├── docker-compose.yml       # API + PostgreSQL
├── Dockerfile               # Imagem da API
├── jest.config.ts           # Configuração do Jest
├── prisma.config.ts         # Configuração do Prisma
├── tsconfig.json
└── package.json
```

---

## 🗄️ Modelo de dados

```mermaid
erDiagram
    users ||--o{ team_members : "participa"
    teams ||--o{ team_members : "possui"
    teams ||--o{ tasks : "possui"
    users |o--o{ tasks : "responsável"
    tasks ||--o{ tasks_history : "registra"
    users ||--o{ tasks_history : "altera"

    users {
        uuid id PK
        string name
        string email UK
        string password
        enum role "admin | member"
        datetime created_at
        datetime updated_at
    }
    teams {
        uuid id PK
        string name
        string description "opcional"
        datetime created_at
        datetime updated_at
    }
    team_members {
        uuid id PK
        uuid user_id FK
        uuid team_id FK
        datetime created_at
    }
    tasks {
        uuid id PK
        string title
        string description "opcional"
        enum status "pending | in_progress | completed"
        enum priority "high | medium | low"
        uuid assigned_to FK "opcional"
        uuid team_id FK
        datetime created_at
        datetime updated_at
    }
    tasks_history {
        uuid id PK
        uuid task_id FK
        uuid changed_by FK
        enum old_status
        enum new_status
        datetime changed_at
    }
```

- `team_members` possui restrição de unicidade em (`user_id`, `team_id`).
- Ao remover um usuário ou time, os vínculos em `team_members` são removidos em cascata.
- Ao remover um time, suas tarefas são removidas em cascata; ao remover um usuário, o campo `assigned_to` das tarefas dele fica `null`.

---

## ▶️ Como rodar o projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) 22+
- npm
- [Docker](https://www.docker.com/) e Docker Compose

### 1. Clonar e configurar as variáveis de ambiente

```bash
git clone https://github.com/ViniciusLegacy/api-tasks.git
cd api-tasks
cp .env.example .env
```

Preencha o arquivo `.env`:

| Variável | Descrição | Exemplo |
| --- | --- | --- |
| `DATABASE_URL` | URL de conexão do PostgreSQL | `postgresql://postgres:postgres@localhost:5432/api-tasks` |
| `JWT_SECRET` | Chave usada para assinar os tokens | `uma-chave-secreta` |
| `PORT` | Porta da API (padrão `3333`) | `3333` |

### Opção A — Tudo com Docker Compose

Sobe a API e o PostgreSQL em containers:

```bash
docker compose up -d --build

# aplica as migrations no banco
docker compose exec api npx prisma migrate deploy
```

A API ficará disponível em `http://localhost:3333`.

> No Compose, a `DATABASE_URL` da API é sobrescrita para apontar para o container `postgres`.

### Opção B — API local + banco no Docker

```bash
npm install

# sobe apenas o PostgreSQL
docker compose up -d postgres

# aplica as migrations e gera o Prisma Client
npx prisma migrate dev
npx prisma generate

# inicia em modo desenvolvimento (watch)
npm run dev
```

### Build de produção

```bash
npm run build   # gera a pasta build/
npm start       # executa build/server.js
```

### Tornando um usuário administrador

Não existe endpoint para promover usuários (todos são criados como `member`). Para testar as rotas de `admin`, altere o campo `role` diretamente no banco, por exemplo com o Prisma Studio:

```bash
npx prisma studio
```

ou via SQL:

```sql
UPDATE users SET role = 'admin' WHERE email = 'joao@email.com';
```

---

## 🧪 Testes

Os testes são de **integração**: usam o Supertest para fazer requisições reais à aplicação, que por sua vez acessa o banco de dados configurado no `.env`. Por isso, antes de rodar os testes, o banco precisa estar no ar e com as migrations aplicadas.

```bash
npm run test:dev
```

O Jest roda em modo watch e com `--runInBand` (testes em série, para evitar conflitos no banco).

| Arquivo | O que é testado |
| --- | --- |
| `src/tests/sessions-controller.test.ts` | Autenticação e geração de token |
| `src/tests/teams-controller.test.ts` | Criação, edição e remoção de times; falta de permissão; falta de token; validação |
| `src/tests/tasks-controller.test.ts` | Criação, edição e remoção de tarefas; falta de token; validação de prioridade |

---

## 🔐 Autenticação

1. Crie um usuário em `POST /users`.
2. Faça login em `POST /sessions` para obter o token.
3. Envie o token no header das rotas protegidas:

```
Authorization: Bearer <token>
```

---

## 📡 Endpoints

URL base local: `http://localhost:3333` — produção: `https://api-tasks-g4u0.onrender.com`

### Resumo

| Método | Rota | Autenticação | Papel |
| --- | --- | :---: | --- |
| `POST` | `/users` | ❌ | — |
| `POST` | `/sessions` | ❌ | — |
| `POST` | `/teams` | ✅ | admin |
| `GET` | `/teams` | ✅ | admin |
| `PUT` | `/teams/:id` | ✅ | admin |
| `DELETE` | `/teams/:id/remove` | ✅ | admin |
| `POST` | `/members/:team_id/add` | ✅ | admin |
| `DELETE` | `/members/:id/remove` | ✅ | admin |
| `GET` | `/members/:team_id/show` | ✅ | admin, member |
| `POST` | `/tasks` | ✅ | admin, member |
| `GET` | `/tasks` | ✅ | admin, member |
| `PUT` | `/tasks/:id/update` | ✅ | admin, member* |
| `DELETE` | `/tasks/:id/delete` | ✅ | admin, member* |
| `GET` | `/tasks-filter/status?status=` | ✅ | admin, member |
| `GET` | `/tasks-filter/priority?priority=` | ✅ | admin, member |
| `PATCH` | `/tasks-status/:id` | ✅ | admin, member* |
| `PATCH` | `/tasks-assigned-to/:id` | ✅ | admin, member* |
| `GET` | `/tasks-history/:id` | ✅ | admin, member |

\* `member` só pode alterar tarefas atribuídas a ele.

---

### 👤 Usuários

#### `POST /users` — Cadastrar usuário

```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "123456"
}
```

**201 Created**

```json
{
  "id": "6f1c2b9e-0d7a-4a43-9a51-1b2f3c4d5e6f",
  "name": "João Silva",
  "email": "joao@email.com",
  "role": "member",
  "createdAt": "2026-10-21T12:00:00.000Z",
  "updatedAt": "2026-10-21T12:00:00.000Z"
}
```

Erro `400` se o e-mail já estiver cadastrado: `{ "message": "User with same email already exists" }`.

---

### 🔑 Sessões

#### `POST /sessions` — Login

```json
{
  "email": "joao@email.com",
  "password": "123456"
}
```

**200 OK**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6f1c2b9e-0d7a-4a43-9a51-1b2f3c4d5e6f",
    "name": "João Silva",
    "email": "joao@email.com",
    "role": "member",
    "createdAt": "2026-10-21T12:00:00.000Z",
    "updatedAt": "2026-10-21T12:00:00.000Z"
  }
}
```

Erro `401` com credenciais inválidas: `{ "message": "Invalid email or password" }`.

---

### 👥 Times (admin)

#### `POST /teams` — Criar time

```json
{
  "name": "Back-end",
  "description": "Time responsável pelas APIs"
}
```

**201 Created**

```json
{
  "id": "a3d5e7f9-1b2c-4d5e-8f90-123456789abc",
  "name": "Back-end",
  "description": "Time responsável pelas APIs",
  "createdAt": "2026-10-21T12:00:00.000Z",
  "updatedAt": "2026-10-21T12:00:00.000Z"
}
```

Erro `400` se já existir um time com o mesmo nome: `{ "message": "Team with same name already exists" }`.

#### `GET /teams` — Listar times

**200 OK** — array de times, no mesmo formato acima.

#### `PUT /teams/:id` — Editar time

```json
{
  "name": "Back-end Core",
  "description": "Nova descrição"
}
```

**200 OK**

```json
{ "message": "Team updatead succesfull" }
```

#### `DELETE /teams/:id/remove` — Remover time

**200 OK**

```json
{ "message": "Team deleted successfull" }
```

---

### 🧑‍🤝‍🧑 Membros de times

#### `POST /members/:team_id/add` — Adicionar membro (admin)

```json
{
  "user_id": "6f1c2b9e-0d7a-4a43-9a51-1b2f3c4d5e6f"
}
```

**201 Created**

```json
{
  "id": "c9b8a7d6-5e4f-4a3b-9c2d-1e0f9a8b7c6d",
  "userId": "6f1c2b9e-0d7a-4a43-9a51-1b2f3c4d5e6f",
  "teamId": "a3d5e7f9-1b2c-4d5e-8f90-123456789abc",
  "createdAt": "2026-10-21T12:00:00.000Z",
  "user": { "name": "João Silva", "email": "joao@email.com" },
  "team": { "name": "Back-end", "description": "Time responsável pelas APIs" }
}
```

Erro `400` se o usuário já estiver no time: `{ "message": "This user is already on the team" }`.

#### `DELETE /members/:id/remove` — Remover membro (admin)

O `:id` é o **id do vínculo** (registro de `team_members`), retornado na criação ou na listagem.

**200 OK**

```json
{ "message": "User removed successfull" }
```

#### `GET /members/:team_id/show` — Listar membros do time

**200 OK**

```json
[
  {
    "id": "c9b8a7d6-5e4f-4a3b-9c2d-1e0f9a8b7c6d",
    "userId": "6f1c2b9e-0d7a-4a43-9a51-1b2f3c4d5e6f",
    "teamId": "a3d5e7f9-1b2c-4d5e-8f90-123456789abc",
    "createdAt": "2026-10-21T12:00:00.000Z",
    "team": { "name": "Back-end" },
    "user": { "name": "João Silva", "email": "joao@email.com" }
  }
]
```

---

### ✅ Tarefas

#### `POST /tasks` — Criar tarefa

A tarefa é atribuída automaticamente ao usuário autenticado.

```json
{
  "title": "Criar endpoint de login",
  "description": "Implementar autenticação com JWT",
  "priority": "high",
  "team_id": "a3d5e7f9-1b2c-4d5e-8f90-123456789abc"
}
```

| Campo | Tipo | Obrigatório |
| --- | --- | :---: |
| `title` | string | ✅ |
| `description` | string | ❌ |
| `priority` | `low` \| `medium` \| `high` | ✅ |
| `team_id` | uuid | ✅ |

**201 Created**

```json
{
  "id": "e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b",
  "title": "Criar endpoint de login",
  "description": "Implementar autenticação com JWT",
  "assignedTo": "6f1c2b9e-0d7a-4a43-9a51-1b2f3c4d5e6f",
  "teamId": "a3d5e7f9-1b2c-4d5e-8f90-123456789abc",
  "status": "pending",
  "priority": "high",
  "createdAt": "2026-10-21T12:00:00.000Z",
  "updatedAt": "2026-10-21T12:00:00.000Z"
}
```

#### `GET /tasks` — Listar tarefas

**200 OK** — array de tarefas. `admin` recebe todas; `member` recebe apenas as atribuídas a ele.

#### `PUT /tasks/:id/update` — Editar tarefa

Todos os campos são opcionais:

```json
{
  "title": "Novo título",
  "description": "Nova descrição",
  "priority": "medium"
}
```

**200 OK**

```json
{ "message": "Task updated successfull" }
```

#### `DELETE /tasks/:id/delete` — Remover tarefa

**200 OK**

```json
{ "message": "Task was deleted!" }
```

> Nas rotas que recebem `:id` de tarefa: `404` `{ "message": "Task not found" }` se a tarefa não existir e `403` `{ "message": "You can only manage your own tasks" }` se um `member` tentar alterar uma tarefa de outro usuário.

---

### 🔎 Filtros de tarefas

#### `GET /tasks-filter/status?status=in_progress`

Valores aceitos: `pending`, `in_progress`, `completed`.

#### `GET /tasks-filter/priority?priority=high`

Valores aceitos: `low`, `medium`, `high`.

**200 OK** (ambos) — array de tarefas que atendem ao filtro (para `member`, apenas as atribuídas a ele).

---

### 🔄 Status da tarefa

#### `PATCH /tasks-status/:id` — Alterar status

```json
{
  "status": "in_progress"
}
```

**200 OK**

```json
"Tasks status updated sucessfull"
```

A alteração é registrada automaticamente no histórico da tarefa.

---

### 🙋 Responsável pela tarefa

#### `PATCH /tasks-assigned-to/:id` — Atribuir tarefa a outro usuário

```json
{
  "user_id": "6f1c2b9e-0d7a-4a43-9a51-1b2f3c4d5e6f"
}
```

**200 OK**

```json
"User successfully assigned to the task"
```

---

### 🕓 Histórico da tarefa

#### `GET /tasks-history/:id` — Histórico de status de uma tarefa

**200 OK**

```json
[
  {
    "id": "f0e1d2c3-b4a5-4968-8776-655443322110",
    "taskId": "e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b",
    "changedBy": "6f1c2b9e-0d7a-4a43-9a51-1b2f3c4d5e6f",
    "oldStatus": "pending",
    "newStatus": "in_progress",
    "changedAt": "2026-10-21T13:00:00.000Z"
  }
]
```

---

## ⚠️ Tratamento de erros

Todos os erros seguem um formato padronizado:

| Situação | Status | Corpo |
| --- | --- | --- |
| Erro de regra de negócio (`AppError`) | `400`, `401`, `403` ou `404` | `{ "message": "..." }` |
| Token ausente | `401` | `{ "message": "JWT token not found" }` |
| Token inválido ou expirado | `401` | `{ "message": "Invalid JWT token" }` |
| Papel sem permissão para a rota | `401` | `{ "message": "Unauthorized" }` |
| Falha de validação (Zod) | `400` | `{ "message": "validation error", "issues": { ... } }` |
| Erro inesperado | `500` | `{ "message": "..." }` |

---

## 📜 Scripts

| Script | Comando | Descrição |
| --- | --- | --- |
| `npm run dev` | `tsx watch --env-file .env src/server.ts` | Inicia a API em modo desenvolvimento |
| `npm run test:dev` | `jest --watchAll --runInBand` | Executa os testes em modo watch |
| `npm run build` | `tsup src --out-dir build` | Gera o build de produção |
| `npm start` | `node build/server.js` | Executa o build de produção |

---

## 💻 Autor

Desenvolvido por **Vinícius Leandro** — [@ViniciusLegacy](https://github.com/ViniciusLegacy)

Licença: ISC
