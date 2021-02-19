export class User {
    userInfoId: number;
    name: string;
    constructor(userInfoId: number, name: string) {
        this.userInfoId = userInfoId;
        this.name = name;
    }
    toPlainObject(): Object {
        return Object.assign({}, this);
    }
}