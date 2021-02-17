"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateContext = void 0;
var Context = /** @class */ (function () {
    function Context() {
    }
    return Context;
}());
//must be at the front of middleware chain
function generateContext(request, response, next) {
    request.context = new Context();
    next();
}
exports.generateContext = generateContext;
