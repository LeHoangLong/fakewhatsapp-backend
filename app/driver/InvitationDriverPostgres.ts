import { inject, injectable } from "inversify";
import { Pool } from "pg";
import { Invitation } from "../model/Invitation";
import { TYPES } from "../types";
import { IInvitationDriver, IInvitationErrorInvitationNotFound } from "./IInvitationDriver";

@injectable()
export class InvitationDriverPostgres implements IInvitationDriver {
    constructor(
        @inject(TYPES.UserDatabaseClientPool) public pool: Pool,
    ) {
    }

    async fetchSentFriendRequest(username1: string, username2: string): Promise<Invitation> {
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
}