const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const appRoute = require('./app.route');

const router = express.Router();

router.route("/").get((req, res) => {
  res.render("login");
});

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/app',
    route: appRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
