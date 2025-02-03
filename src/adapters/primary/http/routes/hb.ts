import { RequestHandler } from "express";


export const hb:RequestHandler = async (_req, res) => {
  return res.send({ status: "OK" });
};
