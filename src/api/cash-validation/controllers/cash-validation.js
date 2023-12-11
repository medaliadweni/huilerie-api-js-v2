'use strict';

/**
 * cash-validation controller
 */

const {
  createCoreController
} = require('@strapi/strapi').factories;

module.exports = createCoreController('api::cash-validation.cash-validation', ({
  strapi
}) => ({
  async create(ctx) {

    // Perform the creation of the 'cash-validation' entity
    const entity = await super.create(ctx)


    const objCat = {
      warehouse: ctx.request.body.data.warehouse
    };
    /*   const paymentCat = await strapi.db.query('api::payment-category.payment-category').findMany(objCat)*/

    const paymentCat = await strapi.entityService.findMany('api::payment-category.payment-category', {
      filters: objCat
    }, );


    const idCatRecharge = paymentCat.find(pc => pc.name.toLowerCase().includes('recharge'))
    // Log that the entity was added
    const currentDate = new Date(ctx.request.body.data.date);
    currentDate.setDate(currentDate.getDate() + 1);
    let cashTransaction = await strapi.entityService.create('api::cash-transaction.cash-transaction', {
        data: {
          amount: ctx.request.body.data.real_cash,
          warehouse: ctx.request.body.data.warehouse,
          comment: "Recharge Caisse hier",
          type: "CASH",
          payment_category: idCatRecharge,
        

          date: currentDate,
          createdAt: currentDate,

        },
        populate: '*'
      })

   
    // Return the created entity
    return entity;
  },
}));
