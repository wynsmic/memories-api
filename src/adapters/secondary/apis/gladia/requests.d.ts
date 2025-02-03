declare namespace gladia{

    export interface TranscriptionRequest {
        context_prompt?: string;
        custom_vocabulary?: string[];
        detect_language?: boolean;
        enable_code_switching?: boolean;
        language?: string;
        callback_url?: string;
        subtitles?: boolean;
        subtitles_config?: { formats: string[] };
        diarization?: boolean;
        diarization_config?: {
          number_of_speakers?: number;
          min_speakers?: number;
          max_speakers?: number;
        };
        translation?: boolean;
        translation_config?: {
          target_languages: string[];
          model: string;
        };
        summarization?: boolean;
        summarization_config?: { type: string };
        moderation?: boolean;
        audio_to_llm?: boolean;
        audio_to_llm_config?: { prompts: string[] };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        custom_metadata?: { [key: string]: any };
        sentences?: boolean;
        audio_url: string;
      }
}