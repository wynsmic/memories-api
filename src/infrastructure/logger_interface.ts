export interface LoggerInterface {
  component: string;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: { [key: string]: any } | string;
}
