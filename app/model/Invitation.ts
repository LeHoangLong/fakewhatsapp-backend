export class Invitation {
    constructor(
        public createdTime: Date,
        public senderInfoId: number, 
        public recipientInfoId: number) {
    }

    toPlainObject(): Object {
        return Object.assign({}, this);
    }
}