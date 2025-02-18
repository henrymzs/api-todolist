const pool = require('../database/config');


async function getTaskByUuid(request, response) {
    try {
        const uuid = request.url.split("/")[2];

        if (!uuid) {
            response.writeHead(400, { "Content-Type": "application/json" });
            return response.end(JSON.stringify({ message: "UUID é obrigatório" }))
        }

        const [tasks] = await pool.query("SELECT * FROM tasks WHERE uuid = ?", [uuid]);

        if (tasks.length === 0) {
            response.writeHead(404, { "Content-Type": "application/json" });
            return response.end(JSON.stringify({ message: "Tarefa não encontrada" }));
        }

        response.writeHead(200, { "Content-Type": "application/json" });
        const { id, ...taskWithoutId } = tasks[0];
        response.end(JSON.stringify(taskWithoutId));
    } catch (error) {
        response.writeHead(500, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ message: "Erro ao buscar tarefa", error }));
    }
}

async function getAllTasks(request, response) {
    try {
        const [tasks] = await pool.query("SELECT uuid, title, description, status, created_at, updated_at FROM tasks");
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify(tasks));
    } catch (error) {
        response.writeHead(500, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ message: "Erro ao buscar tarefas", error }));
    }
}

async function createTask(request, response) {
    try {
        let body = "";

        request.on("data", (chunk) => {
            body += chunk.toString();
        });

        request.on("end", async () => {
            const { title, description, status } = JSON.parse(body);

            if (!title || !description || !status) {
                response.writeHead(400, { "Content-Type": "application/json" });
                return response.end(JSON.stringify({ message: "Todos os campos são obrigatórios" }))
            }

            const [result] = await pool.query(
                "INSERT INTO tasks (uuid, title, description, status) VALUES (UUID(),?, ?, ?)",
                [title, description, status]
            );
            
            response.writeHead(201, { "Content-Type": "application/json" });
            response.end(JSON.stringify({ id: result.insertId, title, description, status }));
        });
    } catch (error) { 
        response.writeHead(500, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ message: "Erro ao criar tarefa", error }));
    }
}

module.exports = { getAllTasks, createTask, getTaskByUuid };