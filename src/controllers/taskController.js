const pool = require('../database/config');

async function updateTask(request, response) {
    try {
        const uuid = request.url.split("/")[2];
        if (!uuid) {
            response.writeHead(400, { "Content-Type": "application/json" });
            return response.end(JSON.stringify({ message: "UUID é obrigatório" }));
        }

        let body = "";
        request.on("data", (chunk) => {
            body += chunk.toString();
        });

        request.on("end", async () => {
            try {
                if (!body) {
                    response.writeHead(400, { "Content-Type": "application/json" });
                    return response.end(JSON.stringify({ message: "Nenhum campo enviado para atualização" }));
                }
                
                const parsedBody = JSON.parse(body);
                const allowedFields = ["title", "description", "status"];
                const fieldsToUpdate = {};

                for (const key in parsedBody) {
                    if (allowedFields.includes(key) && parsedBody[key]) {
                        fieldsToUpdate[key] = parsedBody[key];
                    }
                }
                
                if (Object.keys(fieldsToUpdate).length === 0) {
                    response.writeHead(400, { "Content-Type": "application/json" });
                    return response.end(JSON.stringify({ message: "Nenhum campo válido para atualização" }));
                }
                
                const [task] = await pool.query("SELECT * FROM tasks WHERE uuid = ?", [uuid]);
                if (task.length === 0) {
                    response.writeHead(404, { "Content-Type": "application/json" });
                    return response.end(JSON.stringify({ message: "Tarefa não encontrada" }));
                }
                
                const updateFieldsQuery = Object.keys(fieldsToUpdate).map(field => `${field} = ?`).join(", ");
                const queryValues = [...Object.values(fieldsToUpdate), uuid];
                
                await pool.query(
                    `UPDATE tasks SET ${updateFieldsQuery}, updated_at = NOW() WHERE uuid = ?`,
                    queryValues
                );
                
                response.writeHead(200, { "Content-Type": "application/json" });
                response.end(JSON.stringify({ message: "Tarefa atualizada com sucesso" }));
            } catch (error) {
                response.writeHead(500, { "Content-Type": "application/json" });
                response.end(JSON.stringify({ message: "Erro ao atualizar tarefa", error }));
            }
        });
    } catch (error) {
        response.writeHead(500, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ message: "Erro interno do servidor", error }));
    }
}

async function deleteTask(request, response) {

    const uuid = request.url.split("/")[2];

    if (!uuid) {
        response.writeHead(400, { "Content-Type": "application/json" });
        return response.end(JSON.stringify({ message: "UUID é obrigatório" }));
    }

    try {
        const [result] = await pool.query("DELETE FROM tasks WHERE uuid = ?", [uuid]);

        if (result.affectedRows === 0) {
            response.writeHead(404, { "Content-Type": "application/json" });
            return response.end(JSON.stringify({ message: "Tarefa não encontrada" }));
        }

        await pool.query("DELETE FROM tasks WHERE uuid = ?", [uuid]);

        response.writeHead(200, { "Content-Type": "application/json" });
        return response.end(JSON.stringify({ message: "Tarefa deletada com sucesso" }));
    } catch (error) {
        response.writeHead(500, { "Content-Type": "application/json" });
        return response.end(JSON.stringify({ message: "Erro interno do servidor" }));
    }
}


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

            const [task] = await pool.query("SELECT uuid FROM tasks WHERE id = ?", [result.insertId]);
            
            response.writeHead(201, { "Content-Type": "application/json" });
            response.end(JSON.stringify({ uuid: task[0].uuid, title, description, status }));
        });
    } catch (error) { 
        response.writeHead(500, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ message: "Erro ao criar tarefa", error }));
    }
}

module.exports = { getAllTasks, createTask, getTaskByUuid, deleteTask, updateTask };