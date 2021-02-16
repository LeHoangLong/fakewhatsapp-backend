// lib/app.ts
import express = require('express');
import pg = require('pg');
import config from '../config.json';
import { router as UserRouter } from './router/UserRouter';

// Create a new express application instance
const app: express.Application = express();
app.use(express.json());
const client: pg.Client = new pg.Client(config.postgres);

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.use('/user', UserRouter);

app.listen(8000, async function () {
  console.log('Example app listening on port 8000!');
});