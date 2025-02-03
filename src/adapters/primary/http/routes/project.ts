import { Router } from "express";
import { CreateProjectAction } from "../../../../use-cases/project/craete-project";
import { GetProjectByIdAction } from "../../../../use-cases/project/get-project-by-id";
import { GetProjectsListAction } from "../../../../use-cases/project/get-projects-list";
import { UpdateProjectAction } from "../../../../use-cases/project/update-project";

const router = Router();

router.post("/", async (req, res) => {
  const action = new CreateProjectAction();
  const project = await action.execute(req.body);
  return res.status(201).send({ status: "OK", data: project });
});

router.get("/", async (req, res) => {
  const action = new GetProjectsListAction();
  const list = await action.execute();
  return res.send({ status: "OK", data: list });
});

router.get("/:id", async (req, res) => {
  const projectId = req.params.id;
  const action = new GetProjectByIdAction();
  const project = await action.execute(projectId);
  return res.send({ status: "OK", data: project });
});


router.put("/:id", async (req, res) => {
  const projectId = req.params.id;
  const action = new UpdateProjectAction();
  const project = await action.execute({...req.body, id: projectId});
  return res.status(201).send({ status: "OK", data: project });
});

export default router;
