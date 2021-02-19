import express = require('express');
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { UserController, UserControllerErrorAuthentiationFailedWithGivenUsernameAndPassword, UserControllerErrorUsernameAlreadyExistsWhenSignUp, UserControllerErrorUsernameNotFound } from '../controller/UserController';

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
            let jwtToken = await this.controller.logIn(username, password);
            return response.cookie('jwt', jwtToken).status(200).send();
        } catch (err) {
            if (err instanceof UserControllerErrorUsernameNotFound) {
                return response.status(403).send();
            } if (err instanceof UserControllerErrorAuthentiationFailedWithGivenUsernameAndPassword) {
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
            let jwtToken = await this.controller.signUp(username, password);
            return response.cookie('jwt', jwtToken).status(201).send();
        } catch (err) {
            console.log(err);
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

    async findUserByName(request: express.Request, response: express.Response) {
        if (!('name' in request.query)) {
            return response.status(400).send();
        }
        let name: string = request.query.name as string;
        let limit: number = 10;
        let offset: number = 0;
        if ('limit' in request.query) {
            limit = parseInt(request.query.limit as string);
        }
        if ('offset' in request.query) {
            offset = parseInt(request.query.offset as string);
        }
        try {
            let users = await this.controller.findUserByName(name, offset, limit);
            let ret: Object[] = [];
            users.forEach((element) => {
                ret.push(element.toPlainObject());
            });
            return response.status(200).send(ret);
        } catch (err) {
            response.status(502).send(err.toString());
            throw err;
        }
    }
}