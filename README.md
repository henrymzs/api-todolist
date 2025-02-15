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
#### 🎯 Benefícios do Pool de Conexões
- ✅ Reutiliza conexões abertas, evitando a sobrecarga de criar novas conexões a todo momento.

- ✅ Melhora a escalabilidade, pois permite que várias requisições utilizem conexões já existentes.

- ✅ Controla o número de conexões ativas, evitando que o banco fique sobrecarregado.