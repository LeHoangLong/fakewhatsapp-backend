import { inject, injectable } from "inversify";
import { Pool } from "pg";
import { Chat } from "../model/Chat";
import { Message } from "../model/Message";
import { TYPES } from "../types";
import { IChatDriver, IChatDriverErrorChatBetween2UsersNotFound, IChatDriverErrorChatIdNotFound } from './IChatDriver';

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
            let chatId: number = result.rows[i].id;
            let participantResult = await this.pool.query('SELECT userInfoId from "User_Chat" WHERE chatid=$1', [chatId]);
            let pariticipantIds: number[] = [];
            for (let j = 0; j < participantResult.rowCount; j++) {
                pariticipantIds.push(participantResult.rows[j].userinfoid);
            }
            let chat: Chat = new Chat(
                chatId, 
                [], 
                result.rows[i].content,
                result.rows[i].senttime,
                result.rows[i].name,
                pariticipantIds
            );
            ret.push(chat);
        }
        return ret;
    }
    
    async createChatBetween2Users(name: string, username1: string, userInfoId1: number, username2: string, userInfoId2: number): Promise<Chat> {
        let client = await this.pool.connect();
        try {
            await client.query('BEGIN');
            let result = await this.pool.query('INSERT INTO "Chat" (name) VALUES ($1) RETURNING id, name, createdtime', [name]);
            let chatId = result.rows[0].id;
            await client.query('INSERT INTO "User_Chat" (userinfoid, chatid, username) VALUES ($1, $2, $3)', [userInfoId1, chatId, username1]);
            await client.query('INSERT INTO "User_Chat" (userinfoid, chatid, username) VALUES ($1, $2, $3)', [userInfoId2, chatId, username2]);
            await client.query('COMMIT');
            return new Chat(
                result.rows[0].id,
                [],
                '',
                result.rows[0].createdtime,
                result.rows[0].name,
                [userInfoId1, userInfoId2]
            );
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }

    }

    async fetchChatBetween2Users(userInfoId1: number, userInfoId2: number): Promise<Chat> {
        let result = await this.pool.query(`
                SELECT ch.id, ch.name, ch.createdtime, m.content, m.sentTime
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
            let messageContent: string = result.rows[0].content;
            if (messageContent === null) {
                messageContent = '';
            }
            let messageSentTime: Date;
            if (result.rows[0].senttime === null) {
                messageSentTime = new Date(result.rows[0].createdtime); //if no message, use chat created time as the message sent time
            } else {
                messageSentTime = new Date(result.rows[0].senttime);
            }
            return new Chat(
                result.rows[0].id,
                [],
                messageContent,
                messageSentTime,
                result.rows[0].name,
                [userInfoId1, userInfoId2]
            );
        } else {
            throw new IChatDriverErrorChatBetween2UsersNotFound(userInfoId1, userInfoId2);
        }
    }

    async doesChatIdExists(senderInfoId: number, chatId: number): Promise<boolean> {
        let result = await this.pool.query('SELECT COUNT(*) FROM "Chat" ch INNER JOIN "User_Chat" uc ON uc.userinfoid=$1 and uc.chatid=ch.id and ch.id=$2', [senderInfoId, chatId]);
        return result.rows[0].count > 0;
    }

    async sendMessageToChat(senderInfoId: number, chatId: number, content: string): Promise<Message> {
        if (!await this.doesChatIdExists(senderInfoId, chatId)) {
            throw new IChatDriverErrorChatIdNotFound();
        }
        let client = await this.pool.connect();
        try {
            await client.query('BEGIN');
            let result = await client.query(`
                INSERT INTO "Message" ( senderInfoId, chatId, content ) VALUES ($1, $2, $3) RETURNING id, senttime
            `, [senderInfoId, chatId, content]);
            await client.query(`
                UPDATE "Chat" SET latestmessageid=$1 WHERE id=$2
            `, [result.rows[0].id, chatId]);
            await client.query('COMMIT');
            return {
                id: result.rows[0].id,
                senderInfoId: senderInfoId,
                content: content,
                sentTime: result.rows[0].senttime
            }
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
    
    async fetchMessagesFromChat(chatId: number, limit: number, offset: number): Promise<Message[]> {
        let result = await this.pool.query('SELECT id, senderinfoid, content, senttime FROM "Message" WHERE chatid=$1 ORDER BY senttime DESC LIMIT $2 OFFSET $3', [chatId, limit, offset]);
        let ret: Message[] = [];
        for (let i = 0; i < result.rowCount; i++) {
            let newMessage: Message = {
                id: result.rows[i].id,
                senderInfoId: result.rows[i].senderinfoid,
                content: result.rows[i].content,
                sentTime: result.rows[i].senttime,
            }
            ret.push(newMessage);
        }
        return ret;
    }
}