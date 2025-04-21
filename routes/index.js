const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const cart = req.session.cart || [];

  res.render('index', {title: 'Tesla', cart});
});

router.get('/order-confirmation', (req, res, next) => {
  const order = req.session.cart || [];

  req.session.cart = [];
  res.render('order-confirmation', {title: 'Orderbekräftelse', order});
});

module.exports = router;
