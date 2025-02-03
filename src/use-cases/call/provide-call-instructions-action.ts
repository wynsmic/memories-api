import { TwilioApi } from "../../adapters/secondary/apis/twilios";
import { CallStatus } from "../../domain/enums/call-status";
import { CallDAO } from "../../infrastructure/dao/call-dao";
import { Logger } from "../../infrastructure/logger";

export interface TwilioRequestBody {
  CallSid: string;
  AccountSid: string;
  From: string;
  To: string;
  CallStatus: string;
  ApiVersion: string;
  Direction: string;
  ForwardedFrom?: string;
  CallerName?: string;
  ParentCallSid?: string;
  CallToken?: string;
}

export class ProvideCallInstructionAction {
  private logger = new Logger();
  public async execute(payload: TwilioRequestBody) {
    const dao = new CallDAO();
    const call = await dao.findOne({ dialId: payload.CallSid});
    const instructions = await TwilioApi.initCall({ dialWith: (await call).getFrom().getPhone() });
    this.logger.info({
      component: "ProvideCallInstructionAction",
      message: "Call has been initialized",
    });
    call.setStatus(CallStatus.INITIATED);
    dao.updateOneCall(call);
    return instructions
  }
}
