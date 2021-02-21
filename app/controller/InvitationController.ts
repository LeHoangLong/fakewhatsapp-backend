import { inject, injectable } from "inversify";
import { IInvitationDriver } from "../driver/IInvitationDriver";
import { IUserDriver } from "../driver/IUserDriver";
import { Invitation } from "../model/Invitation";
import { TYPES } from "../types";

export {
    IInvitationErrorInvitationNotFound as InvitationControllerErrorInvitationNotFound
} from '../driver/IInvitationDriver';

@injectable()
export class InvitationController {
    constructor(
        @inject(TYPES.InvitationDriver) public invitationDriver: IInvitationDriver,
        @inject(TYPES.UserDriver) public userDriver: IUserDriver,
    ) {

    }

    async fetchFriendRequest(username1: string, infoId2: number): Promise<Invitation> {
        let username2: string = await this.userDriver.fetchUsernameFromInfoId(infoId2);
        return this.invitationDriver.fetchSentFriendRequest(username1, username2);
    }
}