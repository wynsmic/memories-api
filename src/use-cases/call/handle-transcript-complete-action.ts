import { BookProssessing } from "../../application/service/book-preprocessing";
import { CallStatus } from "../../domain/enums/call-status";
import { CallDAO } from "../../infrastructure/dao/call-dao";

export class HandleTranscriptComplete {
  private bookProssessingService = new BookProssessing()
  public async execute(body: gladia.TranscriptionCallbackBody, callId: string) {
    if (body.event === "transcription.success") {
      try {
        const callDAO = new CallDAO();
        const call = await callDAO.findOne({dialId: callId});
        call.setStatus(CallStatus.TRANSCRIPTED);
        //await saveTranscriptionToFile(callId, body.payload);
        const transcript = body.payload.transcription.full_transcript;
        call.setRawTranscription(transcript);
        const summary = body.payload.summarization.results as unknown as string;
        call.setSummary(summary);
        await callDAO.updateOneCall(call);
        await this.bookProssessingService.processTranscript(call)
        await callDAO.updateOneCall(call);

      } catch (error) {
        console.error(error);
      }
    } else {
      console.error(body.error);
    }
  }
}
