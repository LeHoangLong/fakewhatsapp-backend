'use strict';
const pg = require('pg');
const config = require('../config.json');

module.exports.up = async function (next) {
  const pool = new pg.Pool(config.postgres);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`
      ALTER TABLE "Message" 
      ADD sentTime TIMESTAMPTZ DEFAULT NOW(), 
      ADD senderInfoId INTEGER REFERENCES "UserInfo"(id) ON DELETE CASCADE ON UPDATE CASCADE
    `)
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports.down = function (next) {
  next()
}
