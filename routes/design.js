const express = require('express');
const Database = require('better-sqlite3');

const router = express.Router();
const db = new Database('./db/cars.db');

router.get('/cars/:model', (req, res) => {
  const modelParam = req.params.model;

  const car = db.prepare('SELECT * FROM cars WHERE model = ?').get(modelParam);
  if (!car) {
    return res.status(404).send('Bil inte hittad');
  }
  res.json({
    ...car,
    specs: JSON.parse(car.specs),
    traction: JSON.parse(car.traction),
    autopilotPackages: JSON.parse(car.autopilotPackages),
    wheels: JSON.parse(car.wheels),
  });
});

function formatPrice(price) {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' kr';
}

router.get('/:model', (req, res) => {
  const modelParam = req.params.model;
  const car = db.prepare('SELECT * FROM cars WHERE model = ?').get(modelParam);

  if (!car) {

    return res.status(404).render('error', {
      title: 'Sidan kunde inte hittas',
      status: 404,
      message: "Sidan kunde inte hittas",
    });
  }

  car.specs = JSON.parse(car.specs).map((spec) => ({
    ...spec,
    formattedPrice: formatPrice(spec.price), 
  }));
  car.traction = JSON.parse(car.traction);
  car.autopilotPackages = JSON.parse(car.autopilotPackages);
  car.wheels = JSON.parse(car.wheels);

  res.render('design', {
    title: modelParam.slice(0, 5) + ' ' + modelParam.slice(5),
    model: modelParam,
    car: car,
  });
});

module.exports = router;
