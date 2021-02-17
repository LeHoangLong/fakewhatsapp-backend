"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthentication = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var User_1 = require("../model/User");
var JwtAuthentication = /** @class */ (function () {
    function JwtAuthentication(secretKey, durationS) {
        this.secretKey = secretKey;
        this.durationS = durationS;
    }
    JwtAuthentication.prototype.generateToken = function (username) {
        return jsonwebtoken_1.default.sign({ username: username }, this.secretKey, {
            expiresIn: this.durationS
        });
    };
    JwtAuthentication.prototype.authenticate = function (request, response, next) {
        if (request.cookies.jwt != undefined) {
            var payload = jsonwebtoken_1.default.verify(request.cookies.jwt, this.secretKey);
            if ('username' in payload) {
                request.user = new User_1.User(payload.username, '');
            }
            else {
                next();
            }
        }
        else {
            next();
        }
    };
    return JwtAuthentication;
}());
exports.JwtAuthentication = JwtAuthentication;
