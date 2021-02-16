'use strict';
const pg = require('pg');
const config = require('../config.json');

module.exports.up = async function (next) {
  const client = new pg.Client(config.postgres);
  await client.connect();
  await client.query('CREATE TABLE IF NOT EXISTS "user" (\
    username TEXT PRIMARY KEY,\
    password TEXT NOT NULL\
  )');
}

module.exports.down = function (next) {
  const client = new pg.Client(config.postgres);
  await client.connect();
  await client.query('DROP TABLE IF EXISTS "user"');
  next()
}
