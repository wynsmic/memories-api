import { TranscribeStreamingClient, StartStreamTranscriptionCommand, AudioStream } from "@aws-sdk/client-transcribe-streaming";
import { TranscriptionPort, TranscriptionResult } from "../../../domain/ports/TranscriptionPort";
import { Logger } from "../../../infrastructure/logger";

export class AWSTranscribeAdapter implements TranscriptionPort {
  private client: TranscribeStreamingClient;
  private logger: Logger;

  constructor() {
    this.logger = new Logger();
    this.client = new TranscribeStreamingClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
      }
    });
  }

  async *startTranscription(audioStream: AsyncIterable<Buffer>): AsyncGenerator<TranscriptionResult> {
    const command = new StartStreamTranscriptionCommand({
      LanguageCode: "en-US",
      MediaEncoding: "pcm",
      MediaSampleRateHertz: 16000,
      AudioStream: this.createAudioStream(audioStream)
    });

    try {
      const response = await this.client.send(command);
      
      for await (const event of response.TranscriptResultStream!) {
        if (event.TranscriptEvent?.Transcript?.Results?.[0]) {
          const result = event.TranscriptEvent.Transcript.Results[0];
          yield {
            text: result.Alternatives?.[0].Transcript || '',
            isPartial: result.IsPartial || false
          };
        }
      }
    } catch (error) {
      this.logger.error({
        component: "AWSTranscribeAdapter",
        message: "Error in transcription",
        data: {error}
      });
      throw error;
    }
  }

  private createAudioStream(inputStream: AsyncIterable<Buffer>): AsyncIterable<AudioStream> {
    return (async function* () {
      for await (const chunk of inputStream) {
        yield {
          AudioEvent: {
            AudioChunk: chunk
          }
        };
      }
    })();
  }

  async stopTranscription(): Promise<void> {
    // AWS Transcribe streaming doesn't require explicit cleanup
    return Promise.resolve();
  }
}
