import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
    [key: string]: any; // you can add more fields if needed
  };
}
