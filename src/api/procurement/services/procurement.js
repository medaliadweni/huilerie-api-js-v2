'use strict';

/**
 * procurement service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::procurement.procurement');
