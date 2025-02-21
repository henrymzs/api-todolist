# Notas de Aprendizado - API de Tarefas (To-Do List)

- As explicações abaixo têm o objetivo de agregar conhecimento para desenvolvedores e permitir que possíveis recrutadores compreendam os conceitos que aprendi ao longo do projeto.

# Conceitos Utilizados

### Importância do .gitignore e do arquivo .env

- O .gitignore é um arquivo que instrui o Git a ignorar determinados arquivos e diretórios ao versionar o código. Ele é essencial para:

- ✅ Evitar expor informações sensíveis: como credenciais de banco de dados e chaves de API.

- ✅ Impedir a inclusão de arquivos desnecessários: como node\_modules, que pode ser reinstalado com npm install.

```
# Ignorar variáveis de ambiente
.env

# Ignorar dependências
node_modules/
```

### O que é o .env e como funciona?

- O arquivo .env é utilizado para armazenar variáveis de ambiente do projeto, como credenciais de banco de dados e configurações sensíveis. Ele deve sempre estar listado no .gitignore para evitar a exposição de dados sigilosos.

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=senha_secreta
DB_DATABASE=meubanco
DB_PORT=3306
```

- No código, essas variáveis podem ser acessadas com process.env, como no exemplo abaixo:

```
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
};
```

## Pool de Conexões no Banco de Dados e suas Vantagens

Pense na conexão entre o banco de dados e a aplicação como se fosse um sistema de encanamento, onde cada conexão representa um cano. Se todas as requisições entre o banco de dados e a aplicação passassem por um único cano, isso limitaria o fluxo de entrada e saída de dados.

Em uma aplicação grande, do ponto de vista de acessos, o banco de dados até pode suportar a carga, mas, por contar com apenas uma conexão, a aplicação não conseguiria extrair todo o potencial do banco. É aí que surge a ideia de múltiplas conexões com o banco de dados, ou seja, vários canos.

No entanto, os bancos de dados possuem um limite de conexões, e deixar isso indefinido pode causar problemas. A solução para isso é o pool de conexões, um conceito que agrupa um conjunto de conexões, gerenciando-o como uma única entidade. O sistema escolhe qual conexão dentro desse pool será utilizada para transmitir cada requisição.

O que pode acontecer é definir um número máximo de conexões e, conforme a necessidade, novas conexões serem criadas dinamicamente. O processo começa com uma única conexão e, conforme a demanda aumenta, mais conexões são adicionadas até atingir o limite estabelecido.

- Exemplo de criação de um pool no MySQL com mysql2:

```
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10, // Número máximo de conexões simultâneas
  queueLimit: 0,
});
module.exports = pool;
```

### Modelagem no banco de dados

Tabela de Tarefas (tasks):

- id (INT auto\_increment) → Para buscas rápidas no banco.
- uuid (VARCHAR) → Para exposição segura de identificadores na API.
- title (VARCHAR) → Título da tarefa.
- description (TEXT) → Descrição detalhada.
- status (ENUM) → Exemplo: "pendente", "concluído".
- created\_at (TIMESTAMP) → Data de criação.
- updated\_at (TIMESTAMP) → Atualiza automaticamente quando editado.
  Se futuramente adicionar usuários, pensei em criar uma tabela 'users' e relacionar com 'tasks' via 'user\_id'.

### async function?

Uma async function (função assíncrona) é uma função em JavaScript que permite lidar com operações assíncronas, como requisições a um banco de dados ou chamadas a APIs externas, sem bloquear o fluxo do código.

Ela funciona junto com a palavra-chave await, que pausa a execução da função até que a operação assíncrona termine, sem travar o restante da aplicação.

- Exemplo básico de função assíncrona:

```
async function exemplo() {
    return "Olá, mundo!";
}

exemplo().then(console.log); // Saída: "Olá, mundo!"
```

- Como funciona async/await?
  Em vez de usar .then(), podemos usar await para esperar que uma operação assíncrona termine antes de continuar:

```
async function buscarDados() {
    console.log("Buscando dados...");
    
    const resposta = await fetch("https://jsonplaceholder.typicode.com/todos/1");
    const dados = await resposta.json();
    
    console.log("Dados recebidos:", dados);
}

buscarDados();
console.log("Executando outras coisas...");
```

Por que usar UUID em vez de ID numérico na API?

Na API, utilizamos UUIDs (Universally Unique Identifiers) em vez de IDs numéricos para buscas, deleções e outros endpoints por algumas razões importantes:

1. Maior segurança

IDs numéricos são sequenciais, o que pode permitir ataques como enumeração de IDs, onde um usuário pode tentar acessar dados de outras tarefas apenas incrementando o ID.

UUIDs são valores aleatórios e únicos, tornando muito mais difícil prever um próximo ID e explorar vulnerabilidades.

2. Evita exposição de dados internos

Se um usuário acessa /tasks/5, ele sabe que existem ao menos cinco tarefas no sistema.

Com UUIDs, os identificadores não seguem uma ordem previsível, dificultando inferências sobre o banco de dados.

Como funciona um UUID?

Um UUID é um identificador de 128 bits representado como uma string de 36 caracteres, incluindo hífens.

Ele é composto por diferentes seções, geradas com base no tempo, MAC address, número randômico, entre outros fatores.

No momento a api usa a função nativa do MySQL UUID(); que é chamada na query do createTask 

Exemplo de UUID:

``´550e8400-e29b-41d4-a716-446655440000´``

# Observação

 Durante o projeto, mudei e comecei a utilizar o WSL com Debian. Consegui baixar e configurar para utilizá-lo e construir meus projetos, só que, inicialmente, tinha iniciado o projeto no Windows e tive que continuar aqui. Entrei no repositório, dei o git clone e comecei a codar. Só não lembrava do rebase. Quando fui fazer o push, havia linhas de código diferentes entre o local e o remoto e precisei fazer o rebase. No código, aparecia assim:

```
<<<<<<< HEAD
    "dev": "nodemon server.js"
