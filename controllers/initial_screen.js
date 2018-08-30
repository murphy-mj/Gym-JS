'use strict';

const logger = require('../utils/logger');

const initial_screen = {
  
index(request, response) {
   logger.info('rendering initial Login/register screen');
   const viewData = {
        title: 'Initial Screen',
   };
  response.render('initial_screen', viewData);
  },
  
};

module.exports = initial_screen;

