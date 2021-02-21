import { inject, injectable } from 'inversify';
import { 
    IUserDriver, 
} from '../driver/IUserDriver';
import { JwtAuthentication } from '../middleware/JwtAuthentication';
import { Invitation } from '../model/Invitation';
import { User } from '../model/User';
// rename exception for clearer readability. Should be thrown by driver layer.
export { 
    IUserDriverErrorNoSuchUsername as UserControllerErrorUsernameNotFound,
    IUserDriverErrorUsernameAlreadyExistsWhenCreateInstance as UserControllerErrorUsernameAlreadyExistsWhenSignUp,
    IUserDriverErrorNoSuchInfoId as UserControllerErrorNoSuchInfoId,
    IUserDriverErrorUserDeleted as UserControllerErrorUserDeleted,
    IUserDriverErrorNoSuchInvitation as UserControllerErrorNoSuchInvitation,
} from '../driver/IUserDriver';
import { TYPES } from '../types';

export class UserControllerErrorAuthentiationFailedWithGivenUsernameAndPassword {
    toString(): string {
        return 'Authentication failed with the given username and password';
    }
}

@injectable()
export class UserController {
    driver: IUserDriver;
    private jwtAuthentication: JwtAuthentication;
    constructor(
        @inject(TYPES.UserDriver) driver: IUserDriver,
        @inject(TYPES.JwtAuthentication) jwtAuthentication: JwtAuthentication,
    ) {
        this.driver = driver;
        this.jwtAuthentication = jwtAuthentication;
    }

    //return jwt token
    async signUp(username: string, password: string): Promise<string> {
        await this.driver.createUser(username, password);
        return this.jwtAuthentication.generateToken(username);
    }

    //return jwt token
    async logIn(username: string, password: string): Promise<string> {
        if (await this.driver.isPasswordCorrect(username, password)) {
            return this.jwtAuthentication.generateToken(username);
        } else {
            throw new UserControllerErrorAuthentiationFailedWithGivenUsernameAndPassword();
        }
    }

    async getUserInfo(username: string): Promise<User> {
        return this.driver.fetchUser(username);
    }

    async findUserByName(name: string, numberOfResults: number, offset: number): Promise<User[]> {
        return this.driver.findUserByName(name, numberOfResults, offset);
    }

    async fetchFriends(username: string, numberOfResults: number, offset: number, getCount: boolean, name?: string): Promise<[User[], number]> {
        let users = await this.driver.fetchFriends(username, numberOfResults, offset, name);
        let count: number = 0;
        if (getCount) {
            count = await this.driver.fetchNumberOfFriends(username);
        }
        return [users, count];
    }

    /*
    async sendFriendRequestIfNotYet(senderUsername: string, recipientInfoId: number): Promise<Invitation>{
        let recipientUsername = await this.driver.fetchUsernameFromInfoId(recipientInfoId);
        return this.driver.sendFriendRequestIfNotYet(senderUsername, recipientUsername);
    }
    */

    async acceptFriendRequest(recipientUsername: string, senderInfoId: number): Promise<void> {
        let senderUsername = await this.driver.fetchUsernameFromInfoId(senderInfoId);
        return this.driver.acceptFriendRequest(senderUsername, recipientUsername);
    }
}