'use strict';

/**
 * employee-payment service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::employee-payment.employee-payment');
