import { Router } from "express";
import { FindCallsAction } from "../../../../use-cases/call/find-calls";
import { ProvideCallInstructionAction } from "../../../../use-cases/call/provide-call-instructions-action";
import { HandleCallEndingAction } from "../../../../use-cases/call/handle-call-ending-action";
import { HandleTranscriptComplete } from "../../../../use-cases/call/handle-transcript-complete-action";
import { HandleStatusCallbackAction } from "../../../../use-cases/call/handle-status-callback-action";
import { MakeCallAction } from "../../../../use-cases/call/make-call-action copy";
import { FindOneCallAction } from "../../../../use-cases/call/find-one-call";
import { NotFound } from "http-errors";

const router = Router();

router.post("/make-call", async (req, res) => {
  const action = new MakeCallAction();
  const call = await action.execute(req.body);
  return res.send({ status: "OK", data: call });
});

router.post("/call-initiation", async (req, res) => {
  const payload = req.body;
  const action = new ProvideCallInstructionAction();
  const instructions = await action.execute(payload);
  res.type("text/xml");
  return res.send(instructions);
});

router.post("/status-callback", (req, res) => {
  const payload = req.body;
  const action = new HandleStatusCallbackAction();
  action.execute(payload);
  return res.send({ status: "OK" });
});

router.post("/recording-complete", async (req, res) => {
  const payload = req.body;
  const action = new HandleCallEndingAction();
  await action.execute(payload);
  res.sendStatus(200);
});

router.post("/gladia/transcript-callback", async (req, res) => {
  const transcript = req.body;
  let reccordId;
  if (typeof req.query.reccordId === "string") {
    reccordId = req.query.reccordId;
  } else throw new Error("recordId not found in url query");
  const action = new HandleTranscriptComplete();
  await action.execute(transcript, reccordId);
  res.sendStatus(200);
});

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
