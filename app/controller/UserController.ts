import { inject, injectable } from 'inversify';
import { 
    IUserDriver, 
    IUserDriverErrorNoSuchUsername, 
    IUserDriverErrorUsernameAlreadyExistsWhenCreateInstance,
} from '../driver/IUserDriver';
// rename exception for clearer readability. Should be thrown by driver layer.
export { 
    IUserDriverErrorNoSuchUsername as UserControllerErrorUsernameNotFound,
    IUserDriverErrorUsernameAlreadyExistsWhenCreateInstance as UserControllerErrorUsernameAlreadyExistsWhenSignUp,
} from '../driver/IUserDriver';
import { TYPES } from '../types';


@injectable()
export class UserController {
    driver: IUserDriver;
    constructor(
        @inject(TYPES.UserDriver) driver: IUserDriver
    ) {
        this.driver = driver;
    }

    async signUp(username: string, password: string): Promise<void> {
        await this.driver.createUser(username, password);
    }

    async logIn(username: string, password: string): Promise<boolean> {
        return this.driver.checkPassword(username, password);
    }
}