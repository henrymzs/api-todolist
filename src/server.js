const http = require('http');
const taskRoutes = require('./routes/taskRoutes');

const server = http.createServer((request, response) => {
    console.log(`Recebida requisição: ${request.method} ${request.url}`); // testando rotas 
    // deixa arquivo mais limpo e delega a requisição e condição para o taskRoutes
    taskRoutes(request, response);
});

server.listen(4000, () => console.log("Servidor rodando na porta 4000"));
