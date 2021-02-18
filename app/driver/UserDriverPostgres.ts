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
        console.log("create user");
        let hashedPassword: string = await bcrypt.hash(password, 10);
        if (await this.doesUsernameExists(username)) {
            console.log("username exitss");
            throw new IUserDriverErrorUsernameAlreadyExistsWhenCreateInstance(username);
        }
        await this.pool.query('INSERT INTO "user" (username, password) VALUES ($1, $2)', [username, hashedPassword])
        console.log("created successfully");
    }


    async isPasswordCorrect(username: string, password: string): Promise<boolean> {
        if (!await this.doesUsernameExists(username)) {
            throw new IUserDriverErrorNoSuchUsername(username);
        }
        let result = await this.pool.query('SELECT password FROM "user" WHERE username=$1', [username]);
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
        await this.pool.query("UPDATE user SET password=$1 where username=$2", [hashedPassword, username]);
    }  

    addGroup(group: Group): void {

    }

    async doesUsernameExists(username: string): Promise<boolean> {
        var result = await this.pool.query('SELECT COUNT(*) FROM "user" WHERE username=$1', [username]);
        if (parseInt(result.rows[0].count) > 0) {
            return true;
        } else {
            return false;
        }
    }

    async fetchUser(username: string): Promise<User> {
        if (await this.doesUsernameExists(username)) {
            return new User(username);
        } else {
            throw new IUserDriverErrorNoSuchUsername(username);
        }
    }
}
