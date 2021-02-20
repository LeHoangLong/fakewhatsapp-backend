import { 
    IUserDriver, 
    IUserDriverErrorUsernameAlreadyExistsWhenCreateInstance,
    IUserDriverErrorNoSuchUsername,
    IUserDriverErrorNoSuchInfoId,
    IUserDriverErrorUserDeleted,
    IUserDriverErrorNoSuchInvitation
} from './IUserDriver';
import { Group } from '../controller/Group';
import { Pool } from 'pg';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
const bcrypt = require('bcrypt');
import "reflect-metadata";
import { User } from '../model/User';
import { Invitation } from '../model/Invitation';

@injectable()
export class UserDriverPostgres implements IUserDriver {
    private pool: Pool;
    
    constructor(
        @inject(TYPES.UserDatabaseClientPool) pool: Pool,
    ) {
        this.pool = pool;
    }

    
    async createUser(username: string, password: string): Promise<void> {
        console.log("create User");
        try {
            let hashedPassword: string = await bcrypt.hash(password, 10);
            await this.pool.query('CALL createnewuser($1, $2)', [username, hashedPassword]);
            console.log("created successfully");
        } catch (err) {
            if (err.message === 'USERNAME_ALREADY_EXISTS') {
                throw new IUserDriverErrorUsernameAlreadyExistsWhenCreateInstance(username);
            } else {
                throw err;
            }
        }
    }


    async isPasswordCorrect(username: string, password: string): Promise<boolean> {
        if (!await this.doesUsernameExists(username)) {
            throw new IUserDriverErrorNoSuchUsername(username);
        }
        let result = await this.pool.query('SELECT password FROM "User" WHERE username=$1', [username]);
        if (result.rowCount == 0) {
            return false;
        } else {
            return bcrypt.compare(password, result.rows[0].password);
        }
    }

    async changePassword(username: string, password: string): Promise<void> {
        if (!await this.doesUsernameExists(username)) {
            throw new IUserDriverErrorNoSuchUsername(username);
        }
        let hashedPassword: string = await bcrypt.hash(password, 10);
        await this.pool.query('UPDATE "User" SET password=$1 where username=$2', [hashedPassword, username]);
    }  

    addGroup(group: Group): void {

    }

    async doesUsernameExists(username: string): Promise<boolean> {
        var result = await this.pool.query('SELECT COUNT(*) FROM "User" WHERE username=$1', [username]);
        if (parseInt(result.rows[0].count) > 0) {
            return true;
        } else {
            return false;
        }
    }

    async fetchUser(username: string): Promise<User> {
        var result = await this.pool.query('SELECT id, name from "UserInfo" where "UserInfo".id in (SELECT infoId FROM "User" where username=$1)', [username]);
        if (result.rowCount > 0) {
            let userData = result.rows[0];
            return new User(userData.id, userData.name);
        } else {
            throw new IUserDriverErrorNoSuchUsername(username);
        }
    }

    async findUserByName(name: string, numberOfResults: number, offset: number): Promise<User[]> {
        var results = await this.pool.query('SELECT id, name FROM "UserInfo" where name LIKE $1 ORDER BY name LIMIT $2 OFFSET $3', ['%' + name + '%', numberOfResults, offset]);
        let users: User[] = [];
        for (let i = 0; i < results.rowCount; i++) {
            users.push(new User(results.rows[i].id, results.rows[i].name));
        }
        return users;
    }

    async fetchNumberOfFriends(username: string): Promise<number> {
        var results = await this.pool.query('SELECT COUNT(*) FROM "UserInfo" where id in (SELECT infoId FROM "User" where username in (SELECT friendUsername from "User_Friends" where username=$1))', [username]);
        return results.rows[0].count;     
    }

    async fetchFriends(username: string, numberOfResults: number, offset: number): Promise<User[]> {
        var results = await this.pool.query('SELECT id, name FROM "UserInfo" where id in (SELECT infoId FROM "User" where username in (SELECT friendUsername from "User_Friends" where username=$1)) LIMIT $2 OFFSET $3', [username, numberOfResults, offset]);
        let users: User[] = [];
        for (let i = 0; i < results.rowCount; i++) {
            let userData = results.rows[i];
            users.push(new User(userData.id, userData.name));
        }
        return users;
    }

    async sendFriendRequestIfNotYet(senderUsername: string, recipientUsername: string): Promise<Invitation> {
        await this.pool.query('CALL createinvitation($1, $2)', [senderUsername, recipientUsername]);
        //if success, then return an invitation object
        return new Invitation(senderUsername, recipientUsername);
    }
    
    async fetchUsernameFromInfoId(infoId: number): Promise<string> {
        let result = await this.pool.query('SELECT username from "UserInfo" where id=$1', [infoId]);
        if (result.rowCount == 0) {
            throw new IUserDriverErrorNoSuchInfoId(infoId);
        } else {
            if (!result.rows[0].username) {
                throw new IUserDriverErrorUserDeleted(infoId);
            } else {
                return result.rows[0].username;
            }
        }
    }
    
    async acceptFriendRequest(senderUsername: string, recipientUsername: string): Promise<void> {
        try {
            this.pool.query('CALL acceptinvitation($1, $2)', [senderUsername, recipientUsername]);
        } catch (error) {
            if (error.message === 'NO_SUCH_INVITATION') {
                throw new IUserDriverErrorNoSuchInvitation(senderUsername, recipientUsername);
            } else {
                throw error;
            }
        }
    }
}
