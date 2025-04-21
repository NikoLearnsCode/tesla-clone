const Database = require('better-sqlite3');
const db = new Database('cars.db');

// -----------------------------------------------------------------------------
// För att skapa databasen, gå till mappen 'db' och kör 'node dbSetup' följt av 'node migrateData' i terminalen
// -----------------------------------------------------------------------------

db.exec(`
  CREATE TABLE IF NOT EXISTS cars (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    model TEXT,
    specs TEXT,
    autopilotPackages TEXT,
    traction TEXT,
    wheels TEXT
  );
`);

console.log('Tabellen cars har skapats eller finns redan.');
