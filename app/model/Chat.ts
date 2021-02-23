import { Message } from "./Message";

export class Chat {
    constructor(
        public id: number,
        public messages: Message[],
        public latestMessageContent: string,
        public latestMessageSentTime: Date,
    ) {

    }

    toPlainObject(): Object {
        return Object.assign({}, this);
    }
}