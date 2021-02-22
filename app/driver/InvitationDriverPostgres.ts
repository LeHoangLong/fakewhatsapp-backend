import { inject, injectable } from "inversify";
import { Pool, PoolClient } from "pg";
import { Invitation } from "../model/Invitation";
import { TYPES } from "../types";
import { IInvitationDriver, IInvitationErrorFuncionMustBeCalledInTransaction, IInvitationErrorInvitationNotFound } from "./IInvitationDriver";

@injectable()
export class InvitationDriverPostgres implements IInvitationDriver {
    client?: PoolClient;
    constructor(
        @inject(TYPES.UserDatabaseClientPool) public pool: Pool,
    ) {
    }

    async startTransaction(): Promise<void> {
        this.client = await this.pool.connect(); 
        await this.client.query('BEGIN');
    }
    
    async commit(): Promise<void> {
        if (this.client) {
            await this.client.query('COMMIT');
        }
    }

    async rollback(): Promise<void> {
        if (this.client) {
            await this.client.query('ROLLBACK');
        }
    }

    async stopTransaction(): Promise<void> {
        if (this.client) {
            this.client.release();
            this.client = undefined;
        }
    }

    async fetchFriendRequest(username1: string, username2: string): Promise<Invitation> {
        let invitationResult = await this.pool.query('SELECT createdTime, senderInfoId, recipientInfoId FROM findinvitation($1, $2)', [username1, username2]);
        if (invitationResult.rowCount > 0 && invitationResult.rows[0].createdtime !== null) {
            return new Invitation(
                invitationResult.rows[0].createdtime,
                invitationResult.rows[0].senderinfoid,
                invitationResult.rows[0].recipientinfoid,
            )
        } else {
            throw new IInvitationErrorInvitationNotFound();
        }
    }   
    
    async fetchDoesSentFriendRequestExistForUpdate(fromUsername: string, toUsername: string): Promise<boolean> {
        if (this.client) {
            let result = await this.client.query('SELECT FROM "SentInvitation" WHERE senderusername=$1 AND recipientusername=$2 FOR UPDATE', [fromUsername, toUsername]);
            if (result.rowCount > 0 ) {
                return true;
            } else {
                return false;
            }
        } else {
            throw new IInvitationErrorFuncionMustBeCalledInTransaction('fetchDoesSentFriendRequestExist');
        }
    }

    async sendFriendRequestIfNotYet(senderUsername: string, recipientUsername: string): Promise<Invitation> {
        if (this.client) {
            let invitationResult = await this.client.query('SELECT * FROM createinvitation($1, $2)', [senderUsername, recipientUsername]);
            //if success, then return an invitation object
            return new Invitation(
                invitationResult.rows[0].createdtime,
                invitationResult.rows[0].senderinfoid,
                invitationResult.rows[0].recipientinfoid,
            )
        } else {
            throw new IInvitationErrorFuncionMustBeCalledInTransaction('sendFriendRequest');
        }
    }
    
    
    async acceptFriendRequest(senderUsername: string, recipientUsername: string): Promise<void> {
        try {
            this.pool.query('SELECT acceptinvitation($1, $2)', [senderUsername, recipientUsername]);
        } catch (error) {
            if (error.message === 'NO_SUCH_INVITATION') {
                throw new IInvitationErrorInvitationNotFound();
            } else {
                throw error;
            }
        }
    }

    async deleteSentFriendRequest(senderUsername: string, recipientUsername: string): Promise<void> {
        await this.pool.query('DELETE FROM "SentInvitation" where senderUsername=$1 and recipientUsername=$2', [senderUsername, recipientUsername]);
        await this.pool.query('DELETE FROM "ReceivedInvitation" where senderUsername=$1 and recipientUsername=$2', [senderUsername, recipientUsername]);
    }
}