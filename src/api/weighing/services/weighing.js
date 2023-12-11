'use strict';

/**
 * weighing service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::weighing.weighing');
