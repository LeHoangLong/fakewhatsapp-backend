import jwt, { TokenExpiredError } from 'jsonwebtoken';
import express from 'express';
import { User } from '../model/User';
import * as Request from './Context'; //not used but import here to show that we have dependency on this module (to extend express request object)
import { IUserDriver, IUserDriverErrorNoSuchUsername } from '../driver/IUserDriver';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';

@injectable()
export class JwtAuthentication {
    readonly secretKey: string;
    readonly durationS: number;
    private driver: IUserDriver;

    constructor(
        @inject(TYPES.UserDriver) driver: IUserDriver,
        @inject(TYPES.JwtSecretKey) secretKey: string,
        @inject(TYPES.JwtDuration) durationS: number
    ) {
        this.secretKey = secretKey;
        this.durationS = durationS;
        this.driver = driver;
    }

    generateToken(username: string) {
        return jwt.sign({username: username}, this.secretKey, {
            expiresIn: this.durationS
        });
    }

    async authenticate(request: express.Request, response: express.Response, next: express.NextFunction) {
        try {
            if (request.cookies != undefined && request.cookies.jwt != undefined) {
                let payload: any = jwt.verify(request.cookies.jwt, this.secretKey);
                if ('username' in payload) {
                    let username: string = payload.username;
                    try { 
                        if (await this.driver.doesUsernameExists(username)) {
                            request.context.username = username;
                        }
                        next();
                    } catch (error) {
                        if (error instanceof IUserDriverErrorNoSuchUsername) {
                            return response.status(403).send();
                        } else {
                            return response.status(502).send(error.toString());
                        }
                    }
                } else {
                    next();
                }
            } else {
                next();
            }
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                return response.status(403).send();
            } else {
                response.status(502).send(error.toString());
                throw error;
            }
        }
    }
}
