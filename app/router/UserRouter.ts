import express  from 'express';
import { myContainer } from '../inversify.config';
import { UserAuthorization } from '../middleware/UserAuthorization';
import { TYPES } from '../types';
import { UserView } from '../view/UserView';

export const router: express.Router = express.Router();
const userAuthorization: UserAuthorization = myContainer.get<UserAuthorization>(TYPES.UserAuthorization);

router.post('/login', (req, res) => {
    myContainer.get<UserView>(TYPES.UserView).loginView(req, res)
});
router.post('/signup', (req, res) => {
    myContainer.get<UserView>(TYPES.UserView).signUpView(req, res)
});
router.get('/info', userAuthorization.authorize, (req, res) => {
    myContainer.get<UserView>(TYPES.UserView).getInfoView(req, res)
});
