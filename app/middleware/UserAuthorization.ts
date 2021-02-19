import express from 'express';
import { injectable } from 'inversify';

@injectable()
export class UserAuthorization {
    authorize(request: express.Request, response: express.Response, next: express.NextFunction) {
        if (!request.context || request.context.username === '') {
            return response.status(401).send();
        } else {
            next();
        }
    }
}