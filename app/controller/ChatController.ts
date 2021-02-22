import { inject, injectable } from "inversify";
import { IChatDriver } from "../driver/IChatDriver";
import { IUserDriver } from "../driver/IUserDriver";
import { Chat } from "../model/Chat";
import { User } from "../model/User";
import { TYPES } from "../types";

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
}