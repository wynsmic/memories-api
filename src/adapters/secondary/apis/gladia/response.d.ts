declare namespace gladia {
  interface UploadResponse {
    audio_url: string;
    audio_metadata: {
      id: string;
      filename: string;
      extension: string;
      size: number;
      audio_duration: number;
      number_of_channels: number;
    };
  }

  interface TranscriptionResponse {
    id: string;
    result_url: string;
  }

  interface Word {
    word: string;
    start: number;
    end: number;
    confidence: number;
  }

  interface Utterance {
    text: string;
    language: string;
    start: number;
    end: number;
    confidence: number;
    channel: number;
    speaker: number;
    words: Word[];
  }

  interface Subtitle {
    format: string;
    subtitles: string;
  }

  interface Transcription {
    full_transcript: string;
    languages: string[];
    subtitles: Subtitle[];
    utterances: Utterance[];
  }

  interface TranslationResult {
    full_transcript: string;
    languages: string[];
    subtitles: Subtitle[];
    utterances: Utterance[];
  }

  interface TranslationError {
    status_code: number;
    exception: string;
    message: string;
  }

  interface Translation {
    success: boolean;
    is_empty: boolean;
    exec_time: number;
    error?: TranslationError;
    results?: TranslationResult[];
  }

  interface SummarizationResult {
    results: string;
  }

  interface Summarization {
    success: boolean;
    is_empty: boolean;
    exec_time: number;
    error?: TranslationError;
    results?: SummarizationResult;
  }

  interface ModerationResult {
    results: string;
  }

  interface Moderation {
    success: boolean;
    is_empty: boolean;
    exec_time: number;
    error?: TranslationError;
    results?: ModerationResult;
  }

  interface AudioToLlmResult {
    prompt: string;
    response: string;
  }

  interface AudioToLlm {
    success: boolean;
    is_empty: boolean;
    exec_time: number;
    error?: TranslationError;
    results?: AudioToLlmResult;
  }

  interface SentenceResult {
    results: string[];
  }

  interface Sentences {
    success: boolean;
    is_empty: boolean;
    exec_time: number;
    error?: TranslationError;
    results?: SentenceResult;
  }

  interface Metadata {
    audio_duration: number;
    number_of_distinct_channels: number;
    billing_time: number;
    transcription_time: number;
  }

  interface TranscriptionPayload {
    metadata: Metadata;
    transcription: Transcription;
    translation: Translation;
    summarization: Summarization;
    moderation: Moderation;
    audio_to_llm: AudioToLlm;
    sentences: Sentences;
    status: string;
  }

  interface TranscriptionError {
    code: number;
    message: string;
  }
  

  export type TranscriptionCallbackBody = {
    id: string;
  } & (
    | { event: "transcription.error"; error: TranscriptionError }
    | { event: "transcription.success"; payload: TranscriptionPayload }
  );

  interface AudioMetadata {
    id: string;
    filename: string;
    source: string;
    extension: string;
    size: number;
    audio_duration: string;
    number_of_channels: number;
  }

  interface UploadResponse {
    audio_url: string;
    audio_metadata: AudioMetadata;
  }

  interface RequestForTranscriptionReponse {
    "id": string;
    "result_url": string;
  }
}
