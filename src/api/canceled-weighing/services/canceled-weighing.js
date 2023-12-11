'use strict';

/**
 * canceled-weighing service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::canceled-weighing.canceled-weighing');
