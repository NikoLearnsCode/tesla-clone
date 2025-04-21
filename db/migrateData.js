const Database = require('better-sqlite3');
const db = new Database('cars.db');

// -----------------------------------------------------------------------------
// För att skapa databasen, gå till mappen 'db' och kör 'node dbSetup' följt av 'node migrateData' i terminalen
// -----------------------------------------------------------------------------


const modelS = require('../public/cars/modelS.json');
const model3 = require('../public/cars/model3.json');
const modelX = require('../public/cars/modelX.json');
const modelY = require('../public/cars/modelY.json');

const allCars = [...modelS, ...model3, ...modelX, ...modelY];

const insert = db.prepare(`
  INSERT INTO cars (model, specs, autopilotPackages, traction, wheels)
  VALUES (@model, @specs, @autopilotPackages, @traction, @wheels)
`);

// Infogar alla bilar i databasen
allCars.forEach((car) => {
  insert.run({
    model: car.model,
    specs: JSON.stringify(car.specs),
    autopilotPackages: JSON.stringify(car.autopilotPackages),
    traction: JSON.stringify(car.traction),
    wheels: JSON.stringify(car.wheels),
  });
});

console.log('Alla JSON-filer har migrerats till databasen.');
