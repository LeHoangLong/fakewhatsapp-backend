import { inject, injectable } from "inversify";
import { IChatDriver } from "../driver/IChatDriver";
import { IUserDriver } from "../driver/IUserDriver";
import { Chat } from "../model/Chat";
import { User } from "../model/User";
import { TYPES } from "../types";

export {
    IUserDriverErrorNoSuchInfoId as ChatControllerErrorUserInfoIdNotFound,
} from '../driver/IUserDriver';

export {
    IChatDriverErrorChatBetween2UsersNotFound as ChatControllerErrorChatNotFound,
} from '../driver/IChatDriver';

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
}