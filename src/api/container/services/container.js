'use strict';

/**
 * container service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::container.container');
