'use strict';

/**
 * tank service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::tank.tank');
