import { ProjectDAO } from "../../infrastructure/dao/project-dao";
export class GetProjectsListAction {
  public async execute() {
    return await new ProjectDAO().findMany({});
  }
}
