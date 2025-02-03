import { Express } from "express";
import callRouter from "./call";
import projectRouter from "./project";
import { hb } from "./hb";

export const registerRoutes = (app: Express) => {
  app.use("/hb", hb);
  app.use("/calls", callRouter);
  app.use("/projects", projectRouter);
};
