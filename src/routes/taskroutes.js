const { getAllTasks, createTask } = require('../controllers/taskController');

function handleRequest(request, response) {
    if (request.url === "/tasks" && request.method === "GET"){
        return getAllTasks(request, response);
    }

    if (request.url === "/tasks" && request.method === "POST") {
        return createTask(request, response);
    }

    response.writeHead(404, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ message: "Rota não encontrada." }));
        
}

module.export = handleRequest;