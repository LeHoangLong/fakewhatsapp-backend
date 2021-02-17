"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IUserDriverErrorNoSuchUsername = exports.IUserDriverErrorMissingRequiredParameter = exports.IUserDriverErrorUsernameAlreadyExistsWhenCreateInstance = void 0;
var IUserDriverErrorUsernameAlreadyExistsWhenCreateInstance = /** @class */ (function () {
    function IUserDriverErrorUsernameAlreadyExistsWhenCreateInstance(username) {
        this.username = username;
    }
    IUserDriverErrorUsernameAlreadyExistsWhenCreateInstance.prototype.toString = function () {
        console.log('to string');
        return "Username " + this.username + " already exists";
    };
    return IUserDriverErrorUsernameAlreadyExistsWhenCreateInstance;
}());
exports.IUserDriverErrorUsernameAlreadyExistsWhenCreateInstance = IUserDriverErrorUsernameAlreadyExistsWhenCreateInstance;
//throw by function if a required parameter is not set when called
var IUserDriverErrorMissingRequiredParameter = /** @class */ (function () {
    function IUserDriverErrorMissingRequiredParameter(parameter) {
        this.parameter = parameter;
    }
    IUserDriverErrorMissingRequiredParameter.prototype.toString = function () {
        return "Missing required parameter " + this.parameter + " when create instance";
    };
    return IUserDriverErrorMissingRequiredParameter;
}());
exports.IUserDriverErrorMissingRequiredParameter = IUserDriverErrorMissingRequiredParameter;
var IUserDriverErrorNoSuchUsername = /** @class */ (function () {
    function IUserDriverErrorNoSuchUsername(userId) {
        this.username = userId;
    }
    IUserDriverErrorNoSuchUsername.prototype.toString = function () {
        return "User with id " + this.username + " not found";
    };
    return IUserDriverErrorNoSuchUsername;
}());
exports.IUserDriverErrorNoSuchUsername = IUserDriverErrorNoSuchUsername;
