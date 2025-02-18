const taskController = require('../controllers/taskController');

function taskRoutes(request, response) {

    if (request.url === "/" && request.method === "GET") {
        response.writeHead(200, { "Content-Type": "application/json" });
        return response.end(JSON.stringify({
            message: "API is running",
            version: "1.0.0",
            status: "ok"
        }));
    }

    if (request.url === "/tasks" && request.method === "GET") {
        console.log("Rota /tasks (GET) acionada!");
        return taskController.getAllTasks(request, response);
    }

    if (request.url.startsWith("/tasks/") && request.method === "GET") {
        console.log("Rota /task/:uuid (GET) acionada");
        return taskController.getTaskByUuid(request, response);
    }
   
    if (request.url === "/tasks" && request.method === "POST") {
        console.log("Rota /tasks (POST) acionada!");
        return taskController.createTask(request, response);
    }

    response.writeHead(404, { "Content-Type": "application/json" });
    response.end(JSON.stringify({
         message: "Rota não encontrada.",
         method: request.method,
         url: request.url 
        }));
        
}

module.exports = taskRoutes; 
