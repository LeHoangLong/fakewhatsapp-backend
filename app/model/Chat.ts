import { Message } from "./Message";

export class Chat {
    constructor(
        public id: number,
        public messages: Message[],
        public latestMessageContent: string | null,
        public latestMessageSentTime: Date | null,
        public name: string,
    ) {

    }

    toPlainObject(): Object {
        return Object.assign({}, this);
    }
}