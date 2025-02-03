import { I_User, User } from "../../domain/entities/user";
import { ProjectDAO } from "../../infrastructure/dao/project-dao";
import { Logger } from "../../infrastructure/logger";

export class UpdateProjectAction {
  private logger = new Logger();
  public async execute({
    id,
    name,
    who,
  }: {
    id: string;
    name: string;
    who: I_User;
  }) {
    const project = await new ProjectDAO().findOne({ id });
    const user = new User(who);
    project.setWho(user);
    project.setName(name)
    
    await new ProjectDAO().insertOne(project);
    this.logger.info({
      component: "CreateProjectAction",
      message: "Project has been updated",
      data: { name, who },
    });
    return project.snapshot();
  }
}
