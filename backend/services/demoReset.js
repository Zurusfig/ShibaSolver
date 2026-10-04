const fs = require("fs");
const path = require("path");

const SQL_DIR = path.join(__dirname, "..", "SQL_command");

// 04:00 in Bangkok (UTC+7, no DST) is 21:00 UTC.
const RESET_HOUR_UTC = 21;

async function resetDemoData(pool) {
  const resetSql = fs.readFileSync(path.join(SQL_DIR, "reset_demo.sql"), "utf8");
  const seedSql = fs.readFileSync(path.join(SQL_DIR, "seed.sql"), "utf8");

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(resetSql);
    await client.query(seedSql);
    await client.query("COMMIT");
    console.log("Demo data reset");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

function msUntilNextReset(now = new Date()) {
  const next = new Date(now);
  next.setUTCHours(RESET_HOUR_UTC, 0, 0, 0);
  if (next <= now) next.setUTCDate(next.getUTCDate() + 1);
  return next - now;
}

// Wipes and reseeds once a day. Only runs when DEMO_RESET=true, so a local
// or shared database is never cleared by accident.
function scheduleDemoReset(pool) {
  if (process.env.DEMO_RESET !== "true") return;

  const run = async () => {
    try {
      await resetDemoData(pool);
    } catch (err) {
      console.error("Demo data reset failed:", err.message);
    }
    setTimeout(run, msUntilNextReset());
  };

  setTimeout(run, msUntilNextReset());
  console.log(`Demo data reset scheduled in ${Math.round(msUntilNextReset() / 60000)} min`);
}

module.exports = {
  resetDemoData,
  scheduleDemoReset,
};
