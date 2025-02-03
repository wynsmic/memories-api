import { GladiaApi } from "../../adapters/secondary/apis/gladia/gladia";
import {
  TwilioRecordingPayload,
  TwilioApi,
} from "../../adapters/secondary/apis/twilios";
import { storeRecord, uploadRecord } from "../../application/service/record";
import { CallStatus } from "../../domain/enums/call-status";
import { CallDAO } from "../../infrastructure/dao/call-dao";
import { Logger } from "../../infrastructure/logger";

export class HandleCallEndingAction {
  private logger = new Logger();
  public async execute(payload: TwilioRecordingPayload) {
    try {
      const { RecordingUrl, CallSid } = payload;
      const callDAO = new CallDAO();
      const call = await callDAO.findOne({ dialId: CallSid});
      call.setStatus(CallStatus.COMPLETED);

      const record = await TwilioApi.downloadRecording(RecordingUrl);
      storeRecord(payload.CallSid, record);

      const uploadedPath = await uploadRecord(CallSid);
      call.setRecordPath(uploadedPath);
      await callDAO.updateOneCall(call);
      await new GladiaApi().requestForTranscription(
        uploadedPath,
        `${process.env.SERVER_URL}/gladia/transcript-callback?callId=${CallSid}`
      );
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error({
          component: "HandleCallEndingAction",
          message: " error.message",
          data: error,
        });
      } else {
        this.logger.error({
          component: "HandleCallEndingAction",
          message: " Unknown error",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data: error as any,
        });
      }
    }
  }
}
