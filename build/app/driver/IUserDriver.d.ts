export declare class IUserDriverErrorUsernameAlreadyExistsWhenCreateInstance {
    readonly username: string;
    constructor(username: string);
    toString(): string;
}
export declare class IUserDriverErrorMissingRequiredParameter {
    readonly parameter: string;
    constructor(parameter: string);
    toString(): string;
}
export declare class IUserDriverErrorNoSuchUsername {
    readonly username: string;
    constructor(userId: string);
    toString(): string;
}
export interface IUserDriver {
    createUser(username: string, password: string): Promise<void>;
    checkPassword(username: string, password: string): Promise<boolean>;
    changePassword(username: string, password: string): Promise<void>;
    doesUsernameExists(username: string): Promise<boolean>;
}
