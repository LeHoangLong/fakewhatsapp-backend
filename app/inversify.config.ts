import { Container } from "inversify";
import { TYPES } from "./types";
import { IUserDriver } from './driver/IUserDriver';
import { UserDriverPostgres } from './driver/UserDriverPostgres';
import { UserController } from './controller/UserController';
import { Pool } from 'pg';
import config from '../config.json';
import { UserView } from './view/UserView';
import "reflect-metadata";

export const myContainer = new Container();
myContainer.bind<IUserDriver>(TYPES.UserDriver).to(UserDriverPostgres).inSingletonScope();
myContainer.bind<UserController>(TYPES.UserController).to(UserController).inSingletonScope();
myContainer.bind<Pool>(TYPES.UserDatabaseClientPool).toConstantValue(new Pool(config.postgres));
myContainer.bind<UserView>(TYPES.UserView).to(UserView).inSingletonScope();
