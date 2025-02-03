export interface TranscriptionResult {
  text: string;
  isPartial: boolean;
}

export interface TranscriptionPort {
  startTranscription(audioStream: AsyncIterable<Buffer>): AsyncGenerator<TranscriptionResult>;
  stopTranscription(): Promise<void>;
}
