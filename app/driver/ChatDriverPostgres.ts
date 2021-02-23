import { inject, injectable } from "inversify";
import { Pool } from "pg";
import { Chat } from "../model/Chat";
import { TYPES } from "../types";
import { IChatDriver, IChatDriverErrorChatBetween2UsersNotFound } from './IChatDriver';

@injectable()
export class ChatDriverPostgres implements IChatDriver {
    constructor(
        @inject(TYPES.UserDatabaseClientPool) private pool: Pool
    ){

    }

    async fetchChatsForUser(userInfoId: number, limit: number, offset: number): Promise<Chat[]> {
        let result = await this.pool.query('SELECT ch.id, ch.name, m.content, m.senttime FROM "Chat" ch LEFT JOIN "Message" m ON ch.latestmessageid=m.id INNER JOIN "User_Chat" uc ON (ch.id=uc.chatid AND uc.userinfoid=$1) ORDER BY m.senttime DESC LIMIT $2 OFFSET $3', [userInfoId, limit, offset]);
        let ret: Chat[] = [];
        for (let i = 0; i < result.rowCount; i++) {
            let chat: Chat = new Chat(
                result.rows[i].id, 
                [], 
                result.rows[i].content,
                result.rows[i].senttime,
                result.rows[i].name,
            );
            ret.push(chat);
        }
        return ret;
    }
    
    async createChat(name: string): Promise<Chat> {
        let result = await this.pool.query('INSERT INTO "Chat" (name) VALUES ($1) RETURNING id, name', [name]);
        return new Chat(
            result.rows[0].id,
            [],
            null,
            null,
            result.rows[0].name,
        )
    }

    async fetchChatBetween2Users(userInfoId1: number, userInfoId2: number): Promise<Chat> {
        console.log('abcdef');
        let result = await this.pool.query(`
                SELECT ch.id, ch.name, m.content, m.sentTime
                    FROM "User_Chat" uc1
                        INNER JOIN "User_Chat" uc2 ON uc1.chatId=uc2.chatId
                            AND ((uc1.userInfoId=$1 AND uc2.userInfoId=$2) OR (uc1.userInfoId=$2 AND uc2.userInfoId=$1))
                            AND (SELECT COUNT(*) FROM "User_Chat" uc3 WHERE uc3.chatId=uc1.chatId) = 2
                        INNER JOIN "Chat" ch 
                            ON ch.id = uc1.chatId
                        LEFT JOIN "Message" m ON m.id=ch.latestMessageId 
                    ORDER BY ch.id
            `, [userInfoId1, userInfoId2]);
        if (result.rowCount > 0) {
            return new Chat(
                result.rows[0].id,
                [],
                result.rows[0].content,
                result.rows[0].senttime,
                result.rows[0].name,
            );
        } else {
            throw new IChatDriverErrorChatBetween2UsersNotFound(userInfoId1, userInfoId2);
        }
    }

    async sendMessageToChat(chatId: number): Promise<void> {

    }
}