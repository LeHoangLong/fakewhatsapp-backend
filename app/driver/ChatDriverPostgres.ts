import { inject, injectable } from "inversify";
import { Pool } from "pg";
import { Chat } from "../model/Chat";
import { TYPES } from "../types";
import { IChatDriver } from './IChatDriver';

@injectable()
export class ChatDriverPostgres implements IChatDriver {
    constructor(
        @inject(TYPES.UserDatabaseClientPool) private pool: Pool
    ){

    }

    async fetchChatsForUser(userInfoId: number, limit: number, offset: number): Promise<Chat[]> {
        let result = await this.pool.query('SELECT ch.id, (SELECT m.content from "Message" m where m.id=ch.latestmessageid) as latestmessagecontent from "Chat" ch where id in (SELECT id from "User_Chat" where userinfoid=$1) LIMIT $2 OFFSET $3', [userInfoId, limit, offset]);
        let ret: Chat[] = [];
        for (let i = 0; i < result.rowCount; i++) {
            let chat: Chat = new Chat(
                result.rows[i].id, 
                [], 
                result.rows[i].latestmessagecontent
            );
        }
        return ret;
    }
}