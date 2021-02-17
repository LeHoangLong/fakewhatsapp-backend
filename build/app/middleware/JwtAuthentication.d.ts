import express from 'express';
export declare class JwtAuthentication {
    readonly secretKey: string;
    readonly durationS: number;
    constructor(secretKey: string, durationS: number);
    generateToken(username: string): string;
    authenticate(request: express.Request, response: express.Response, next: express.NextFunction): void;
}
