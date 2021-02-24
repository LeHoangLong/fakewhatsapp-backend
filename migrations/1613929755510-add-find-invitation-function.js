'use strict'
const pg = require('pg');
const config = require('../config.json');

module.exports.up = async function (next) {
  const pool = new pg.Pool(config.postgres);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`
      CREATE OR REPLACE FUNCTION public.findinvitation(username1 text, username2 text)
        RETURNS table (createdTime TIMESTAMPTZ, senderInfoId integer, recipientInfoId integer)
        LANGUAGE plpgsql
        AS $function$
          begin
            drop table if exists findInvitationResult;
            create temp table findInvitationResult as select si.createdTime, si.senderUsername, si.recipientUsername from "SentInvitation" si
              where (senderusername=username1 and recipientusername =username2) or (senderusername=username2 and recipientusername=username1)
              limit 1;
            select infoId into senderInfoId from "User" where username in (select senderUsername from findInvitationResult);
            select infoId into recipientInfoId from "User" where username in (select recipientUsername from findInvitationResult);
            return query select (select findInvitationResult.createdTime from findInvitationResult), senderInfoId, recipientInfoId;
          END;
        $function$;
    `);
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
