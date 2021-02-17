import { IUserDriver } from './IUserDriver';
import { Group } from '../controller/Group';
import { Pool } from 'pg';
import "reflect-metadata";
export declare class UserDriverPostgres implements IUserDriver {
    private pool;
    constructor(pool: Pool);
    createUser(username: string, password: string): Promise<void>;
    checkPassword(username: string, password: string): Promise<boolean>;
    changePassword(username: string, password: string): Promise<void>;
    addGroup(group: Group): void;
    doesUsernameExists(username: string): Promise<boolean>;
}
