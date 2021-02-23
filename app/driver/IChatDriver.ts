import { Chat } from "../model/Chat";

export class IChatDriverErrorChatBetween2UsersNotFound {
    constructor(
        public userInfoId1: number,
        public userInfoId2: number,
    ) {

    }
}

export interface IChatDriver {
    fetchChatsForUser(userInfoId: number, limit: number, offset: number): Promise<Chat[]>;
    createChat(name: string): Promise<Chat>;
    fetchChatBetween2Users(userInfoId1: number, userInfoId2: number): Promise<Chat>;
    sendMessageToChat(chatId: number): Promise<void>;
}