# API de Tarefas (To-Do List)

Este projeto foi criado como parte do meu aprendizado em desenvolvimento back-end e faz parte do meu portfólio. Desenvolvi esta API de To-Do List utilizando Node.js puro e MySQL, sem frameworks como Express e sem o uso de ORM, escrevendo SQL diretamente no código.

Estou sempre em busca de aprimorar minhas habilidades, então qualquer feedback sobre o projeto, código, arquitetura ou boas práticas será muito bem-vindo! Se quiser contribuir com sugestões, você pode:

- 📧 Me enviar um e-mail: henrykaua21@gmail.com
- 🔗 Se conectar comigo no [LinkedIn](https://www.linkedin.com/in/henry-kaua/)
- 🐛 Abrir uma [issue](https://github.com/henrymzs/api-todolist/issues) aqui no repositório
- 👽 Notas do que aprendi durante o desenvolvimento desse projeto [Notes](./NOTES.md)

Toda ajuda é muito apreciada e me auxilia a crescer como desenvolvedor. 🚀

# Tecnologias Utilizadas 
- Node.js
- MySQL
- MySQL Workbench (para gerenciar banco de dados)
- dotenv (para gerenciamento de variáveis de ambiente)

# Estrutura do Projeto
A estrutura de diretórios do projeto segue boas práticas, organizando o código de forma clara e separando responsabilidades:
```
/api-todolist
    src
        |- controllers # Diretório para controladores
            taskController.js  # Lógica de manipulção das tarefas
        |- database # Diretório para conexão com MySQL
            config.js  # Conexão com MySQL
        |- routes  # Diretório para as rotas
            taskRoutes.js  # Rotas Relacionadas ás tarefas
        server.js  # Arquivo principal do servidor
```

# Banco de Dados
Utiliza também a função nativa do MySQL UUID();
A API utiliza uma única tabela chamada ```tasks```, que é estruturado da seguinte forma: 

```
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    UUID VARCHAR(36) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('pendente', 'em andamento', 'concluído') NOT NULL DEFAULT 'pendente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

# Endpoints da API
Criar uma Tarefa
POST /tasks
Request Body:
```
"title": "titulo da tarefa",
"description": "descrição da tarefa",
"status": "pendente"
```
Observação:
- ```pendente``` é a opção default da tarefa, o status pode ser alterado através do endpoint PATH.
- UUID é obrigatório.
- Todos os campos são obrigatorios e devem ser string válidas. Exemplo abaixo:

```
{
  "title": ,
  "description": "salvar programa",
  "status": "pendente"
}

{
	"message": "Erro ao criar tarefa"
}
```
```
{
  "title": 1,
  "description": "salvar programa",
  "status": "pendente"
}

{
	"message": "Todos os campos são obrigatórios e devem ser strings válidas"
}
```
- Em title seria aceito titulo na forma de string mesmo sendo número, dessa forma "1", mas da forma que foi apresentado é int e não é aceito. Então na criação coloque sempre string. 

# Listar todas as Tarefas
GET /tasks
- Esse endpoint tem a responsabilidade de listar todas as tarefas inseridas no banco de dados. Exemplo abaixo:
```
{
    "uuid": "3057dc58-ed59-11ef-b38f-00155d21ff55",
    "title": "Estudar Python",
    "description": "Ler Flask",
    "status": "concluído",
    "created_at": "2025-02-17T18:01:19.000Z",
    "updated_at": "2025-02-20T18:03:32.000Z"
}
```

# Buscar uma Tarefa por UUID
GET /taks/:uuid

- Esse endpoint tem a responsibilidade de mostrar tarefa apenas com o uuid que esta presente na url.
- UUID é obrigatório.

 Exemplo abaixo:

```GET``` url  ```http://HOST:PORT/tasks/3057dc58-ed59-11ef-b38f-00155d21ff55```
- Response:
```
{
	"UUID": "3057dc58-ed59-11ef-b38f-00155d21ff55",
	"title": "Estudar Python",
	"description": "Ler Flask",
	"status": "concluído",
	"created_at": "2025-02-17T18:01:19.000Z",
	"updated_at": "2025-02-20T18:03:32.000Z"
}
```

# Atualizar uma Tarefa
PUT /tasks/:uuid
- Esse endpoint atualiza uma tarefa que com o uuid que foi passado na url do metodo PUT. 
- UUID é obrigatório.

Exemplo abaixo: 
```
{
  "title": "estudar yarn",
  "description": "",
  "status": "concluido"
}

{
	"message": "Tarefa atualizada com sucesso"
}
```
Observação: É permitido alterar quando campos o usuário quiser, entre titulo, descrição e status, podendo atualizar apenas um desses ou atualizar todos. Basta alterar apenas o campo que deseja.

# Deletar uma Tarefa
DELETE /tasks/:uuid
- Esse endpoint é responsável por excluir tarefas, onde é necessario passar o uuid da tarefa que deseja excluir na url e ela seja excluído do banco de dados.
- UUID é obrigatório.

```DELETE``` url  ```http://HOST:PORT/tasks/3057dc58-ed59-11ef-b38f-00155d21ff55```
- Response:
```
{
  "message": "Tarefa removida com sucesso!"
}
```

# Mudar status de uma tarefa
PATH /tasks/:uuid/complete
- Endpoint responsável por mudar status de uma tarefa que por padrão está pendente para concluído
- UUID é obrigatório.

url: ```http://localhost:4000/tasks/92a16eee-ef31-11ef-adb0-00155db4cfae/complete```

```
{
	"uuid": "92a16eee-ef31-11ef-adb0-00155db4cfae",
	"newStatus": "pendente" // "conluída"
}
```

# Como Executar o Projeto

1. Clone o repositório:
```
git clone https://github.com/henrymzs/api-todolist.git
cd nome-do-seu-repositorio
```

2. Inicie um projeto Node.js e Instale as dependências:
```
npm init -y

npm install
```

3. Configure o arquivo .env com suas credenciais do banco de dados:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=seu_banco
```

4. Execute a API
```
node src/server.js
```

Projeto desenvolvido com foco em aprendizado e boas práticas de desenvolvimento! 🚀