import { CallDAO } from "../../infrastructure/dao/call-dao";

export class FindCallsAction {
  public async execute({projectId}:{projectId: string}) {
    const projects = await new CallDAO().findMany({ projectId}, {rawTranscription:false})
    return projects.map(c=>c.snapshot())
  }
}
