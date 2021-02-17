import { IUserDriver } from '../driver/IUserDriver';
export { IUserDriverErrorNoSuchUsername as UserControllerErrorUsernameNotFound, IUserDriverErrorUsernameAlreadyExistsWhenCreateInstance as UserControllerErrorUsernameAlreadyExistsWhenSignUp, } from '../driver/IUserDriver';
export declare class UserController {
    driver: IUserDriver;
    constructor(driver: IUserDriver);
    signUp(username: string, password: string): Promise<void>;
    logIn(username: string, password: string): Promise<boolean>;
}
