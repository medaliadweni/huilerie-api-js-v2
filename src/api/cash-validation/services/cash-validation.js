'use strict';

/**
 * cash-validation service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::cash-validation.cash-validation');
