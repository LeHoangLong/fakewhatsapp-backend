"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.myContainer = void 0;
var inversify_1 = require("inversify");
var types_1 = require("./types");
var UserDriverPostgres_1 = require("./driver/UserDriverPostgres");
var UserController_1 = require("./controller/UserController");
var pg_1 = require("pg");
var config_json_1 = __importDefault(require("../config.json"));
var UserView_1 = require("./view/UserView");
require("reflect-metadata");
exports.myContainer = new inversify_1.Container();
exports.myContainer.bind(types_1.TYPES.UserDriver).to(UserDriverPostgres_1.UserDriverPostgres).inSingletonScope();
exports.myContainer.bind(types_1.TYPES.UserController).to(UserController_1.UserController).inSingletonScope();
exports.myContainer.bind(types_1.TYPES.UserDatabaseClientPool).toConstantValue(new pg_1.Pool(config_json_1.default.postgres));
exports.myContainer.bind(types_1.TYPES.UserView).to(UserView_1.UserView).inSingletonScope();
