const { PoolClient } = require('pg');


const tx = async (callback, pool) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN')
    try {
      await callback(client)
      await client.query('COMMIT')
    } catch (e) {
      await client.query('ROLLBACK')
    }
  } finally {
    client.release()
  }
}
module.exports = tx;