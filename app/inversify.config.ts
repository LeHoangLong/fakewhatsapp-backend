import { Container } from "inversify";
import { TYPES } from "./types";
import { IUserDriver } from './driver/IUserDriver';
import { UserDriverPostgres } from './driver/UserDriverPostgres';
import { UserController } from './controller/UserController';
import { Pool } from 'pg';
import config from '../config.json';
import { UserView } from './view/UserView';
import "reflect-metadata";
import { JwtAuthentication } from './middleware/JwtAuthentication';
import { UserAuthorization } from "./middleware/UserAuthorization";
import { InvitationDriverPostgres } from "./driver/InvitationDriverPostgres";
import { InvitationController } from "./controller/InvitationController";
import { InvitationView } from "./view/InvitationView";
import { ChatDriverPostgres } from "./driver/ChatDriverPostgres";
import { ChatController } from "./controller/ChatController";
import { ChatView } from "./view/ChatView";

export const myContainer = new Container();
myContainer.bind<IUserDriver>(TYPES.UserDriver).to(UserDriverPostgres).inSingletonScope();
myContainer.bind<UserController>(TYPES.UserController).to(UserController).inSingletonScope();
myContainer.bind<Pool>(TYPES.UserDatabaseClientPool).toConstantValue(new Pool(config.postgres));
myContainer.bind<UserView>(TYPES.UserView).to(UserView).inSingletonScope();
myContainer.bind<string>(TYPES.JwtSecretKey).toConstantValue("VHOL0kMJmIbsZyRPGPyQt8+gYye4rmMDQdgxkJpnVPYXVMUKWLiOpfELO0oCAz2Pz7J5/9gyz9DE6X+2C5iJK/ZBHth/EUEjC7iXfrImgu2coC3r9BnqybQPQq7TkygW5t+JUwjXqnPEsOK+buujyMhKi5pvZswJLkJv7MYwdxNR8GkLBudfz71zs/EbbF4+NRNQQ2VRc6VGwXrcnUwZ82xHeMOojgtRZBwoN4WVid9HMP4D54x61ayCEKQvUEmsCNc/Xq0NB6j1KkFAPzzOM143COglHjEY+taeWe+ZrT6EChgUYrn9KgOhxTDLv0F5QeQ74IzHzWSu9/KjXCLbAQ==");
myContainer.bind<number>(TYPES.JwtDuration).toConstantValue(24 * 3600 * 5);
myContainer.bind<JwtAuthentication>(TYPES.JwtAuthentication).to(JwtAuthentication).inSingletonScope();
myContainer.bind<UserAuthorization>(TYPES.UserAuthorization).to(UserAuthorization).inSingletonScope();
myContainer.bind<InvitationDriverPostgres>(TYPES.InvitationDriver).to(InvitationDriverPostgres);
myContainer.bind<InvitationController>(TYPES.InvitationController).to(InvitationController);
myContainer.bind<InvitationView>(TYPES.InvitationView).to(InvitationView);
myContainer.bind<ChatDriverPostgres>(TYPES.ChatDriver).to(ChatDriverPostgres);
myContainer.bind<ChatController>(TYPES.ChatController).to(ChatController);
myContainer.bind<ChatView>(TYPES.ChatView).to(ChatView);

