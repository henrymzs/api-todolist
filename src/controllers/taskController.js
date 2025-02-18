const pool = require('../database/config');


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

module.exports = { createTask };