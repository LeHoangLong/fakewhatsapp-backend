// lib/app.ts
import express = require('express');
import pg = require('pg');
import config from '../config.json';
import { myContainer } from './inversify.config';
import { JwtAuthentication } from './middleware/JwtAuthentication';
import { router as UserRouter } from './router/UserRouter';
import { TYPES } from './types';
import { UserView } from './view/UserView';

// Create a new express application instance
const app: express.Application = express();
const jwtAuthentication = myContainer.get<JwtAuthentication>(TYPES.JwtAuthentication);

app.use(express.json());
app.use(jwtAuthentication.authenticate);
//TODO: remove
app.use(async (req, res, next) => {
  //simulate delay for developement
  await new Promise(resolve => setTimeout(resolve, 1000));
  next();
});
app.use('/user', UserRouter);

app.listen(8000, async function () {
  console.log('Example app listening on port 8000!');
});