=======
    "dev": "nodemon src/server.js"
>>>>>>> f6bde34 (feat: adiciona criar tasks e rota)
```

Fiquei sem saber o que fazer. Não sabia se apagava apenas a linha de código que eu não queria e deixava o resto, se era para apagar tudo e deixar apenas a linha que eu queria. Por tentativa e erro, fiz isso, mas continuava com erro nas pastas e presumi que essa forma estava errada. Com pressa e querendo resolver logo, perguntei ao ChatGPT, e ele disse que era apenas para deixar a linha que eu queria. Fiz isso, mesmo com a pasta ficando vermelha, indicando que havia erro, mas segui, e no final deu certo. Foi a primeira vez que fiz um rebase, e algo que parecia tão amedrontador, que podia quebrar tudo, agora parece tão simples. Ou talvez o problema que tive tenha sido simples e a resolução trivial, mas pode haver casos mais complicados. Enfim, resolvendo um problema de cada vez e aprendendo com eles.

# Como o Node.js processa dados no corpo da requisição?
Quando um cliente (por exemplo, um front-end ou o Postman) envia dados no corpo da requisição (body), esses dados não chegam de uma vez só. O Node.js processa as informações como um fluxo de dados (stream). Isso significa que:

Os dados chegam em pedaços (chunks).
Precisamos escutar esses pedaços e juntá-los até que o envio seja concluído.
Por isso, usamos request.on("data") e request.on("end"):
```
request.on("data", (chunk) => {...}); // Captura os pedaços e adiciona ao body.
request.on("end", () => {...}); // Aguarda até que todos os pedaços cheguem e só então processa os dados.
````

O que acontece se não fizermos isso?
Se tentarmos acessar request.body diretamente, sem capturar os dados do fluxo, o Node.js não saberá quais dados estão chegando, e a requisição falhará. Como estamos usando Node.js puro (sem Express), não há um middleware para tratar isso automaticamente, então precisamos lidar com isso manualmente.

# Por que o MySQL sempre retorna um objeto?
Quando executamos uma query no MySQL usando a biblioteca mysql2 no Node.js, o banco de dados responde enviando um objeto JavaScript estruturado com informações sobre a operação realizada.

Isso acontece porque o MySQL precisa fornecer um retorno que permita ao código processar os resultados da query de maneira eficiente.

🔄 Como o MySQL retorna os dados?
Quando chamamos pool.query(), a função retorna um array com dois elementos:

1️⃣ O primeiro elemento contém o resultado da query (os dados retornados pelo MySQL).

2️⃣ O segundo elemento contém informações sobre os metadados da query (como colunas e tipos de dados).

Exemplo de SELECT:
```
const [result, fields] = await pool.query("SELECT * FROM tasks WHERE uuid = ?", [uuid]);
result → Contém os dados retornados pela query.
fields → Contém os metadados (informações sobre as colunas da tabela).
```
Se tivermos essa tabela tasks:

```
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uuid VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL
);
```
E executarmos a query:
```
const [result] = await pool.query("SELECT * FROM tasks WHERE uuid = ?", ["123e4567-e89b-12d3-a456-426614174000"]);
console.log(result);
```
O MySQL pode retornar um array assim:

```
[
  {
    "id": 1,
    "uuid": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Fazer compras",
    "status": "pendente"
  }
]
```
🔹 Por que retorna um array?
Porque um SELECT pode trazer múltiplas linhas, então o resultado sempre será um array, mesmo que haja apenas um objeto.

🔥 Exemplo de DELETE:
```
const [result] = await pool.query("DELETE FROM tasks WHERE uuid = ?", ["123e4567-e89b-12d3-a456-426614174000"]);
console.log(result);
```
O retorno será um objeto como este:
```
{
  "fieldCount": 0,
  "affectedRows": 1,
  "insertId": 0,
  "serverStatus": 2,
  "warningCount": 0,
  "message": "",
  "protocol41": true,
  "changedRows": 0
}
"affectedRows": 1 → Uma linha foi deletada.
"affectedRows": 0 → Nenhuma linha foi deletada (UUID não encontrado).
"insertId": 0 → Como não há inserção, o valor é 0.
"serverStatus": 2 → Indica que o MySQL processou a query com sucesso.
```



