# Notas de Aprendizado - API de Tarefas (To-Do List)

- Este README servirá como anotações do meu aprendizado durante o desenvolvimento deste projeto. Ao final, irei compilar e organizar todas as informações em um formato mais estruturado.

- As explicações abaixo têm o objetivo de agregar conhecimento para desenvolvedores e permitir que possíveis recrutadores compreendam os conceitos que aprendi ao longo do projeto. 

# Conceitos Utilizados
### Importância do .gitignore e do arquivo .env
- O .gitignore é um arquivo que instrui o Git a ignorar determinados arquivos e diretórios ao versionar o código. Ele é essencial para:

- ✅ Evitar expor informações sensíveis: Como credenciais de banco de dados e chaves de API.

- ✅ Impedir a inclusão de arquivos desnecessários: Como node_modules, que pode ser reinstalado com npm install.

```
# Ignorar variáveis de ambiente
.env

# Ignorar dependências
node_modules/

# Ignorar logs e arquivos desnecessários
logs/
*.log
```

### O que é o .env e como funciona?
- O arquivo .env é utilizado para armazenar variáveis de ambiente do projeto, como credenciais de banco de dados e configurações sensíveis. Ele deve sempre estar listado no .gitignore para evitar exposição de dados sigilosos.

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

##  Pool de Conexões no Banco de Dados e Suas Vantagens

 Pense na conexão entre o banco de dados e a aplicação como se fosse um sistema de encanamento, onde cada conexão representa um cano. Se todas as requisições entre o banco de dados e a aplicação passassem por um único cano, isso limitaria o fluxo de entrada e saída de dados.

 Em uma aplicação grande, do ponto de vista de acessos, o banco de dados até pode suportar a carga, mas, por contar com apenas uma conexão, a aplicação não conseguiria extrair todo o potencial do banco. É aí que surge a ideia de múltiplas conexões com o banco de dados, ou seja, vários canos.

No entanto, os bancos de dados possuem um limite de conexões, e deixar isso indefinido pode causar problemas. A solução para isso é o pool de conexões, um conceito que agrupa um conjunto de conexões, gerenciando-o como uma única entidade. O sistema escolhe qual conexão dentro desse pool será utilizada para transmitir cada requisição.

O que pode acontecer é definir um número máximo de conexões, e, conforme a necessidade, novas conexões são criadas dinamicamente. O processo começa com uma única conexão e, conforme a demanda aumenta, mais conexões são adicionadas até atingir o limite estabelecido.
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
- id(INT auto_increment) -> Para buscas rápidas no banco.
- uuid (VARCHAR) -> Para exposição segura de identificadores na API
- title (VARCHAR) -> Título da tarefa
- description(TEXT) -> Descrição detalhada
- status(ENUM) -> Exemplo: "pendente", "em andamento", "concluído"
- create_at(TIMESTAMP) → Data de criação.
- updated_at (TIMESTAMP) → Atualiza automaticamente quando editado
se futuramente adicionar usuários, pensei em criar uma tabela 'users' e relacionar com 'tasks' via 'user_id'

### async function?
Uma async function (função assíncrona) é uma função em JavaScript que permite lidar com operações assíncronas, como requisições a um banco de dados ou chamadas a APIs externas, sem bloquear o fluxo do código.

Ela funciona junto com a palavra-chave await, que pausa a execução da função até que a operação assíncrona termine, sem travar o restante da aplicação.
- Exemplo básico de função assincrona
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

### Promise?
Uma Promise é um objeto em JavaScript que representa uma operação assíncrona que pode:

Ser resolvida (fulfilled) → A operação foi concluída com sucesso.
Ser rejeitada (rejected) → Algo deu errado.
Estar pendente (pending) → Ainda não terminou.
Ela é usada para lidar com tarefas assíncronas, como:
✅ Fazer requisições HTTP
✅ Ler arquivos
✅ Consultar banco de dados
✅ Esperar por eventos
```
const minhaPromise = new Promise((resolve, reject) => {
    let sucesso = true;

    setTimeout(() => {
        if (sucesso) {
            resolve("✅ Deu certo!");
        } else {
            reject("❌ Algo deu errado.");
        }
    }, 2000);
});

console.log(minhaPromise);

```
🔹 Explicação:

