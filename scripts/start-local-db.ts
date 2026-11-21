import EmbeddedPostgres from "embedded-postgres";
import path from "path";

async function run() {
  console.log("Initializing embedded PostgreSQL server...");
  const dataDir = path.resolve(process.cwd(), ".postgres-data");

  const pg = new EmbeddedPostgres({
    port: 5432,
    databaseDir: dataDir,
    user: "postgres",
    password: "postgres",
    persistent: true,
  });

  try {
    await pg.initialise();
    console.log("PostgreSQL initialized.");
  } catch (err: any) {
    console.log("Postgres initialization skipped or already initialized:", err?.message || err);
  }

  await pg.start();
  console.log("PostgreSQL started on localhost:5432.");

  try {
    await pg.createDatabase("oneatlas");
    console.log("Database 'oneatlas' created.");
  } catch (err: any) {
    console.log("Database 'oneatlas' might already exist:", err?.message || err);
  }

  console.log("PostgreSQL is ready and running for OneAtlas!");
  
  // Keep process alive if run as daemon
  setInterval(() => {}, 1000 * 60);
}

run().catch((err) => {
  console.error("Failed to run embedded PostgreSQL:", err);
  process.exit(1);
});
