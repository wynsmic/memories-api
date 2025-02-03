import fs from "fs";
import { GladiaApi } from "../../adapters/secondary/apis/gladia/gladia";
import { Logger } from "../../infrastructure/logger";
import { TranscriptionResult } from "../../domain/ports/TranscriptionPort";

const reccordsPath = "documents/records";
const transcriptionsPath = "documents/transcripts";
const logger = new Logger();

interface CallTranscript {
  projectId: string;
  callId: string;
  transcript: string;
  timestamp: Date;
}

export class RecordService {
  private currentTranscripts: Map<string, CallTranscript>;

  constructor() {
    this.currentTranscripts = new Map();
    this.ensureDirectoriesExist();
  }

  private ensureDirectoriesExist() {
    if (!fs.existsSync(transcriptionsPath)) {
      fs.mkdirSync(transcriptionsPath, { recursive: true });
    }
    if (!fs.existsSync(reccordsPath)) {
      fs.mkdirSync(reccordsPath, { recursive: true });
    }
  }

  public handleTranscriptionResult(projectId: string, callId: string, result: TranscriptionResult): void {
    if (!result.isPartial) {
      const transcriptKey = `${projectId}-${callId}`;
      const currentTranscript = this.currentTranscripts.get(transcriptKey) || {
        projectId,
        callId,
        transcript: '',
        timestamp: new Date()
      };

      // Append new text with a newline if there's existing content
      currentTranscript.transcript = currentTranscript.transcript
        ? `${currentTranscript.transcript}\n${result.text}`
        : result.text;

      this.currentTranscripts.set(transcriptKey, currentTranscript);
      
      logger.info({
        component: "RecordService",
        message: "Transcription updated",
        data: { projectId, callId }
      });
    }
  }

  public async finalizeCall(projectId: string, callId: string): Promise<void> {
    const transcriptKey = `${projectId}-${callId}`;
    const transcript = this.currentTranscripts.get(transcriptKey);

    if (transcript) {
      const filename = `${projectId}-${callId}-${transcript.timestamp.toISOString()}.json`;
      const filePath = `${transcriptionsPath}/${filename}`;

      try {
        await fs.promises.writeFile(
          filePath,
          JSON.stringify(transcript, null, 2)
        );

        logger.info({
          component: "RecordService",
          message: "Call transcript saved",
          data: { projectId, callId, filePath }
        });

        // Clean up memory
        this.currentTranscripts.delete(transcriptKey);
      } catch (error) {
        logger.error({
          component: "RecordService",
          message: "Error saving transcript",
          data: { error, projectId, callId }
        });
        throw error;
      }
    }
  }

  public async getTranscript(projectId: string, callId: string): Promise<CallTranscript | null> {
    const transcriptKey = `${projectId}-${callId}`;
    return this.currentTranscripts.get(transcriptKey) || null;
  }

  public async storeRecord(filename: string, data: string | NodeJS.ArrayBufferView): Promise<void> {
    const filePath = `${reccordsPath}/${filename}`
    fs.writeFileSync(filePath, data, "binary");
    logger.info({
      component: "RecordService",
      message: "Record saved.",
      data: { filePath },
    });
  }

  public async uploadRecord(filename: string): Promise<string> {
    const response = await new GladiaApi().uploadFile(
      `documents/records/${filename}`
    );
    return response.audio_url;
  }
}
