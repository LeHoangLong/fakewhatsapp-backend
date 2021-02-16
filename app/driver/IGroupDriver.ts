import { User } from '../model/User';

interface IGroupDriver {
    getUsers() : User[];
    addUser(user: User): void;
    save(): void;
}