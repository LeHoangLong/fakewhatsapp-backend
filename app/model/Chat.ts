import { Message } from "./Message";

export class Chat {
    constructor(
        public id: number,
        public messages: Message[],
        public latestMessageContent: string,
        public latestMessageSentTime: Date,
        public name: string,
        public participantsId: number[],
    ) {

    }

    toPlainObject(): Object {
        return Object.assign({}, this);
    }
}