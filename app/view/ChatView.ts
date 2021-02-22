import { inject, injectable } from "inversify";
import { ChatController } from "../controller/ChatController";
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
}