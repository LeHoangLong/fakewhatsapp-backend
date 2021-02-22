import { Chat } from "../model/Chat";

export interface IChatDriver {
    fetchChatsForUser(userInfoId: number, limit: number, offset: number): Promise<Chat[]>;
}