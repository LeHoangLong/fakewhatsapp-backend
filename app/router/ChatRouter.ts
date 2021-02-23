import express  from 'express';
import { myContainer } from '../inversify.config';
import { TYPES } from '../types';
import { ChatView } from '../view/ChatView';

export const router: express.Router = express.Router();

router.get('/recent/', (req, res) => {
    myContainer.get<ChatView>(TYPES.ChatView).fetchRecentChats(req, res);
});

router.get('/conversation/to/:userInfoId', (req, res) => {
    myContainer.get<ChatView>(TYPES.ChatView).fetchChatToUser(req, res);
})

router.post('/conversation/', (req, res) => {
    myContainer.get<ChatView>(TYPES.ChatView).postConversationToUser(req, res);
});

router.post('/conversation/:chatId/messages/', (req, res) => {
    myContainer.get<ChatView>(TYPES.ChatView).postMessageToConversation(req, res);
});
