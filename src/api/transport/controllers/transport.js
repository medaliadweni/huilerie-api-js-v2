'use strict';

/**
 * transport controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::transport.transport', ({ strapi }) => ({
    async find(ctx) {
        // some logic here
        const { data, meta } = await super.find(ctx);
        // some more logic
        const cashTransactions = await strapi.entityService.findMany('api::cash-transaction.cash-transaction', {
            // fields: ['title', 'description'],
            // filters: { title: 'Hello World' },
            // sort: { createdAt: 'DESC' },
            populate: { payment_category: true, procurement_payment: true }
        });
        for (let index = 0; index < cashTransactions.length; index++) {
            const element = cashTransactions[index];
            if (element.procurement_payment) {
                const entry = await strapi.entityService.update('api::cash-transaction.cash-transaction', element.id, {
                    data: {
                        amount: -Math.abs(element.amount),
                        date: element.createdAt
                    },
                });
            }
        }
        return { data, meta };
    }
}));
