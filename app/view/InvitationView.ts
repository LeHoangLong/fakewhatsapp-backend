import { Request, Response} from "express";
import { inject, injectable } from "inversify";
import { InvitationController, InvitationControllerErrorInvitationNotFound } from "../controller/InvitationController";
import { IInvitationErrorInvitationPendingFromOtherUser } from "../driver/IInvitationDriver";
import { TYPES } from "../types";

@injectable()
export class InvitationView {
    constructor(
        @inject(TYPES.InvitationController) public controller: InvitationController
    ) {

    }

    async getInvitationForSpecificUser(request: Request, response: Response) {
        try {
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

    async postInvitation(request: Request, response: Response) {
        try {
            if (!('recipientInfoId' in request.body)) {
                return response.status(400).send();
            }
            let recipientInfoId = parseInt(request.body.recipientInfoId);
            let invitation = await this.controller.createFriendRequest(request.context.username, recipientInfoId);
            return response.status(200).send(invitation.toPlainObject());
        } catch (error) {
            if (error instanceof IInvitationErrorInvitationPendingFromOtherUser) {
                return response.status(409).send();
            } else {
                response.status(502).send(error.toString());
                throw error;
            }
        }
    }
}