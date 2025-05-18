const { sequelize } = require('../models');

async function withTransaction(callback) {
  const t = await sequelize.transaction();
  try {
    const result = await callback(t);
    await t.commit();
    return result;
  } catch (error) {
    await t.rollback();
    throw error;
  }
}

module.exports = withTransaction;
