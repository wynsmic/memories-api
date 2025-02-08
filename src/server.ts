import app from "./adapters/primary/http/app";
import * as dotenv from "dotenv";
import { Logger } from "./infrastructure/logger";
import { MongoDBClient } from "./infrastructure/persistance/mongodb/client";
import { createServer } from 'http';
import { SocketAdapter } from "./adapters/primary/websocket/SocketAdapter";
import path from 'path';

const logger = new Logger();

console.log("Running in:", process.env.NODE_ENV);


const absolutePath = path.resolve(__dirname, `../config/.${process.env.NODE_ENV}.env`);
console.log('Absolute path:', absolutePath);
dotenv.config({ path: absolutePath });

console.log("Running on port:", process.env.SERVER_PORT);

MongoDBClient.getInstance().connect()

const httpPort = process.env.SERVER_PORT;
const server = createServer(app);

// Initialize Socket.IO adapter
new SocketAdapter(server);

server.listen(httpPort, () => {
  logger.info({
    component: "server",
    message: `Server running on port:${httpPort} with WebSocket support`,
  });
});
