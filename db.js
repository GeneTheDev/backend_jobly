"use strict";

/** Database setup for jobly. */
const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

function getConnectionUri() {
  const databaseUri = getDatabaseUri();
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;

  if (!user || !password) {
    throw new Error(
      "DB_USER and DB_PASSWORD environment variables are required"
    );
  }

  return `postgresql://${user}:${password}@${databaseUri}`;
}

let db;

async function connect() {
  if (!db) {
    db = new Client({
      connectionString: getConnectionUri(),
    });

    try {
      await db.connect();
      console.log("Database connected successfully!");
    } catch (error) {
      console.error("Error connecting to the database:", error.message);
      throw error;
    }
  }
}

connect();

async function query(text, params) {
  await connect();
  return db.query(text, params);
}

module.exports = {
  query,
};
