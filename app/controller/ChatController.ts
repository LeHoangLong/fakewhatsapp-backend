import { inject, injectable } from "inversify";
import { IChatDriver, IChatDriverErrorChatBetween2UsersNotFound } from "../driver/IChatDriver";
import { IUserDriver } from "../driver/IUserDriver";
import { Chat } from "../model/Chat";
import { Message } from "../model/Message";
import { User } from "../model/User";
import { TYPES } from "../types";

export {
    IUserDriverErrorNoSuchInfoId as ChatControllerErrorUserInfoIdNotFound,
} from '../driver/IUserDriver';

export {
    IChatDriverErrorChatBetween2UsersNotFound as ChatControllerErrorChatNotFound,
    IChatDriverErrorChatIdNotFound as ChatControllerChatIdNotFound,
} from '../driver/IChatDriver';

export interface ChatMessagePair {
    message: Message,
    chat: Chat,
}

@injectable()
export class ChatController {
    constructor(
        @inject(TYPES.ChatDriver) private chatDriver: IChatDriver,
        @inject(TYPES.UserDriver) private userDriver: IUserDriver,
    ) {

    }

    async fetchChatsForUser(username: string, limit: number, offset: number): Promise<Chat[]> {
        let user: User = await this.userDriver.fetchUser(username);
        return this.chatDriver.fetchChatsForUser(user.userInfoId, limit, offset);
    } 

    async fetchChatBetween2Users(username: string, otherUserInfoId: number): Promise<Chat> {
        let user = await this.userDriver.fetchUser(username);
        let chat: Chat = await this.chatDriver.fetchChatBetween2Users(user.userInfoId, otherUserInfoId);
        return chat;
    }

    async sendMessageToChat(username: string, chatId: number, content: string): Promise<Message> {
        let user = await this.userDriver.fetchUser(username);
        return this.chatDriver.sendMessageToChat(user.userInfoId, chatId, content);
    }
 
    async createChatBetween2Users(username1: string, otherUserInfoId: number): Promise<Chat> {
        let user1 = await this.userDriver.fetchUser(username1);
        let username2 = await this.userDriver.fetchUsernameFromInfoId(otherUserInfoId);
        return this.chatDriver.createChatBetween2Users('', username1, user1.userInfoId, username2, otherUserInfoId);
    }
}