'use strict'
const pg = require('pg');
const config = require('../config.json');

module.exports.up = async function (next) {
  const pool = new pg.Pool(config.postgres);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('ALTER TABLE "SentInvitation" ADD createdTime TIMESTAMPTZ DEFAULT NOW()');
    await client.query('ALTER TABLE "ReceivedInvitation" ADD createdTime TIMESTAMPTZ DEFAULT NOW()');
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
  } finally {
    await client.release();
  }
}

module.exports.down = function (next) {
  next()
}
