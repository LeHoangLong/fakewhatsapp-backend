import { Invitation } from "../model/Invitation";

export class IInvitationErrorInvitationNotFound {

}

export interface IInvitationDriver {
    fetchSentFriendRequest(username1: string, username2: string): Promise<Invitation>;
}