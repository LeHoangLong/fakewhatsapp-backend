import express = require('express');
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { UserController, UserControllerErrorAuthentiationFailedWithGivenUsernameAndPassword, UserControllerErrorNoSuchInfoId, UserControllerErrorUserDeleted, UserControllerErrorUsernameAlreadyExistsWhenSignUp, UserControllerErrorUsernameNotFound } from '../controller/UserController';
import config from '../../config.json';
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

    async fetchFriends(request: express.Request, response: express.Response) {
        try {
            let users = await this.controller.fetchFriends(request.context.username, request.context.paginationSize, request.context.paginationOffset);
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

    async sendFriendRequest(request: express.Request, response: express.Response) {
        try {
            let friendInfoId: number = request.body.friendInfoId;
            await this.controller.sendFriendRequestIfNotYet(request.context.username, friendInfoId);
            return response.status(200).send();
        } catch (err) {
            if (err instanceof UserControllerErrorUserDeleted) {
                return response.status(403).send({
                    'message': 'USER_DELETED'
                });
            } else if (err instanceof UserControllerErrorNoSuchInfoId) {
                response.status(403).send();
            } else {
                response.status(502).send(err.toString());
            }
            throw err;
        }
    }

    async acceptFriendRequest(request: express.Request, response: express.Response) {
        try {
            let friendInfoId: number = request.body.friendInfoId;
            await this.controller.acceptFriendRequest(request.context.username, friendInfoId);
            return response.status(200).send();
        } catch (err) {
            if (err instanceof UserControllerErrorUserDeleted) {
                return response.status(403).send({
                    'message': 'USER_DELETED'
                });
            } else if (err instanceof IUserDriverErrorNoSuchInvitation) {
                return response.status(403).send();
            } else if (err instanceof UserControllerErrorNoSuchInfoId) {
                return response.status(403).send();
            } else {
                response.status(502).send(err.toString());
            }
            throw err;
        }
    }
}