import express = require('express');
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { UserController, UserControllerErrorUsernameAlreadyExistsWhenSignUp, UserControllerErrorUsernameNotFound } from '../controller/UserController';

@injectable()
export class UserView {
    controller: UserController;
    constructor(
        @inject(TYPES.UserController) controller: UserController
    ) {
        this.controller = controller;
    }


    async loginView(request: express.Request, response: express.Response) {
        let username = request.body.username;
        let password = request.body.password;

        if (!username || !password) {
            return response.status(400).send();
        }

        try {
            if (!await this.controller.logIn(username, password)) {
                return response.status(403).send();
            } else {
                return response.status(200).send();
            }
        } catch (err) {
            if (err instanceof UserControllerErrorUsernameNotFound) {
                return response.status(403).send();
            } else {
                response.status(502).send(err.toString());
                throw err;
            }
        }
    }
    
    async signUpView(request: express.Request, response: express.Response) {
        let username = request.body.username;
        let password = request.body.password;
        if (!username || !password) {
            return response.status(400).send();
        }

        try {
            await this.controller.signUp(username, password);
            return response.status(201).send();
        } catch (err) {
            if (err instanceof UserControllerErrorUsernameAlreadyExistsWhenSignUp) {
                return response.status(403).send();
            } else {
                return response.status(502).send(err.toString());
            }
        }
    }

    //if we come to here, must have already been authorized, so return the attached user model
    async getInfoView(request: express.Request, response: express.Response) {
        return response.status(200).send(request.context.user);
    }
}