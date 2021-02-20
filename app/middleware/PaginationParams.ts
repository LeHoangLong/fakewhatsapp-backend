import express from 'express';
import config from '../../config.json';

export function generatePaginationParams(request: express.Request, response: express.Response, next: express.NextFunction) {
    if ('limit' in request.query) {
        let limit = parseInt(request.query.limit as string);
        if (limit < 0) {
            return response.status(400).send();
        }
        if (limit > config.pagination.maxSize) {
            limit = config.pagination.maxSize;
        }
        request.context.paginationSize = limit;
    }
    if ('offset' in request.query) {
        let offset = parseInt(request.query.offset as string);
        if (offset < 0) {
            return response.status(400).send();
        }
        request.context.paginationOffset = offset;
    }
    if ('getCount' in request.query) {
        if (request.query.getCount === 'true') {
            request.context.getCount = true;
        } else {
            request.context.getCount = false;
        }
    }
    next();
}