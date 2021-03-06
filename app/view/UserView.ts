import express = require('express');
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { UserController, UserControllerErrorAuthentiationFailedWithGivenUsernameAndPassword, UserControllerErrorNoSuchInfoId, UserControllerErrorUserDeleted, UserControllerErrorUsernameAlreadyExistsWhenSignUp, UserControllerErrorUsernameNotFound } from '../controller/UserController';
import { IUserDriverErrorNoSuchInvitation } from '../driver/IUserDriver';

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
        let user = await this.controller.getUserInfo(request.context.username);
        return response.status(200).send(user);
    }

    async findUserByName(request: express.Request, response: express.Response) {
        if (!('name' in request.query)) {
            return response.status(400).send();
        }
        let name: string = request.query.name as string;
        try {
            let users = await this.controller.findUserByName(name, request.context.paginationSize, request.context.paginationOffset);
            let ret = {
                rows: [] as Object[],
            };
            users.forEach((element) => {
                ret.rows.push(element.toPlainObject());
            });
            return response.status(200).send(ret);
        } catch (err) {
            response.status(502).send(err.toString());
            throw err;
        }
    }

    async fetchFriends(request: express.Request, response: express.Response) {
        try {
            let name: any = request.query.name;
            let [users, count] = await this.controller.fetchFriends(request.context.username, request.context.paginationSize, request.context.paginationOffset, request.context.getCount, name);
            let userData: Object[] = [];
            users.forEach((element) => {
                userData.push(element.toPlainObject());
            });
            let ret: any = {
                rows: userData,
            }
            if (request.context.getCount) {
                ret['count'] = count;
            }
            return response.status(200).send(ret);
        } catch (err) {
            response.status(502).send(err.toString());
            throw err;
        }
    }
    
    async getUserFromInfoId(request: express.Request, response: express.Response) {
        try {
            if (!('userInfoId' in request.params)) {
                return response.status(400).send();
            }
            let userInfoId = parseInt(request.params.userInfoId);
            let user = await this.controller.findUserByInfoId(userInfoId);
            return response.status(200).send(user.toPlainObject());
        } catch (error) {
            if (error instanceof UserControllerErrorNoSuchInfoId) {
                response.status(404).send();
            } else {
                response.status(502).send(error.toString());
                throw error;
            }
        }
    }
}