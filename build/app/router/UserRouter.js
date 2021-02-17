"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var express_1 = __importDefault(require("express"));
var inversify_config_1 = require("../inversify.config");
var types_1 = require("../types");
exports.router = express_1.default.Router();
exports.router.post('/login', function (req, res) {
    inversify_config_1.myContainer.get(types_1.TYPES.UserView).loginView(req, res);
});
exports.router.post('/signup', function (req, res) {
    inversify_config_1.myContainer.get(types_1.TYPES.UserView).signUpView(req, res);
});
