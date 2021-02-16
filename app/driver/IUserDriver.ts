import { Group } from '../controller/Group';

export class IUserDriverErrorUsernameAlreadyExistsWhenCreateInstance {
    readonly username: string;
    constructor(username: string) { 
        this.username = username;
    }
    toString(): string {
        console.log('to string');
        return `Username ${this.username} already exists`;
    }
}

//throw by function if a required parameter is not set when called
export class IUserDriverErrorMissingRequiredParameter extends Error {
    readonly parameter: string;
    constructor(parameter: string) {
        super();
        this.parameter = parameter;
    }

    toString(): string {
        return `Missing required parameter ${this.parameter} when create instance`;
    }
}

export class IUserDriverErrorNoSuchUsername extends Error {
    readonly username: string;

    constructor(userId: string) {
        super();
        this.username = userId;
    }

    toString(): string {
        return `User with id ${this.username} not found`;
    }
}

export interface IUserDriver {
    createUser(username: string, password: string): Promise<void>;
    checkPassword(username: string, password: string): Promise<boolean>;
    changePassword(username: string, password: string): Promise<void>;
    doesUsernameExists(username: string): Promise<boolean>;
}