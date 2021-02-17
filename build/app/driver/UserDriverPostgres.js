"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDriverPostgres = void 0;
var IUserDriver_1 = require("./IUserDriver");
var inversify_1 = require("inversify");
var types_1 = require("../types");
var bcrypt = require('bcrypt');
require("reflect-metadata");
var UserDriverPostgres = /** @class */ (function () {
    function UserDriverPostgres(pool) {
        this.pool = pool;
    }
    UserDriverPostgres.prototype.createUser = function (username, password) {
        return __awaiter(this, void 0, void 0, function () {
            var hashedPassword;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('username: ' + username);
                        return [4 /*yield*/, bcrypt.hash(password, 10)];
                    case 1:
                        hashedPassword = _a.sent();
                        return [4 /*yield*/, this.doesUsernameExists(username)];
                    case 2:
                        if (_a.sent()) {
                            console.log("does exists");
                            throw new IUserDriver_1.IUserDriverErrorUsernameAlreadyExistsWhenCreateInstance(username);
                        }
                        console.log("username 2: " + username);
                        return [4 /*yield*/, this.pool.query('INSERT INTO "user" (username, password) VALUES ($1, $2)', [username, hashedPassword])];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UserDriverPostgres.prototype.checkPassword = function (username, password) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.doesUsernameExists(username)];
                    case 1:
                        if (!(_a.sent())) {
                            throw new IUserDriver_1.IUserDriverErrorNoSuchUsername(username);
                        }
                        return [4 /*yield*/, this.pool.query("SELECT password FROM user WHERE username=$1", [username])];
                    case 2:
                        result = _a.sent();
                        if (result.rowCount == 0) {
                            return [2 /*return*/, false];
                        }
                        else {
                            return [2 /*return*/, bcrypt.compare(password, result.rows[0].password)];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    UserDriverPostgres.prototype.changePassword = function (username, password) {
        return __awaiter(this, void 0, void 0, function () {
            var hashedPassword;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.doesUsernameExists(username)];
                    case 1:
                        if (!(_a.sent())) {
                            throw new IUserDriver_1.IUserDriverErrorNoSuchUsername(username);
                        }
                        return [4 /*yield*/, bcrypt.hash(password, 10)];
                    case 2:
                        hashedPassword = _a.sent();
                        return [4 /*yield*/, this.pool.query("UPDATE user SET password=$1 where username=$2", [hashedPassword, username])];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UserDriverPostgres.prototype.addGroup = function (group) {
    };
    UserDriverPostgres.prototype.doesUsernameExists = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pool.query('SELECT COUNT(*) FROM "user" WHERE username=$1', [username])];
                    case 1:
                        result = _a.sent();
                        console.log(parseInt(result.rows[0].count) > 0);
                        if (parseInt(result.rows[0].count) > 0) {
                            return [2 /*return*/, true];
                        }
                        else {
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    UserDriverPostgres = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(types_1.TYPES.UserDatabaseClientPool))
    ], UserDriverPostgres);
    return UserDriverPostgres;
}());
exports.UserDriverPostgres = UserDriverPostgres;
