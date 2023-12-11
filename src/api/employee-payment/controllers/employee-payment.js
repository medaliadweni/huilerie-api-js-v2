'use strict';

/**
 * employee-payment controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

const contentType = 'employee-payment'


module.exports = createCoreController('api::employee-payment.employee-payment', ({ strapi }) => ({
    async create(ctx) {
        const response = await super.create(ctx);
        let userId = null
        if (ctx.state.user) {
            userId = ctx.state.user.id
        }
        const reqData = ctx.request.body.data
        const paymentCategories = await strapi.entityService.findMany('api::payment-category.payment-category', {   filters: {
            warehouse:reqData.warehouse}});
        const relatedPaymentCategory = paymentCategories.find(pc => pc.name.toLowerCase().includes('employ'))
        if (reqData.type === 'CASH') {
            let cashTransaction = await strapi.entityService.create('api::cash-transaction.cash-transaction', {
                data: {
                    user: userId,
                    amount: -Number(reqData.payment),
                    warehouse: reqData.warehouse,
                    // beneficiary: provider.name,
                    comment: reqData.comment,
                    type: reqData.type,
                    payment_category: relatedPaymentCategory && relatedPaymentCategory.id,
                    employee_payment: response.data.id,
                    date: new Date()
                }
            })
        }
        let history = await strapi.entityService.create('api::history.history', {
            data: {
                event: { type: 'create', data: ctx.request.body.data },
                user: userId,
                collection_type: contentType,
                collection_item_id: String(response.data.id)
            }
        })
        return response;
    },
    async update(ctx) {
        const response = await super.update(ctx);
        const reqData = ctx.request.body.data
        let userId = null
        if (ctx.state.user) {
            userId = ctx.state.user.id
        }
        let cashTransactionUpdateDetails = {}
        if (reqData.payment) {
            cashTransactionUpdateDetails.amount =  -Number(reqData.payment)
        }
        if (reqData.warehouse) {
            cashTransactionUpdateDetails.warehouse = reqData.warehouse
        }
        if (reqData.type) {
            cashTransactionUpdateDetails.type = reqData.type
        }
        const ep = await strapi.entityService.findOne('api::employee-payment.employee-payment', ctx.params.id, { populate: '*' })
        let cashTransaction = await strapi.entityService.update('api::cash-transaction.cash-transaction', ep.cash_transaction.id, {
            data: cashTransactionUpdateDetails
        })
        let history = await strapi.entityService.create('api::history.history', {
            data: {
                event: { type: 'update', data: ctx.request.body.data },
                user: userId,
                collection_type: contentType,
                collection_item_id: ctx.params.id
            }
        })
        return response;
    }
}));
