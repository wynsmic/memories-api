import { Project } from "../../domain/entities/project";
import { I_User, User } from "../../domain/entities/user";
import { ProjectDAO } from "../../infrastructure/dao/project-dao";
import { Logger } from "../../infrastructure/logger";

export class CreateProjectAction {
  private logger = new Logger();
  public async execute({ name, user }: { name: string; user: I_User }) {
    const who = new User(user);
    const project = new Project({ name, who });
    this.logger.info({
      component: "CreateProjectAction",
      message: "Project has been created",
      data: { name, user },
    });
    await new ProjectDAO().insertOne(project);
    return project.snapshot();
  }
}