Criamos uma Promise que espera 2 segundos (setTimeout).
Se sucesso = true, chamamos resolve().
Se sucesso = false, chamamos reject().
No início, minhaPromise está no estado pending. Depois de 2 segundos, ela vira fulfilled ou rejected.

Como usar async/await com Promises?
Em vez de .then() e .catch(), podemos usar async/await para facilitar a leitura:

 ```
async function executarPromise() {
    try {
        const resultado = await minhaPromise;
        console.log(resultado);
    } catch (erro) {
        console.log(erro);
    } finally {
        console.log("🕒 Processo finalizado.");
    }
}

executarPromise();

```

🔹 Explicação:

then(resultado) → Executa se a Promise for resolvida.
catch(erro) → Captura erros, se a Promise for rejeitada.
finally() → Executa sempre, independente do resultado.


 ```

request.on("data", (chunk) => {
    body += chunk.toString();
});

```

O que faz?

Como os dados da requisição podem vir em partes (chunk), usamos um evento on("data") para capturar esses pedaços.
Cada pedaço (chunk) é adicionado à variável body.
chunk.toString() transforma os bytes recebidos em texto legível.

#### 🎯 Benefícios do Pool de Conexões
- ✅ Reutiliza conexões abertas, evitando a sobrecarga de criar novas conexões a todo momento.

- ✅ Melhora a escalabilidade, pois permite que várias requisições utilizem conexões já existentes.

- ✅ Controla o número de conexões ativas, evitando que o banco fique sobrecarregado.

# Observação 
### Durante o projeto mudei e comecei a utilizar o wsl com Debian, consegui baixar e configurar para utilizar ele e construir meus projetos, so que inicialmente tinha iniciado o projeto no windows e tive que continuar aqui, entrei no repositorio, dei o git clone e comecei a codar, so não lembrava do rebase, quando fui fazer o push, tinha linhas de codigo que estava diferente do local para o remoto e precisei fazer o rebase e no codigo aparecia assim 
```
<<<<<<< HEAD
    "dev": "nodemon server.js"
=======
    "dev": "nodemon src/server.js"
>>>>>>> f6bde34 (feat: adiciona criar tasks e rota)
```

### fiquei sem saber oque fazer, não sabia se apagava apenas a linha de codigo que eu nao queria e deixava o resto, se era para apagar tudo e deixar apenas a linha que eu queria e por tentativa e erro fiz isso mas continua com erro nas pastas e presumi que esta forma estava errada, com pressa e querendo resolver logo perguntei ao ChatGPT e ele disse que era apenas para deixar a linha que eu queria, fiz isso mesmo com a pasta ficando vermelha indicando que tivesse erro mas segui e no final deu certo, foi a primeira vez que fiz um rebase e algo que parecia tao amedrontador que podia quebrar tudo agora parece tao besta, ou talvez o problema que tive foi besta e a resolução besta e possa ter coisas mais complicadas, enfim resolvendo um problema de cada vez e aprendendo com eles. 

Quando um cliente (por exemplo, um front-end ou um Postman) envia dados no corpo da requisição (body), esses dados não chegam de uma vez só. O Node.js processa essas informações como um fluxo de dados (stream). Isso significa que:

Os dados chegam em pedaços (chunks).
Precisamos escutar esses pedaços e juntar tudo até que o envio seja concluído.
Por isso usamos request.on("data") e request.on("end")

request.on("data", (chunk) => {...}) → Captura os pedaços e adiciona ao body.
request.on("end", () => {...}) → Aguarda até que todos os pedaços cheguem e só então processa os dados.


E se não fizermos isso?
Se tentarmos acessar request.body diretamente sem capturar os dados do fluxo, o Node.js não saberá quais dados estão chegando e a requisição falhará. Como estamos usando Node.js puro (sem Express), não há um middleware que trate isso automaticamente, então precisamos lidar manualmente.


