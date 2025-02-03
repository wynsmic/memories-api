import app from "./adapters/primary/http/app";
import * as dotenv from "dotenv";
import { Logger } from "./infrastructure/logger";
import { MongoDBClient } from "./infrastructure/persistance/mongodb/client";
import { createServer } from 'http';
import { SocketAdapter } from './adapters/socket/SocketAdapter';

const logger = new Logger();

const configPath = `./config/.env.${process.env.NODE_ENV}`;
dotenv.config({ path: configPath });

MongoDBClient.getInstance().connect()

const httpPort = process.env.APP_PORT;
const server = createServer(app);

// Initialize Socket.IO adapter
new SocketAdapter(server);

server.listen(httpPort, () => {
  logger.info({
    component: "server",
    message: `Server running on port:${httpPort} with WebSocket support`,
  });
});
