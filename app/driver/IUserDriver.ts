import { Group } from '../controller/Group';
import { Invitation } from '../model/Invitation';
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

export class IUserDriverErrorNoSuchInfoId {
    readonly infoId: number;

    constructor(infoId: number) {
        this.infoId = infoId;
    }

    toString(): string {
        return `User with info id ${this.infoId} not found`;
    }
}
export class IUserDriverErrorUserDeleted {
    readonly infoId: number;

    constructor(infoId: number) {
        this.infoId = infoId;
    }

    toString(): string {
        return `User with info id ${this.infoId} has already been deleted`;
    }
}

export class IUserDriverErrorNoSuchInvitation {
    readonly senderUsername: string;
    readonly recipientUsername: string;
    constructor(senderUsername: string, recipientUsername: string) {
        this.senderUsername = senderUsername;
        this.recipientUsername = recipientUsername;
    }
    toString(): string {
        return `No invitation from ${this.senderUsername} to ${this.recipientUsername}`;
    }
}


export interface IUserDriver {
    createUser(username: string, password: string): Promise<void>;
    isPasswordCorrect(username: string, password: string): Promise<boolean>;
    changePassword(username: string, password: string): Promise<void>;
    doesUsernameExists(username: string): Promise<boolean>;
    fetchUser(username: string): Promise<User>;
    findUserByName(name: string, numberOfResults: number, offset: number): Promise<User[]>;
    fetchNumberOfFriends(username: string): Promise<number>;
    fetchFriends(username: string, numberOfResults: number, offset: number): Promise<User[]>;
    sendFriendRequestIfNotYet(senderUsername: string, recipientUsername: string): Promise<Invitation>;
    fetchUsernameFromInfoId(infoId: number): Promise<string>;
    acceptFriendRequest(senderUsername: string, recipientUsername: string): Promise<void>;
}