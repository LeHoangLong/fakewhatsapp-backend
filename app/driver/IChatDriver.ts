import { Chat } from "../model/Chat";
import { Message } from "../model/Message";

export class IChatDriverErrorChatBetween2UsersNotFound {
    constructor(
        public userInfoId1: number,
        public userInfoId2: number,
    ) {

    }
}

export class IChatDriverErrorChatIdNotFound {

}

export interface IChatDriver {
    fetchChatsForUser(userInfoId: number, limit: number, offset: number): Promise<Chat[]>;
    createChatBetween2Users(name: string, username1: string, userInfoId1: number, username2: string, userInfoId2: number): Promise<Chat>;
    fetchChatBetween2Users(userInfoId1: number, userInfoId2: number): Promise<Chat>;
    sendMessageToChat(senderInfoId: number, chatId: number, content: string): Promise<Message>;
    doesChatIdExists(senderInfoId: number, chatId: number): Promise<boolean>;
    fetchMessagesFromChat(chatId: number, limit: number, offset: number): Promise<Message[]>;
}