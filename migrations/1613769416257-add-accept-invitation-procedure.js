'use strict'
const pg = require('pg');
const config = require('../config.json');

module.exports.up = async function (next) {
  const pool = new pg.Pool(config.postgres);
  const client = await pool.connect();
  try {
    client.query('BEGIN');
    client.query(`
      CREATE OR REPLACE PROCEDURE public.acceptinvitation(iSenderUsername text, iRecipientUsername text)
      LANGUAGE plpgsql
      AS $procedure$
        begin
          if (select count(*) from "SentInvitation" where senderusername=iSenderUsername and recipientusername=iRecipientUsername) = 0 then
            raise 'NO_SUCH_INVITATION' using detail = 'No invitation from ' || iSenderUsername || ' to ' || iRecipientUsername; 
          else
            delete from "SentInvitation" where senderusername=iSenderUsername and recipientusername=iRecipientUsername;
            delete from "ReceivedInvitation" where senderusername=iSenderUsername and recipientusername=iRecipientUsername;
            insert into "User_Friends" (username, friendusername) values (iSenderUsername, iRecipientUsername);
            insert into "User_Friends" (username, friendusername) values (iRecipientUsername, iSenderUsername);
          end if;
        END;
      $procedure$;
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
