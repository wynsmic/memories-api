/* eslint-disable @typescript-eslint/no-unused-vars */

import { LoggerInterface } from './logger_interface';

export class Logger {
  private log = (level: string, record: LoggerInterface) => {
    console.log(`############ ${level} ############`);
    console.log(` ${record.message}`);
    if (record.data) {
      console.log(` ${JSON.stringify(record.data)}`);
    }
  };
  error = (record: LoggerInterface): void => {
    this.log('error', record);
  };
  warn = (record: LoggerInterface): void => {
    this.log('warn', record);
  };
  info = (record: LoggerInterface): void => {
    this.log('info', record);
  };

  debug = (record: LoggerInterface): void => {
    this.log('debug', record);
  };
}
