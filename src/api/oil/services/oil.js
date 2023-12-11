'use strict';

/**
 * oil service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::oil.oil');
