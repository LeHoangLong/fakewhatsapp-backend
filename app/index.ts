// lib/app.ts
import express = require('express');
import { myContainer } from './inversify.config';
import { JwtAuthentication } from './middleware/JwtAuthentication';
import { router as UserRouter } from './router/UserRouter';
import { router as InvitationRouter } from './router/InvitationRouter';
import { router as ChatRouter } from './router/ChatRouter';
import { TYPES } from './types';
import cookies from 'cookie-parser';
import { generateContext } from './middleware/Context';
import { generatePaginationParams } from './middleware/PaginationParams';
import { UserAuthorization } from './middleware/UserAuthorization';

// Create a new express application instance
const app: express.Application = express();
const jwtAuthentication = myContainer.get<JwtAuthentication>(TYPES.JwtAuthentication);
const userAuthorization: UserAuthorization = myContainer.get<UserAuthorization>(TYPES.UserAuthorization);

app.use(express.json());
app.use(cookies());
app.use(generateContext);
app.use(generatePaginationParams);
app.use((req, res, next) => {
  if (!req.path.match(/^(\/?)user\/(login|signup)(\/?)/)){
    jwtAuthentication.authenticate(req, res, next)
  } else {
    next();
  }
});
//TODO: remove
app.use(async (req, res, next) => {
  //simulate delay for developement
  await new Promise(resolve => setTimeout(resolve, 100));
  next();
});

app.use('/user', UserRouter);
app.use('/invitations', userAuthorization.authorize, InvitationRouter);
app.use('/chats', userAuthorization.authorize, ChatRouter);

app.listen(8000, async function () {
  console.log('Example app listening on port 8000!');
});