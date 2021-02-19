// lib/app.ts
import express = require('express');
import { myContainer } from './inversify.config';
import { JwtAuthentication } from './middleware/JwtAuthentication';
import { router as UserRouter } from './router/UserRouter';
import { TYPES } from './types';
import cookies from 'cookie-parser';
import { generateContext } from './middleware/Context';

// Create a new express application instance
const app: express.Application = express();
const jwtAuthentication = myContainer.get<JwtAuthentication>(TYPES.JwtAuthentication);

app.use(express.json());
app.use(cookies());
app.use(generateContext);
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
  await new Promise(resolve => setTimeout(resolve, 1000));
  next();
});
app.use('/user', UserRouter);

app.listen(8000, async function () {
  console.log('Example app listening on port 8000!');
});