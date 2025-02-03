import { TwilioApi } from "../../adapters/secondary/apis/twilios";
import { Call } from "../../domain/entities/call";
import { User } from "../../domain/entities/user";
import { CallDAO } from "../../infrastructure/dao/call-dao";
import { ProjectDAO } from "../../infrastructure/dao/project-dao";
import { Logger } from "../../infrastructure/logger";

const me = new User({
  firstname: "mic",
  lastname: "w",
  mobile: "+33683555022",
  id: "1",
});


/*const gmth = new User({
  firstname: "gmth",
  lastname: "m",
  mobile: "+33555840880",//674735874",
  id: "2",
});$/


/*const lily = new User({
  firstname: "lily",
  lastname: "p",
  mobile: "+33682260060xx",
  id: "2",
});*/

/*const mth = new User({
  firstname: "mth",
  lastname: "a",
  mobile: "+33649439990",
  id: "2",
});*/

export class MakeCallAction {
  private logger = new Logger();
  public async execute({projectId}:{projectId: string}) {
    const project = await new ProjectDAO().findOne({id: projectId})

    const call = new Call({to: project.getWho(), from: me, projectId});
    this.logger.info({
      component: "MakeCallAction",
      message: "Call request has been received!",
    });
    const callResponse = await TwilioApi.makeCall(call);
    call.setDialId(callResponse.sid)

    await new CallDAO().insertOne(call)
    return call.snapshot()
  }
}
