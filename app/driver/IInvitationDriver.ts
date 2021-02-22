import { Invitation } from "../model/Invitation";

export class IInvitationErrorInvitationNotFound {

}

export class IInvitationErrorFuncionMustBeCalledInTransaction {

}

export class IInvitationErrorInvitationPendingFromOtherUser {
    
}

export interface IInvitationDriver {
    fetchFriendRequest(username1: string, username2: string): Promise<Invitation>;
    fetchDoesSentFriendRequestExistForUpdate(fromUsername: string, toUsername: string): Promise<boolean>;
    sendFriendRequestIfNotYet(senderUsername: string, recipientUsername: string): Promise<Invitation>;
    startTransaction(): Promise<void>;
    commit(): Promise<void>;
    rollback(): Promise<void>;
    stopTransaction(): Promise<void>;
    acceptFriendRequest(senderUsername: string, recipientUsername: string): Promise<void>;
    deleteSentFriendRequest(senderUsername: string, recipientUsername: string): Promise<void>;
}