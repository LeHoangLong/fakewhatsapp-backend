'use strict'
const pg = require('pg');
const config = require('../config.json');

module.exports.up = async function (next) {
  const pool = new pg.Pool(config.postgres);
  const client = await pool.connect();
  try {
    client.query('BEGIN');
    client.query(`
      CREATE OR REPLACE PROCEDURE public.createinvitation(iSenderUsername text, iRecipientUsername text)
      LANGUAGE plpgsql
      AS $procedure$
        begin
          if (select count(*) from "SentInvitation" where senderusername=iSenderUsername and recipientusername=iRecipientUsername) > 0 then	
            insert into "SentInvitation" (senderusername, recipientusername) values (iSenderUsername, iRecipientUsername);	
          end if;
          if (select count(*) from "PendingInvitation" where senderusername=iSenderUsername and recipientusername=iRecipientUsername) > 0 then	
            insert into "PendingInvitation" (senderusername, recipientusername) values (iSenderUsername, iRecipientUsername);
          end if;
        END;
      $procedure$;
    `);
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
  } finally {
    client.release();
  }
}

module.exports.down = function (next) {
  next()
}
