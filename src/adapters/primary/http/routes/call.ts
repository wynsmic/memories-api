import { Router } from "express";
import { FindCallsAction } from "../../../../use-cases/call/find-calls";
import { FindOneCallAction } from "../../../../use-cases/call/find-one-call";
import { NotFound } from "http-errors";

const router = Router();


router.get("/", async (req, res) => {
  const payload = req.query as { projectId: string };
  const action = new FindCallsAction();
  const calls = await action.execute(payload);
  res.status(200).send({ status: "OK", data: calls });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params as { id: string };
  if (!id) {
    throw new NotFound("call id undefined");
  }
  const action = new FindOneCallAction();
  const calls = await action.execute({ callId: id });
  res.status(200).send({ status: "OK", data: calls });
});

export default router;
