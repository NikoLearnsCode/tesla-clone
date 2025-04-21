const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const cart = req.session.cart || [];

  const totalCartPrice = cart.reduce(
    (total, item) => total + item.totalPrice * item.quantity,
    0
  );

  res.render('Checkout', {
    title: 'Checkout',
    cart,
    totalCartPrice,
  });
});

router.post('/add-to-cart', (req, res) => {
  const product = req.body;

  if (!req.session.cart) {
    req.session.cart = [];
  }

  // Skapar ett unikt ID som beskriver konfigurationen
  const configId = [
    product.model,
    product.wheel,
    product.wheelPrice,
    product.color,
    product.colorPrice,
    product.traction,
    product.tractionPrice,
    product.variant,
    product.variantPrice,
    product.autopilot,
    product.autopilotPrice,
  ].join('-');

  const existingProduct = req.session.cart.find(
    (item) => item.configId === configId
  );

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    req.session.cart.unshift({
      ...product,
      configId,
      quantity: 1,
    });
  }

  req.session.save((err) => {
    if (err) {
      return res
        .status(500)
        .json({success: false, message: 'Kunde inte spara sessionen'});
    }
    return res.json({success: true, cart: req.session.cart});
  });
});

//Hanterar Update & Delete
router.post('/update-cart', (req, res) => {
  const {configId, change} = req.body;

  if (req.session.cart) {
    const item = req.session.cart.find(
      (product) => product.configId === configId
    );
    if (item) {
      item.quantity += change;
      if (item.quantity <= 0) {
        // Ta bort
        req.session.cart = req.session.cart.filter(
          (p) => p.configId !== configId
        );
      }
    }
  }

  req.session.save((err) => {
    if (err) {
      return res
        .status(500)
        .json({success: false, message: 'Kunde inte spara sessionen'});
    }
    return res.json({success: true, cart: req.session.cart});
  });
});

router.post('/checkout/confirm', (req, res) => {});

module.exports = router;
