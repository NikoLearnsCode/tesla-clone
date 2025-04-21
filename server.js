const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');

const indexRouter = require('./routes/index');
const productRouter = require('./routes/design');
const checkoutRouter = require('./routes/checkout');

const app = express();

app.use(
  session({
    secret: 'qwertyuiopasdfghjkl', //hittepå
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false},
  })
);

app.use((req, res, next) => {
  if (req.session.cart) {
    res.locals.cartItemCount = req.session.cart.reduce((sum, product) => {
      return sum + product.quantity;
    }, 0);
  } else {
    res.locals.cartItemCount = 0;
  }
  next();
});

app.use(cookieParser());

app.use(logger('dev'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use('/', indexRouter);
app.use('/design', productRouter);
app.use('/checkout', checkoutRouter);

// Generell felhanterare för alla fel (401, 403, 500, etc.)
app.use((err, req, res, next) => {
  res.status(err.status || 500).render('error', {
    title: 'Ett fel uppstod',
    status: err.status || 500, // Felkoden
    message: err.message || 'Något gick fel.', // Felmeddelande
  });
});

// Hantera 404 som saknade sidor
app.use((req, res) => {
  res.status(404).render('error', {
    title: 'Sidan kunde inte hittas',
    status: 404,
    message: 'Den här sidan existerar inte.',
  });
});

module.exports = app;
