import express from 'express';
import config from '../../config.json';

declare global {
    export namespace Express {
      export interface Request {
        context: Context
      }
    }
}

class Context {
    username: string;
    paginationSize: number;
    paginationOffset: number;
    constructor(username: string, paginationSize: number, paginationOffset: number) {
      this.username = username;
      this.paginationSize = paginationSize;
      this.paginationOffset = paginationOffset;
    }
}

//must be at the front of middleware chain
export function generateContext(request: express.Request, response: express.Response, next: express.NextFunction) {
    request.context = new Context('', config.pagination.defaultSize, 0);
    next();
}

