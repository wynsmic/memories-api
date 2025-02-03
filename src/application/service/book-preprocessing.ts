import { OpenIaApi } from "../../adapters/secondary/apis/open-ia";
import { Call } from "../../domain/entities/call";

export class BookProssessing {
  private openIaApi = new OpenIaApi();

  async processTranscript(call: Call) {
    const rawText = call.getRawTranscript();
    if (!rawText) {
      return;
    }
    const result = await this.openIaApi.chunkByEstimatedDate(rawText);
    call.setProcessedTranscript(result);
  }
}
