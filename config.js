"use strict";

/** Shared config for application; can be required many places. */

require("dotenv").config();
require("colors");

const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";

const PORT = +process.env.PORT || 3001;

// Use dev database, testing database, or via env var, production database
function getDatabaseUri() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const dbName = process.env.NODE_ENV === "test" ? "jobly_test" : "jobly";
  const host = process.env.DB_HOST || "localhost";
  const port = process.env.DB_PORT || 5432;
  const user = process.env.DB_USER || "gene";
  const password = process.env.DB_PASSWORD || "DB_PASSWORD";

  if (!host || !port) {
    throw new Error(
      "DB_HOST, DB_PORT, DB_USER, and DB_PASSWORD environment variables are required"
    );
  }

  return `postgres://${user}:${password}@${host}:${port}/${dbName}`;
}

// Speed up bcrypt during tests, since the algorithm safety isn't being tested
//
// WJB: Evaluate in 2021 if this should be increased to 13 for non-test use
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

console.log("Jobly Config:".green);
console.log("SECRET_KEY:".yellow, SECRET_KEY);
console.log("PORT:".yellow, PORT.toString());
console.log("BCRYPT_WORK_FACTOR".yellow, BCRYPT_WORK_FACTOR);
console.log("Database:".yellow, getDatabaseUri());
console.log("---");

module.exports = {
  SECRET_KEY,
  PORT,
  BCRYPT_WORK_FACTOR,
  getDatabaseUri,
};
