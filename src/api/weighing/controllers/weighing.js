'use strict';

/**
 * weighing controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

const contentType = 'weighing'

module.exports = createCoreController('api::weighing.weighing', ({ strapi }) => ({
    async create(ctx) {
        // some logic here
        const response = await super.create(ctx);
        // some more logic
        let userId = null
        if (ctx.state.user) {
            userId = ctx.state.user.id
        }
        let history = await strapi.entityService.create('api::history.history', {
            data: {
                event: { type: 'create', data: ctx.request.body.data},
                user: userId,
                collection_type: contentType,
                collection_item_id: String(response.data.id)
            }
        })
        return response;
      },
      async update(ctx) {
        // some logic here
        const response = await super.update(ctx);
        // some more logic
        let userId = null
        if (ctx.state.user) {
            userId = ctx.state.user.id
        }
        let history = await strapi.entityService.create('api::history.history', {
            data: {
                event: { type: 'update', data: ctx.request.body.data},
                user: userId,
                collection_type: contentType,
                collection_item_id: ctx.params.id
            }
        })
        return response;
      }
}));
