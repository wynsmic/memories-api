import { CallDAO } from "../../infrastructure/dao/call-dao";

export class FindOneCallAction {
  public async execute({callId}:{callId: string}) {
    const call = await new CallDAO().findOne({ id: callId})
    return call.snapshot()
  }
}
