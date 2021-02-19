import { 
    IUserDriver, 
    IUserDriverErrorUsernameAlreadyExistsWhenCreateInstance,
    IUserDriverErrorNoSuchUsername
} from './IUserDriver';
import { Group } from '../controller/Group';
import { Pool } from 'pg';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
const bcrypt = require('bcrypt');
import "reflect-metadata";
import { User } from '../model/User';

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
            console.log('userData');
            console.log(userData);
            return new User(userData.id, userData.name);
        } else {
            throw new IUserDriverErrorNoSuchUsername(username);
        }
    }
}
