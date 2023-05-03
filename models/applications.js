"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { BadRequestError, NotFoundError } = require("../expressError");

class Application {
  /**
   * Apply to a job.
   *
   * @param {string} username - The username of the user applying for the job.
   * @param {number} jobId - The ID of the job to apply for.
   * @returns {Promise<{ username, jobId }>} - The application object.
   * @throws {NotFoundError} - If the job or user is not found.
   */

  static async apply(username, jobId) {
    //check if the job exists
    const jobCheck = await db.query(`SELECT id FROM jobs WHERE id =$1`, [
      jobId,
    ]);

    if (!jobCheck.rows[0]) throw new NotFoundError(`No job: ${jobId}`);

    //check if user exists
    const userCheck = await db.query(
      `SELECT username FROM users WHERE username = $1`,
      [username]
    );

    if (!userCheck.rows[0]) throw new NotFoundError(`No user: ${username}`);

    // Check if the application already exists
    const appCheck = await db.query(
      `SELECT username, job_id FROM applications WHERE username = $1 AND job_id = $2`,
      [username, jobId]
    );

    if (appCheck.rows[0])
      throw new BadRequestError(
        `Application already exists: ${username}, ${jobId}`
      );

    //create the applicaton
    await db.query(
      `INSERT INTO applications (username, job_id)
            VALUES ($1, $2)`,
      [username, jobId]
    );

    return { username, jobId };
  }

  /**
   * Get all applications for a user.
   *
   * @param {string} username - The username of the user.
   * @returns {Promise<Array<{ jobId, title, companyName }>>} - A list of applied jobs.
   * @throws {NotFoundError} - If the user is not found.
   */
  static async getUserApplications(username) {
    //check if user exists
    const userCheck = await db.query(
      `SELECT username FROM users WHERE username = $1`,
      [username]
    );

    if (!userCheck.rows[0]) throw new NotFoundError(`No user: ${username}`);

    //Get the user's applications
    const result = await db.query(
      `SELECT j.id AS "jobId", j.title, c.name AS "companyName" 
            FROM applications AS a
                JOIN jobs AS j ON a.job_id = j.id
                JOIN companies AS c ON j.company_handle = c.handle
                WHERE a.username = $1`,
      [username]
    );

    return result.rows;
  }
}

module.exports = Application;
