import {
  TwilioApi,
  TwilioStatusCallbackPayload,
} from "../../adapters/secondary/apis/twilios";
import { CallDAO } from "../../infrastructure/dao/call-dao";
import { Logger } from "../../infrastructure/logger";

export class HandleStatusCallbackAction {
  private logger = new Logger();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async execute(payload: TwilioStatusCallbackPayload) {
    const callDao = new CallDAO();
    const call = await callDao.findOne({ dialId: payload.CallSid });
    const status = TwilioApi.statusMapping(payload.CallStatus);
    if (!status) {
      this.logger.warn({
        component: "HandleStatusCallbackAction",
        message: "Twilio status not handled",
        data: payload,
      });
    }
    call.setStatus(status);
    callDao.updateOneCall(call);
  }
}
