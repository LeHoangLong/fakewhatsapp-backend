'use strict'
const pg = require('pg');
const config = require('../config.json');

module.exports.up = async function (next) {
  const pool = new pg.Pool(config.postgres);
  const client = await pool.connect();
  try {
    client.query('BEGIN');
    client.query(`
      CREATE OR REPLACE function public.createinvitation(iSenderUsername text, iRecipientUsername text, out createdtime TIMESTAMPTZ, out senderInfoId integer, out recipientInfoId integer)
        LANGUAGE plpgsql
        AS $function$
        begin
          if (select count(*) from "SentInvitation" where senderusername=iSenderUsername and recipientusername=iRecipientUsername) = 0 then	
              insert into "SentInvitation" as si (senderusername, recipientusername) values (iSenderUsername, iRecipientUsername) returning si.createdtime into createdtime;	
          end if;
          if (select count(*) from "ReceivedInvitation" ri where senderusername=iSenderUsername and recipientusername=iRecipientUsername) = 0 then	
            insert into "ReceivedInvitation" (senderusername, recipientusername) values (iSenderUsername, iRecipientUsername);
          end if;
          
          select infoId into senderInfoId from "User" where username=iSenderUsername;
          select infoId into recipientInfoId from "User" where username=iRecipientUsername;
          
          END;
        $function$;
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
