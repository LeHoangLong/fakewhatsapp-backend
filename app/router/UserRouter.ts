import express  from 'express';
import { myContainer } from '../inversify.config';
import { TYPES } from '../types';
import { UserView } from '../view/UserView';

export const router: express.Router = express.Router();

router.post('/login', function (req, res) {
    myContainer.get<UserView>(TYPES.UserView).loginView(req, res);
});

router.post('/signup', function (req, res) {
    myContainer.get<UserView>(TYPES.UserView).signUpView(req, res);
})
