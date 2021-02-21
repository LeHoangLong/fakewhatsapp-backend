'use strict';
const pg = require('pg');
const config = require('../config.json');

module.exports.up = async function (next) {
  const pool = new pg.Pool(config.postgres);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('CREATE TABLE IF NOT EXISTS "UserInfo" (\
      id SERIAL PRIMARY KEY,\
      username TEXT DEFAULT NULL,\
      name TEXT NOT NULL\
    )');

    await client.query('CREATE TABLE IF NOT EXISTS "User" (\
      username TEXT PRIMARY KEY,\
      password TEXT NOT NULL,\
      infoId INTEGER REFERENCES "UserInfo"(id) UNIQUE\
    )');

    await client.query('ALTER TABLE "UserInfo"\
      ADD CONSTRAINT UserInfo_User_fk FOREIGN KEY (username) REFERENCES "User"(username) ON DELETE SET NULL\
    ');

    await client.query('CREATE TABLE "User_Friends" (\
      username TEXT REFERENCES "User" (username) ON DELETE CASCADE ON UPDATE CASCADE,\
      friendUsername TEXT REFERENCES "User" (username) ON DELETE CASCADE ON UPDATE CASCADE,\
      PRIMARY KEY (username, friendUsername)\
    )');

    await client.query('CREATE TABLE "SentInvitation" (\
      senderUsername TEXT REFERENCES "User"(username) ON DELETE CASCADE,\
      recipientUsername TEXT REFERENCES "User"(username) ON DELETE CASCADE\
    )');
    
    await client.query('CREATE TABLE "ReceivedInvitation" (\
      senderUsername TEXT REFERENCES "User"(username) ON DELETE CASCADE,\
      recipientUsername TEXT REFERENCES "User"(username) ON DELETE CASCADE\
    )');

    await client.query('CREATE TABLE "Chat" (\
      id SERIAL PRIMARY KEY,\
      latestMessageId INTEGER\
    )');

    await client.query('CREATE TABLE "Message" (\
      id SERIAL PRIMARY KEY,\
      content TEXT NOT NULL,\
      chatId INTEGER REFERENCES "Chat"(id) ON DELETE CASCADE\
    )')

    await client.query('ALTER TABLE "Chat"\
      ADD CONSTRAINT Chat_latestMessageId_fk FOREIGN KEY (latestMessageId) REFERENCES "Message"(id)\
    ');

    await client.query('CREATE TABLE "User_Chat" (\
      userInfoId INTEGER REFERENCES "User"(infoId) ON DELETE CASCADE ON UPDATE CASCADE,\
      chatID INTEGER REFERENCES "Chat"(id) ON DELETE CASCADE ON UPDATE CASCADE,\
      username TEXT REFERENCES "User"(username) ON DELETE CASCADE ON UPDATE CASCADE,\
      joinedTime TIMESTAMP DEFAULT NOW(),\
      PRIMARY KEY (userInfoId, chatId, username)\
    )')

    await client.query('CREATE INDEX on "User_Chat"(chatId)');

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release()
  }
}

module.exports.down = async function (next) {
  const client = new pg.Client(config.postgres);
  await client.connect();
  await client.query('DROP TABLE IF EXISTS "User"');
}
