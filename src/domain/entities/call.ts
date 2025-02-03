import { I_User, User } from "./user";
import { CallStatus } from "../enums/call-status";
import { v4 } from "uuid";

export interface I_Call {
  createdAt?: number;
  updatedAt?: number;
  deletedAt?: number;
  dialId?: string; // the mobile conversation id
  duration?: number;
  from: User;
  id?: string;
  projectId: string;
  recordPath?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  processedTranscription?: TranscriptChunk[];
  rawTranscription?: string;
  status?: CallStatus;
  summary?: string;
  title?: string;
  to: User;
}

export type TranscriptChunk = {
  text: string;
  topic: string;
} & (
  | {
      date: number;
    }
  | {
      period: {
        start: number;
        end: number;
      };
    }
);

export type I_CallSnapshot = Omit<I_Call, "to" | "from"> & {
  to: I_User;
  from: I_User;
};

export class Call {
  readonly id: string;
  private from: User;
  private status: CallStatus;
  private to: User;

  private createdAt?: number;
  private updatedAt?: number;
  private deletedAt?: number;
  private dialId?: string;
  private duration?: number;
  private projectId: string;
  private recordPath?: string;
  private processedTranscription?: TranscriptChunk[];
  private rawTranscription?: string;
  private summary?: string;
  private title?: string;

  constructor(data: I_Call) {
    this.createdAt = data.createdAt ?? Math.floor(Date.now());

    this.dialId = data.dialId;
    this.duration = data.duration;
    this.from = data.from;
    this.id = data.id ?? v4();
    this.projectId = data.projectId;
    this.recordPath = data.recordPath;
    this.processedTranscription = data.processedTranscription;
    this.rawTranscription = data.rawTranscription;
    this.status = data.status ?? CallStatus.CREATED;
    this.summary = data.summary;
    this.title = data.title;
    this.to = data.to;
  }

  setDialId(value: string) {
    this.dialId = value;
  }
  getFrom() {
    return this.from;
  }

  getTo() {
    return this.to;
  }


  getProcessedTranscript() {
    return this.processedTranscription;
  }

  setProcessedTranscript(value?: TranscriptChunk[]) {
     this.processedTranscription = value;
  }

  getRawTranscript() {
    return this.rawTranscription;
  }

  setRawTranscript(value?: string) {
     this.rawTranscription = value;
  }

  setRecordPath(value: string) {
    this.recordPath = value;
  }

  setStatus(value: CallStatus) {
    this.status = value;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setRawTranscription(value: any) {
    this.rawTranscription = value;
  }
  setSummary(value: string) {
    this.summary = value;
  }
  setUpdatedAt(value: number) {
    this.updatedAt = value;
  }
  setDeletedAt(value: number) {
    this.updatedAt = value;
  }

  snapshot = (): I_CallSnapshot => ({
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    deletedAt: this.deletedAt,
    dialId: this.dialId,
    duration: this.duration,
    from: this.from.snapshot(),
    id: this.id,
    projectId: this.projectId,
    recordPath: this.recordPath,
    rawTranscription: this.rawTranscription,
    status: this.status,
    summary: this.summary,
    title: this.title,
    to: this.to.snapshot(),
  });
}
