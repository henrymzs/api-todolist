const http = require('http');
const taskRoutes = require('./routes/taskRoutes');
require('dotenv').config();

const PORT = process.env.PORT || 4000;

const server = http.createServer(taskRoutes);

server.listen(PORT, () => console.log(`✅ Server is running on PORT ${PORT}`));