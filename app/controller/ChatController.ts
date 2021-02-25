import { inject, injectable } from "inversify";
import { IChatDriver, IChatDriverErrorChatIdNotFound } from "../driver/IChatDriver";
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

export class UserWithFriendFlag extends User {
    constructor(
        userInfoId: number,
        name: string,
        public isFriend: boolean,
    ) {
        super(userInfoId, name);
    }
}

export interface ChatsWithParticipantsInfo {
    chats: Chat[],
    participants: UserWithFriendFlag[],
}

@injectable()
export class ChatController {
    constructor(
        @inject(TYPES.ChatDriver) private chatDriver: IChatDriver,
        @inject(TYPES.UserDriver) private userDriver: IUserDriver,
    ) {

    }

    async fetchChatsForUser(username: string, limit: number, offset: number): Promise<ChatsWithParticipantsInfo> {
        let user: User = await this.userDriver.fetchUser(username);
        let chats = await this.chatDriver.fetchChatsForUser(user.userInfoId, limit, offset);
        let participants: UserWithFriendFlag[] = [];
        let fetchedParticipantIds: number[] = [];
        for (let i = 0; i < chats.length; i++) {
            let chat = chats[i];
            for (let j = 0; j < chat.participantsId.length; j++) {
                let participantId = chat.participantsId[j];
                if (!fetchedParticipantIds.includes(participantId)) {
                    fetchedParticipantIds.push(participantId);
                    let user = await this.userDriver.fetchUserFromInfoId(participantId);
                    let username2 = await this.userDriver.fetchUsernameFromInfoId(participantId);
                    let isFriend = await this.userDriver.isFriend(username, username2);
                    participants.push(new UserWithFriendFlag(
                        user.userInfoId,
                        user.name,
                        isFriend,
                    ));
                }
            }
        }
        return {
            participants: participants,
            chats: chats,
        };
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

    async fetchMessagesFromChat(username: string, chatId: number, limit: number, offset: number): Promise<Message[]> {
        let user = await this.userDriver.fetchUser(username);
        if (!await this.chatDriver.doesChatIdExists(user.userInfoId, chatId)) {
            throw new IChatDriverErrorChatIdNotFound();
        }
        return this.chatDriver.fetchMessagesFromChat(chatId, limit, offset);
    }
}