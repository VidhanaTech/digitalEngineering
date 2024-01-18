const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const clientRoute = require('./client.route');
const lookupRoute = require('./lookup.route');
const projectRoute = require('./project.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');
const dashboardRoute = require('./dashboard.route');
const masterRoute = require('./master.route');
const kmartical = require('./kmartical.route');
const vxarticle = require('./vxarticle.route');
const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/dashboard',
    route: dashboardRoute,
  },
  {
    path: '/user',
    route: userRoute,
  },
  {
    path: '/client',
    route: clientRoute,
  },
  {
    path: '/kmarticle',
    route: kmartical,
  },
  {
    path: '/vxarticle',
    route: vxarticle,
  },
  {
    path: '/lookup',
    route: lookupRoute,
  },
  {
    path: '/project',
    route: projectRoute,
  },
  {
    path: '/master',
    route: masterRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
