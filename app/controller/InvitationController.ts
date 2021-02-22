import { inject, injectable } from "inversify";
import { IInvitationDriver, IInvitationErrorInvitationPendingFromOtherUser } from "../driver/IInvitationDriver";
import { IUserDriver } from "../driver/IUserDriver";
import { Invitation } from "../model/Invitation";
import { TYPES } from "../types";

export {
    IInvitationErrorInvitationNotFound as InvitationControllerErrorInvitationNotFound,
} from '../driver/IInvitationDriver';

@injectable()
export class InvitationController {
    constructor(
        @inject(TYPES.InvitationDriver) private invitationDriver: IInvitationDriver,
        @inject(TYPES.UserDriver) private userDriver: IUserDriver,
    ) {

    }

    async fetchFriendRequest(username1: string, infoId2: number): Promise<Invitation> {
        let username2: string = await this.userDriver.fetchUsernameFromInfoId(infoId2);
        return this.invitationDriver.fetchFriendRequest(username1, username2);
    }

    async createFriendRequest(senderUsername: string, recipientInfoId: number): Promise<Invitation> {
        let recipientUsername: string = await this.userDriver.fetchUsernameFromInfoId(recipientInfoId);
        try {
            let invitation: Invitation;
            await this.invitationDriver.startTransaction();
            if (!await this.invitationDriver.fetchDoesSentFriendRequestExistForUpdate(recipientUsername, senderUsername)) {
                if (!await this.invitationDriver.fetchDoesSentFriendRequestExistForUpdate(senderUsername, recipientUsername)) {
                    invitation = await this.invitationDriver.sendFriendRequestIfNotYet(senderUsername, recipientUsername);
                } else {
                    // Already sent, so return existing one
                    // Ok to call fetchFriendRequest here since we are certain that there is only 1 friend request from ourside exists
                    invitation = await this.invitationDriver.fetchFriendRequest(senderUsername, recipientUsername);
                }
            } else {
                // if friend request already sent from the other side
                // throw error
                throw new IInvitationErrorInvitationPendingFromOtherUser();
            } 
            await this.invitationDriver.commit();
            await this.invitationDriver.stopTransaction();
            return invitation;
        } catch (error) {
            await this.invitationDriver.rollback();
            throw error;  
        } finally {
            await this.invitationDriver.stopTransaction();
        }
    }
    
    
    async acceptFriendRequest(recipientUsername: string, senderInfoId: number): Promise<void> {
        let senderUsername = await this.userDriver.fetchUsernameFromInfoId(senderInfoId);
        await this.invitationDriver.acceptFriendRequest(senderUsername, recipientUsername);
    }
    

    async deleteSentFriendRequest(senderUsername: string, recipientInfoId: number): Promise<void> {
        let recipientUsername = await this.userDriver.fetchUsernameFromInfoId(recipientInfoId);
        await this.invitationDriver.deleteSentFriendRequest(senderUsername, recipientUsername);
    }

    async rejectFriendRequest(recipientUsername: string, senderInfoId: number): Promise<void> {
        let senderUsername = await this.userDriver.fetchUsernameFromInfoId(senderInfoId);
        await this.invitationDriver.deleteSentFriendRequest(senderUsername, recipientUsername);
    }
}