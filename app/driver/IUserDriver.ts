import { Group } from '../controller/Group';
import { User } from '../model/User';

export class IUserDriverErrorUsernameAlreadyExistsWhenCreateInstance {
    readonly username: string;
    constructor(username: string) { 
        this.username = username;
    }
    toString(): string {
        return `Username ${this.username} already exists`;
    }
}

//throw by function if a required parameter is not set when called
export class IUserDriverErrorMissingRequiredParameter {
    readonly parameter: string;
    constructor(parameter: string) {
        this.parameter = parameter;
    }

    toString(): string {
        return `Missing required parameter ${this.parameter} when create instance`;
    }
}

export class IUserDriverErrorNoSuchUsername {
    readonly username: string;

    constructor(userId: string) {
        this.username = userId;
    }

    toString(): string {
        return `User with id ${this.username} not found`;
    }
}

export interface IUserDriver {
    createUser(username: string, password: string): Promise<void>;
    isPasswordCorrect(username: string, password: string): Promise<boolean>;
    changePassword(username: string, password: string): Promise<void>;
    doesUsernameExists(username: string): Promise<boolean>;
    fetchUser(username: string): Promise<User>;
    findUserByName(name: string, offset: number, numberOfResults: number): Promise<User[]>;
}