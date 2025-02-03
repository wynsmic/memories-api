/* eslint-disable @typescript-eslint/no-unused-vars */

interface LogEntry {
  component: string;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: { [key: string]: any } | string;
}

export class Logger {
  private log = async (level: string, record: LogEntry) => {
    console.log(`############ ${level} ############`)
    console.log(` ${record.message}`);
    record.data  && console.log(` ${record.data}`);
  };
  error = async (record: LogEntry): Promise<void> => {
    this.log('error', record);
  };
  warn = async (record: LogEntry): Promise<void> => {
    this.log('warn', record);
  };
  info = async (record: LogEntry): Promise<void> => {
    this.log('info', record);
  };

  debug = async (record: LogEntry): Promise<void> => {
    this.log('debug', record);
  };
}
