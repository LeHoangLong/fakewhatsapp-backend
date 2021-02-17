import express from 'express';
import { User } from '../model/User';

declare global {
    export namespace Express {
      export interface Request {
        context: Context
      }
    }
}

class Context {
    user?: User;
}

//must be at the front of middleware chain
export function generateContext(request: express.Request, response: express.Response, next: express.NextFunction) {
    request.context = new Context();
    next();
}

