const http = require("http");
const taskController = require("./controllers/taskController");

const server = http.createServer((request, response) => {
    console.log(`Recebida requisição: ${request.method} ${request.url}`); // testando rotas 

    if (request.url === "/") {
        return response.end(JSON.stringify({ message: "Servidor está rodando" }));
    }

    if (request.url === "/tasks" && request.method === "POST") {
        console.log("Rota /tasks (POST) acionada!"); // testando se entrou no if
        taskController.createTask(request, response);
        return;
    }
});

server.listen(4000, () => console.log("Servidor rodando na porta 4000"));
