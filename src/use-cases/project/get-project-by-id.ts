
import { ProjectDAO } from "../../infrastructure/dao/project-dao";
import { NotFound } from "http-errors";

export class GetProjectByIdAction {
  public async execute(id: string) {
    const project = await new ProjectDAO().findOne({ id });
    if (!project) {
      throw new NotFound("Project not found " + id);
    }
    return project.snapshot();
  }
}
