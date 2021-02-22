import express  from 'express';
import { myContainer } from '../inversify.config';
import { UserAuthorization } from '../middleware/UserAuthorization';
import { TYPES } from '../types';
import { InvitationView } from '../view/InvitationView';
import { UserView } from '../view/UserView';

export const router: express.Router = express.Router();

router.get('/to-from/:userInfoId', (req, res) => {
    myContainer.get<InvitationView>(TYPES.InvitationView).getInvitationForSpecificUser(req, res);
});

router.post('/sentInvitations/', (req, res) => {
    myContainer.get<InvitationView>(TYPES.InvitationView).postInvitation(req, res);
})

router.post('/deletedInvitations', (req, res) => {
    myContainer.get<InvitationView>(TYPES.InvitationView).postDeleteSentInvitation(req, res);
});