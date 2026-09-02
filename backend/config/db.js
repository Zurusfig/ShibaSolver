const { Pool } = require('pg');

const connectDB = async () => {
  try {
    // test connection
    const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
    });

    // Verify the database is reachable, then hand the client straight back.
    // Holding it leaks one connection for the lifetime of the process, and
    // that checked-out client is exempt from the pool's idle timeout -- so
    // it sits open until the provider drops it.
    const client = await pool.connect();
    client.release();

    // A managed Postgres will terminate idle connections on its own schedule
    // (Neon suspends a compute after a few minutes of inactivity). Without a
    // listener here, pg re-emits that as an unhandled 'error' event and the
    // whole process exits. Log it instead and let the pool open a fresh
    // connection on the next query.
    pool.on('error', (err) => {
      console.error('PostgreSQL idle client error (pool will reconnect):', err.message);
    });

    console.log('PostgreSQL connected successfully');
    return pool;
  } catch (err) {
    console.error('PostgreSQL connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
