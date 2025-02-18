const taskController = require('../controllers/taskController');

function taskRoutes(request, response) {

    if (request.url === "/tasks" && request.method === "GET") {
        console.log("Rota /tasks (GET) acionada!");
        return taskController.getAllTasks(request, response);
    }
   
    if (request.url === "/tasks" && request.method === "POST") {
        console.log("Rota /tasks (POST) acionada!");
        return taskController.createTask(request, response);
    }

    response.writeHead(404, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ message: "Rota não encontrada." }));
        
}

module.exports = taskRoutes; 
