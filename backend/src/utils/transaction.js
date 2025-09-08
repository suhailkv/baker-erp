// src/utils/transaction.js
const db = require('../models');

/**
 * Runs a callback inside a Sequelize managed transaction.
 * - Automatically commits if successful
 * - Rolls back on error
 *
 * Usage:
 *   const result = await withTransaction(async (t) => {
 *     // do your queries with { transaction: t }
 *     return something;
 *   });
 *
 * @param {Function} callback - async function receiving the transaction
 * @returns {Promise<any>}
 */
async function withTransaction(callback) {
  const t = await db.sequelize.transaction();
  try {
    const result = await callback(t);
    await t.commit();
    return result;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

module.exports = { withTransaction };
