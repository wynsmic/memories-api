import { TranscriptChunk } from "../../../domain/entities/call";
import { Logger } from "../../../infrastructure/logger";
import OpenAI from "openai";

export class OpenIaApi {
  private logger = new Logger();
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async generateSummary(transcript: string) {
    try {
      const direction =
        "Provide a summary of what the interviewee is telling about his past in this conversation transcript:";

      const response = await this.openai.completions.create({
        model: "davinci-002",
        prompt: `${direction} \n ${transcript}`,
        max_tokens: 1000, // Adjust this value to change the length of the summary
        temperature: 0.4, // Adjust this value for creativity vs accuracy (between 0 and 1)
        stop: ["\n", "."], // Stop the summary at the end of a sentence or a new line
      });

      const summary = response.choices[0].text.trim();

      return summary;
    } catch (error) {
      this.logger.error({
        component: "OpenIaApi",
        message: "Error generating summary",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: error as any,
      });
      return "Error generating summary";
    }
  }

  async generateTitle(transcript: string) {
    try {
      const direction =
        "Provide a short tittle (and only the tittle) that could represents well what the interviewee is telling about his past in this conversation transcript:";

      const response = await this.openai.completions.create({
        model: "davinci-002",
        prompt: `${direction} \n ${transcript}`,
        max_tokens: 1000,
        temperature: 0.6,
        stop: ["\n", "."],
      });

      const tittle = response.choices[0].text.trim();
      return tittle;
    } catch (error) {
      this.logger.error({
        component: "OpenIaApi",
        message: "Error generating tittle",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: error as any,
      });
      return "Error generating tittle";
    }
  }

  async chunkByEstimatedDate(transcript: string): Promise<TranscriptChunk[]> {
    try {
      // Amelioration: amener l'age de la personne dans la query
      const direction = `could you chunk the text for the different dates or period it covers.
        You have to guess the date if not known. 
        The outpout format is csv date;topic;chunk (separated with ';') where:
        Topic is a very short summay of the chunk
        Date must be  dd/MM/yyyy  for events or dd/MM/yyyy - dd/MM/yyyy for perdiods.

        Do not write any word outside of the csv. `;

      const response = await this.openai.completions.create({
        model: "davinci-002",
        prompt: `${direction} \n ${transcript}`,
        max_tokens: 1000,
        temperature: 0.6,
        stop: ["\n", "."],
      });

      const chunks = response.choices[0].text
        .trim()
        .split("\n")
        .filter(Boolean);

      const res = chunks.reduce(
        (acc: TranscriptChunk[], val: string) => this.parseChunk(acc, val),
        []
      );
      return res;
    } catch (error) {
      this.logger.error({
        component: "OpenIaApi",
        message: "Error generating topics",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: error as any,
      });
      throw error;
    }
  }

  private parseChunk = (acc: TranscriptChunk[], chunk: string) => {
    const [date, topic, text] = chunk.split(";");
    if (!text || !topic) {
      return acc;
    }
    const matchPeriod = date?.match(regexPeriod);
    const matchDate = date?.match(regexDate);
    if (matchPeriod) {
      acc.push({
        period: {
          start: new Date(
            +matchPeriod[3],
            +matchPeriod[2] - 1,
            +matchPeriod[1]
          ).getTime(),
          end: new Date(
            +matchPeriod[6],
            +matchPeriod[5] - 1,
            +matchPeriod[4]
          ).getTime(),
        },
        text,
        topic,
      });
    } else if (matchDate) {
      acc.push({
        date: new Date(
          +matchDate[3],
          +matchDate[2] - 1,
          +matchDate[1]
        ).getTime(),
        topic,
        text,
      });
    }
    return acc;
  };
}
const regexPeriod = /(\d{2})\/(\d{2})\/(\d{4}) - (\d{2})\/(\d{2})\/(\d{4})/;
const regexDate = /(\d{2})\/(\d{2})\/(\d{4})/;
