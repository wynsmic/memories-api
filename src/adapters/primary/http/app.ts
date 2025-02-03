import bodyparser from "body-parser";
import express from "express";
import { registerRoutes } from "./routes/index";
import { errorMiddleware } from "./middleware/error.middleware";
import { inputLoggerMiddleware } from "./middleware/input-logger-middleware";
import cors from "cors";
import { routeNotFoundMiddleware } from "./middleware/route-not-found-middleware";

const app = express();
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(inputLoggerMiddleware);

registerRoutes(app);
app.use(routeNotFoundMiddleware);
app.use(errorMiddleware);

export default app;
