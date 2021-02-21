import { Request, Response} from "express";
import { inject, injectable } from "inversify";
import { InvitationController, InvitationControllerErrorInvitationNotFound } from "../controller/InvitationController";
import { TYPES } from "../types";

@injectable()
export class InvitationView {
    constructor(
        @inject(TYPES.InvitationController) public controller: InvitationController
    ) {

    }

    async getInvitationForSpecificUser(request: Request, response: Response) {
        try {
            console.log(request.params);
            if (!('userInfoId' in request.params)) {
                return response.status(400).send();
            }
            let userInfoId = parseInt(request.params.userInfoId);
            let invitation = await this.controller.fetchFriendRequest(request.context.username, userInfoId);
            return response.status(200).send(invitation.toPlainObject());
        } catch (error) {
            if (error instanceof InvitationControllerErrorInvitationNotFound) {
                return response.status(404).send();
            } else {
                response.status(502).send(error.toString());
                throw error;
            }
        }
    }
}