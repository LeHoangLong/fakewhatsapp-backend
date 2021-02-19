import express from 'express';
import { injectable } from 'inversify';

@injectable()
export class UserAuthorization {
    authorize(request: express.Request, response: express.Response, next: express.NextFunction) {
        console.log('request.context');
        console.log(request.context);
        if (!request.context || !request.context.user) {
            return response.status(401).send();
        } else {
            next();
        }
    }
}