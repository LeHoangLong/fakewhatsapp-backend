'use strict'
const pg = require('pg');
const config = require('../config.json');

module.exports.up = async function (next) {
  
  const pool = new pg.Pool(config.postgres);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    client.query(`
      CREATE OR REPLACE PROCEDURE public.createnewuser(_username text, _password text)
      LANGUAGE plpgsql
      AS $procedure$
        declare 
          infoId integer;
          usernameCount integer;
        begin
          select count(*) into usernameCount from "User" where username=_username;
          if usernameCount = 0 then
            insert into "UserInfo" (name) values (_username) returning id into infoId;
            insert into "User" (username, password, infoId) values (_username, _password, infoId);
            update "UserInfo" set username=_username where "id"=infoId;
          else
            raise exception 'USERNAME_ALREADY_EXISTS' using detail = 'Username already exists';
          end if;
        END;
      $procedure$;`
    );
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLL BACK');
  } finally {
    await client.release();
  }
}

module.exports.down = function (next) {
  next()
}
