'use strict';

/**
 * cash-transaction service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::cash-transaction.cash-transaction');
