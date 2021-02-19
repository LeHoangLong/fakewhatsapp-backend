export class Invitation {
    senderUsername: string;
    recipientUsername: string;
    constructor(senderUsername: string, recipientUsername: string) {
        this.senderUsername = senderUsername;
        this.recipientUsername = recipientUsername;
    }
}