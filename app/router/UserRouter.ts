import express  from 'express';
import { myContainer } from '../inversify.config';
import { UserAuthorization } from '../middleware/UserAuthorization';
import { TYPES } from '../types';
import { UserView } from '../view/UserView';

export const router: express.Router = express.Router();
const userAuthorization: UserAuthorization = myContainer.get<UserAuthorization>(TYPES.UserAuthorization);

router.post('/login', myContainer.get<UserView>(TYPES.UserView).loginView);
router.post('/signup', myContainer.get<UserView>(TYPES.UserView).signUpView)
router.get('/info', userAuthorization.authorize, myContainer.get<UserView>(TYPES.UserView).getInfoView);
