import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import { Logger } from "../../../../infrastructure/logger";

export class GladiaApi {
  private logger = new Logger();
  uploadFile = async (filePath: string): Promise<gladia.UploadResponse> => {
    this.logger.info({
      component: "GladiaApi",
      message: "### Uploading file ### to Gladia",
    });

    const formData = new FormData();
    formData.append("audio", fs.createReadStream(filePath));

    const response = await axios.post<gladia.UploadResponse>("https://api.gladia.io/v2/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "x-gladia-key": process.env.GLADIA_API_KEY as string, // Make sure GLADIA_API_KEY is available
      },
    });
    return response.data;
  };

  async requestForTranscription(
    recordUrl: string,
    callbackUrl: string
  ): Promise<gladia.TranscriptionResponse> {
    const body = {
      callback_url: callbackUrl,
      audio_url: recordUrl,
      diarization: true,
      diarization_config: {
        number_of_speakers: 2,
        min_speakers: 2,
        max_speakers: 2,
      },
      summarization: true,
      summarization_config: {
        type: "concise", // can be 'general', 'concise' or 'bullet_points'
        // use 'general' if no summarization_config is provided
      },

      translation: false,
      /*"translation_config": {
        "model": "base",
        "target_languages": ["fr", "en"]
      },*/
      subtitles: false,
      detect_language: true,
      enable_code_switching: false,
    };
    const response = await axios.post<gladia.RequestForTranscriptionReponse>(
      `${process.env.GLADIA_API_URL}/v2/transcription`, 
      body,
      {
        headers: {
          "Content-Type": "application/json",
          "x-gladia-key": process.env.GLADIA_API_KEY,
        }
      }
    );

    this.logger.info({
      component: "GladiaApi",
      message: `Request for transcription has been sent.`,
      data: response,
    });

    return response.data;
  }
}
