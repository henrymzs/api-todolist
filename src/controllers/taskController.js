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
                
                if (!Object.keys(fieldsToUpdate).length) {
                    response.writeHead(400, { "Content-Type": "application/json" });
                    return response.end(JSON.stringify({ message: "Nenhum campo válido para atualização" }));
                }
                
                const [task] = await pool.query("SELECT * FROM tasks WHERE uuid = ?", [uuid]);
                if (!task.length) {
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
                response.end(JSON.stringify({ message: "Erro ao atualizar tarefa"}));
            }
        });
    } catch (error) {
        response.writeHead(500, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ message: "Erro interno do servidor"}));
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

        if (!result.affectedRows) {
            response.writeHead(404, { "Content-Type": "application/json" });
            return response.end(JSON.stringify({ message: "Tarefa não encontrada" }));
        }

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

        if (!tasks.length) {
            response.writeHead(404, { "Content-Type": "application/json" });
            return response.end(JSON.stringify({ message: "Tarefa não encontrada" }));
        }

        response.writeHead(200, { "Content-Type": "application/json" });
        const { id, ...taskWithoutId } = tasks[0];
        response.end(JSON.stringify(taskWithoutId));
    } catch (error) {
        response.writeHead(500, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ message: "Erro ao buscar tarefa"}));
    }
}

async function getAllTasks(request, response) {
    try {
        const [tasks] = await pool.query("SELECT uuid, title, description, status, created_at, updated_at FROM tasks");
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify(tasks));
    } catch (error) {
        response.writeHead(500, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ message: "Erro ao buscar tarefas"}));
    }
}

async function createTask(request, response) {
    try {
        let body = await new Promise((resolve) => {
            let data = "";
            request.on("data", (chunk) => (data += chunk.toString()));
            request.on("end", () => resolve(data));
        });

        const { title, description, status } = JSON.parse(body);

        if (
            typeof title !== "string" || !title.trim() ||
            typeof description !== "string" || !description.trim() ||
            typeof status !== "string" || !status.trim()
        ) {
            response.writeHead(400, { "Content-Type": "application/json" });
            return response.end(JSON.stringify({ message: "Todos os campos são obrigatórios e devem ser strings válidas" }));
        }

        await pool.query(
            "INSERT INTO tasks (uuid, title, description, status) VALUES (UUID(), ?, ?, ?)",
            [title, description, status]
        );

        response.writeHead(201, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ message: "Tarefa criada com sucesso", title, description, status }));
    } catch (error) {
        response.writeHead(500, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ message: "Erro ao criar tarefa" }));
    }
}

async function toggleTaskCompletion(request, response) {
    try {
        const uuid = request.url.split("/")[2];

        const [task] = await pool.query("SELECT status FROM tasks WHERE uuid = ?", [uuid]);

        if (!task.length) {
            response.writeHead(404, { "Content-Type": "application/json" });
            return response.end(JSON.stringify({ message: "Tarefa não encontrada" }));
        }

        const newStatus = task[0].status === "pendente" ? "concluído" : "pendente";

        await pool.query("UPDATE tasks SET status = ?, updated_at = NOW() WHERE uuid = ?", [newStatus, uuid]);

        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ uuid, newStatus }));
    } catch (error) {
        response.writeHead(500, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ message: "Erro ao atualizar status da tarefa"}));
    }
}

module.exports = { getAllTasks, createTask, getTaskByUuid, deleteTask, updateTask, toggleTaskCompletion };