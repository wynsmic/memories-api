import { Server as SocketServer } from 'socket.io';
import { Server } from 'http';
import { PassThrough } from 'stream';
import { TranscriptionPort } from '../../../domain/ports/TranscriptionPort';
import { AWSTranscribeAdapter } from '../../secondary/aws/AWSTranscribeAdapter';
import { Logger } from '../../../infrastructure/logger';
import { RecordService } from '../../../application/service/record';

export class SocketAdapter {
  private io: SocketServer;
  private transcriptionService: TranscriptionPort;
  private audioStreams: Map<string, PassThrough>;
  private logger: Logger;
  private recordService: RecordService;

  constructor(server: Server) {
    this.io = new SocketServer(server, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });

    this.transcriptionService = new AWSTranscribeAdapter();
    this.audioStreams = new Map();
    this.logger = new Logger();
    this.recordService = new RecordService();
    this.setupSocketEvents();
  }

  private setupSocketEvents() {
    this.io.on('connection', (socket) => {
      this.logger.info({
        component: "SocketAdapter",
        message: "Client connected to transcription service"
      });

      socket.on('join-call', async ({ projectId, callId }) => {
        const streamId = `${socket.id}-${projectId}-${callId}`;
        const audioStream = new PassThrough();
        this.audioStreams.set(streamId, audioStream);

        try {
          // Create an async generator that yields Buffer chunks from the PassThrough stream
          const bufferStream = (async function* () {
            while (true) {
              const chunk = await new Promise<Buffer>((resolve) => {
                audioStream.once('data', resolve);
              });
              if (!chunk) break;
              yield chunk;
            }
          })();

          // Start transcription using the domain port
          for await (const result of this.transcriptionService.startTranscription(bufferStream)) {
            if (!result.isPartial) {
              socket.emit('transcription', result.text);
              await this.recordService.handleTranscriptionResult(projectId, callId, result);
            }
          }
        } catch (error) {
          this.logger.error({
            component: "SocketAdapter",
            message: "Transcription error",
            data: { error }
          });
          socket.emit('error', 'Transcription failed');
        } finally {
          await this.transcriptionService.stopTranscription();
          await this.recordService.finalizeCall(projectId, callId);
          this.audioStreams.delete(streamId);
        }
      });

      socket.on('audio-data', ({ projectId, callId, data }) => {
        const streamId = `${socket.id}-${projectId}-${callId}`;
        const audioStream = this.audioStreams.get(streamId);
        if (audioStream) {
          audioStream.write(Buffer.from(data));
        }
      });

      socket.on('get-transcript', async ({ projectId, callId }, callback) => {
        try {
          const transcript = await this.recordService.getTranscript(projectId, callId);
          callback({ success: true, transcript });
        } catch (error) {
          this.logger.error({
            component: "SocketAdapter",
            message: "Error fetching transcript",
            data: { error, projectId, callId }
          });
          callback({ success: false, error: 'Failed to fetch transcript' });
        }
      });

      socket.on('disconnect', async () => {
        // Cleanup any remaining streams
        for (const [streamId, stream] of this.audioStreams.entries()) {
          if (streamId.startsWith(socket.id)) {
            const [, projectId, callId] = streamId.split('-');
            stream.end();
            this.audioStreams.delete(streamId);
            await this.recordService.finalizeCall(projectId, callId);
          }
        }
        await this.transcriptionService.stopTranscription();
        this.logger.info({
          component: "SocketAdapter",
          message: "Client disconnected from transcription service"
        });
      });
    });
  }
}
