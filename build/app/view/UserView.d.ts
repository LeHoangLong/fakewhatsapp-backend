import express = require('express');
import { UserController } from '../controller/UserController';
export declare class UserView {
    controller: UserController;
    constructor(controller: UserController);
    loginView(request: express.Request, response: express.Response): Promise<express.Response<any, Record<string, any>> | undefined>;
    signUpView(request: express.Request, response: express.Response): Promise<express.Response<any, Record<string, any>>>;
}
