import { inject, injectable } from "inversify";
import { ChatController, ChatControllerChatIdNotFound, ChatControllerErrorChatNotFound, ChatControllerErrorUserInfoIdNotFound, ChatMessagePair } from "../controller/ChatController";
import { TYPES } from "../types";
import { Request, Response, NextFunction } from 'express';

@injectable()
export class ChatView {
    constructor(
        @inject(TYPES.ChatController) public controller: ChatController
    ) {

    }

    async fetchRecentChats(request: Request, response: Response) {
        try {
            let chats = await this.controller.fetchChatsForUser(request.context.username, request.context.paginationSize, request.context.paginationOffset);
            let ret: any = {
                rows: []
            }
            for (let i = 0; i < chats.length; i++) {
                ret.rows.push(chats[i].toPlainObject());
            }
            return response.status(200).send(ret);
        } catch (error) {
            response.status(502).send();
            throw error;
        }
    }

    async fetchChatToUser(request: Request, response: Response) {
        try {
            if (!('userInfoId' in request.params)) {
                return response.status(400).send();
            }
            let userInfoId = parseInt(request.params.userInfoId);
            let chat = await this.controller.fetchChatBetween2Users(request.context.username, userInfoId);
            return response.status(200).send(chat.toPlainObject());
        } catch (error) {
            if (error instanceof ChatControllerErrorUserInfoIdNotFound) {
                return response.status(404).send();
            } else if (error instanceof ChatControllerErrorChatNotFound) {
                return response.status(404).send();
            }
            response.status(502).send();
            throw error;
        }
    }

    async postConversationToUser(request: Request, response: Response) {
        try {
            if (!('otherUserInfoId' in request.body)) {
                return response.status(400).send();
            }
            let otherUserInfoId: number = request.body.otherUserInfoId;
            let chat = await this.controller.createChatBetween2Users(request.context.username, otherUserInfoId);
            return response.status(201).send(chat.toPlainObject());
        } catch (error) {
            if (error instanceof ChatControllerErrorUserInfoIdNotFound) {
                return response.status(404).send();
            } else {
                response.status(502).send();
                throw error;
            }
        }
        
    }

    async postMessageToConversation(request: Request, response: Response) {
        try {
            if (!('content' in request.body) && !('chatId' in request.params)) {
                return response.status(400).send();
            }
            let content: string = request.body.content;
            let chatId: number = parseInt(request.params.chatId);
            let message = await this.controller.sendMessageToChat(request.context.username, chatId, content);
            return response.status(201).send({
                chatId: chatId,
                message: message
            });
        } catch (error) {
            if (error instanceof ChatControllerErrorUserInfoIdNotFound) {
                return response.status(404).send();
            } else if (error instanceof ChatControllerErrorChatNotFound) {
                return response.status(404).send();
            } else if (error instanceof ChatControllerChatIdNotFound) {
                return response.status(404).send();
            }
            response.status(502).send();
            throw error;
        }
    }
}