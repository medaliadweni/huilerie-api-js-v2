'use strict';

/**
 * procurement-payment controller
 */

const {
  createCoreController
} = require('@strapi/strapi').factories;

const contentType = 'procurement-payment'

module.exports = createCoreController('api::procurement-payment.procurement-payment', ({
  strapi
}) => ({
  // async find(ctx) {
  //     // some logic here
  //     const providers = await strapi.controller('api::provider.provider').find({});
  //     const procurementPayments = await strapi.entityService.findMany('api::procurement-payment.procurement-payment', {
  //         populate: 'provider',
  //     })
  //     let { data, meta } = await super.find(ctx);
  //     // some more logic
  //     data = procurementPayments.map(item =>{ 
  //         return { id: item.id, attributes: { ...item, provider: { data: providers.data.find(p => p.id === (item.provider && item.provider.id)), id: undefined} } }
  //     })
  //     return { data, meta };
  //   },



  async create(ctx) {
    // some logic here
    const response = await super.create(ctx);
    // console.log(JSON.stringify(response, null, 2));
    // some more logic
    let userId = null
    const procPayId = response.data.id
    if (ctx.state.user) {
      userId = ctx.state.user.id
    }
    const reqData = ctx.request.body.data
    const procurements = reqData.procurements
    const items = await strapi.entityService.findMany(`api::procurement.procurement`, {
      filters: {
        id: {
          $in: procurements
        }
      },
      populate: '*'
    });
    // if (reqData.value == 0) {
    //     ctx.request.body.data.value = items.reduce((acc, cv) => { console.log(cv.total_price); return acc + cv.total_price}, 0)
    //     // console.log('here');
    //     // ctx.request.body.data.comment = 'test'
    // }
    for (let index = 0; index < items.length; index++) {
      const element = items[index];
      const entry = await strapi.entityService.update('api::procurement.procurement', element.id, {
        data: {
          state: 'PAID'
        },
      })
    }
    const provider = await strapi.entityService.findOne('api::provider.provider', reqData.provider)
    //  console.log({
    //     reqData,
    //     provider
    //   });

    // console.log("Is Closed ", provider);
    const obj = {
      provider: provider.id
    };
    const beneficery = await strapi.entityService.findMany('api::beneficary.beneficary', {
      filters: obj
    });
   
   

    var isManyBons =reqData.isManyBons ;
    // const beneficery = await strapi.entityService.create('api::beneficary.beneficary',  { data: {
    //     event: { type: 'create', data: obj },
    //     user: userId,
    //     collection_type: contentType,
    //      collection_item_id: String(provider.id)
    // },})
    //   console.log("beneficery ",beneficery);

    const paymentCategories = await strapi.entityService.findMany('api::payment-category.payment-category', {})
    const relatedPaymentCategory = paymentCategories.find(pc => pc.name.toLowerCase().includes('achat olive'))
    let procurementNumbers = items.map((cv) => {
      return cv.number;
    }).join(",");
    //  console.log(reqData);
    const objproc = {
      id: reqData.procurements[0]
    };
    if (reqData.procurements[0] != undefined) {
      const proc = await strapi.entityService.findMany('api::procurement.procurement', {
        populate: '*', // This populates all relationships. Make sure your relationships are defined correctly.
        filters: objproc
      }, );

      const objCat = {
        warehouse: proc[0].warehouse.id
      };
      /*   const paymentCat = await strapi.db.query('api::payment-category.payment-category').findMany(objCat)*/

      const paymentCat = await strapi.entityService.findMany('api::payment-category.payment-category', {
        filters: objCat
      }, );

      
      const idCatTax = paymentCat.find(pc => pc.name.toLowerCase().includes('tax'))
      const idCatAchat = paymentCat.find(pc => pc.name.toLowerCase().includes('achat olive'))
      const idCatDalel = paymentCat.find(pc => pc.name.toLowerCase().includes('dalel'))

      //const proc = await strapi.db.query('api::procurement.procurement').findOne(objproc,{populate:'*'});
      //console.log(proc[0].weighings);
      const result = proc[0].weighings.reduce((totalSum, weighing) => {
        const {
          net,
          unit_price,
          dal,
          hab
        } = weighing;
        const sum = (net * unit_price)  +dal- hab;
        return totalSum + sum;
      }, 0);
      const resultDal = proc[0].weighings.reduce((totalSum, weighing) => {
        const {
          dal,
        } = weighing;
        return totalSum + dal;
      }, 0);
      console.log(resultDal)
      const resultTax = proc[0].weighings.reduce((totalSum, weighing) => {
        const {
          net,
          unit_price,
          tax
        } = weighing;
        const sum = (net * unit_price) * tax / 100;
        return totalSum + sum;
      }, 0);
      const netWeight = proc[0].weighings.reduce((totalSum, weighing) => {
        const {
          net,

        } = weighing;
        const sum = net;
        return totalSum + sum;
      }, 0);
 




      let cashTransaction = await strapi.entityService.create('api::cash-transaction.cash-transaction', {
        data: {
          user: userId,
          amount: -(reqData.value),
          warehouse: reqData.warehouse,
          beneficiary: beneficery[0].id,
          comment: (reqData.procurements && reqData.procurements.length) ? `Bon N°${procurementNumbers}: ${reqData.comment || ''}` : `Avance: ${reqData.comment || ''}`,
          type: reqData.type,
          payment_category: idCatAchat,
          num_cheque: reqData.num_cheque,
          name_bank: reqData.name_bank,

          procurement_payment: procPayId,
          date: new Date()
        },
        populate: '*'
      })
      let cashTransactionTax = await strapi.entityService.create('api::cash-transaction.cash-transaction', {
        data: {
          user: userId,
          amount: isManyBons ? -reqData.tax : -resultTax,
          warehouse: reqData.warehouse,
          beneficiary: beneficery[0].id,
          comment: `Tax ${reqData.comment} - Bon N°${procurementNumbers}`,
          type: 'CASH',
          payment_category: idCatTax,
          num_cheque: reqData.num_cheque,
          name_bank: reqData.name_bank,
          date: new Date(),
          procurement_payment: procPayId,

        }
      })
      let cashTransactionDalel = await strapi.entityService.create('api::cash-transaction.cash-transaction', {
        data: {
          user: userId,
          amount: isManyBons ? -reqData.dal : -resultDal,
          warehouse: reqData.warehouse,
          beneficiary: beneficery[0].id,
          comment: `Dalel ${reqData.comment} - Bon N°${procurementNumbers}/${reqData.type}`,
          type: 'CASH',
          payment_category: idCatDalel,
          num_cheque: reqData.num_cheque,
          name_bank: reqData.name_bank,
          date: new Date() ,
          procurement_payment: procPayId,

        }
      })

      const entry = await strapi.entityService.findOne('api::payment-category.payment-category', idCatAchat.id, {
        // Use the populate option to include related data.
        populate: 'cash_transactions',
      });

      let listIdCash = [];
      if (entry && entry.cash_transactions && Array.isArray(entry.cash_transactions)) {
        entry.cash_transactions.map((a) => {
          listIdCash.push(a.id);
        });
      } else {
        console.error("Error: entry or cash_transactions is missing or not an array.");
      }
      listIdCash.push(cashTransaction);
      await strapi.entityService.update('api::payment-category.payment-category', idCatAchat.id, {
        data: {
          cash_transactions: listIdCash,
        },
      });
    

      let procUpdate = await strapi.entityService.update('api::procurement.procurement', proc[0].id, {
        data: {
          total_price: result - resultTax,
          total_net_weight: netWeight

        }
      })
      // let history = await strapi.entityService.create('api::history.history', {
      //     data: {
      //         event: { type: 'create', data: ctx.request.body.data },
      //         user: userId,
      //         collection_type: contentType,
      //         collection_item_id: String(response.data.id)
      //     }
      // })
      // console.log({ procurements, items });
    } else {
      let cashTransaction = await strapi.entityService.create('api::cash-transaction.cash-transaction', {
        data: {
          user: userId,
          amount: -reqData.value,
          warehouse: reqData.warehouse,
          beneficiary: beneficery[0].id,
          comment: (reqData.procurements && reqData.procurements.length) ? `Bon N°${procurementNumbers}: ${reqData.comment || ''}` : `Avance: ${reqData.comment || ''}`,
          type: reqData.type,
          payment_category: relatedPaymentCategory && relatedPaymentCategory.id,
          num_cheque: reqData.num_cheque,
          name_bank: reqData.name_bank,

          procurement_payment: response.data.id,
          date: new Date()
        }
      })
    }

    return response;
  },
  async getAvanceValue(ctx) {
    const idwarehouse = ctx.request.query.idwarehouse;

    const totalAvance = await strapi.entityService.findMany("api::procurement-payment.procurement-payment", {
      filters: {
        warehouse: idwarehouse,

      },
      populate: '*'
    });
    const totalAchat = await strapi.entityService.findMany("api::procurement.procurement", {
      filters: {
        warehouse: idwarehouse,
        state: 'PAID',

      },
      populate: '*'
    });
    const sumAvance = totalAvance.reduce((total, object) => {
      if (object.procurements.length === 0) {
        total += object.value;
      }
      return total;
    }, 0);

    const sumAchat = totalAchat.reduce((total, object) => {
      total += object.total_price_provider;

      return total;
    }, 0);
    // Send the result as a response
    ctx.send({
      avance: sumAvance,
      achat: sumAchat
    });
  },


  async updateProc(ctx) {
      const reqData = ctx.request.body.data;
      try {
        const objproc = {
          id: reqData.id
        };

        const procurement = await strapi.entityService.findMany('api::procurement.procurement', {
          populate: '*', // This populates all relationships. Make sure your relationships are defined correctly.
          filters: objproc
        }, );
        if (!procurement) {
          throw new Error('Procurement record not found');
        }

        // Calculate total price, total net weight, and other values
        const result = procurement[0].weighings.reduce((totalSum, weighing) => {
          const {
            net,
            unit_price,
            dal,
            hab,
            tax
          } = weighing;
          const sum = (net * unit_price.toFixed(3)) + dal - hab;
          return totalSum + sum;
        }, 0);
        const resultProv = procurement[0].weighings.reduce((totalSum, weighing) => {
          const {
            net,
            unit_price,
            dal,
            hab,
            tax
          } = weighing;
          const sum = (net * unit_price.toFixed(3)) - hab - ((net * unit_price.toFixed(3)) * tax / 100);
          return totalSum + sum;
        }, 0);

        var totalSum = 0;
        var weighings = procurement[0].weighings;

        for (var i = 0; i < weighings.length; i++) {
          const net = weighings[i].net;
          const unitPrice = weighings[i].unit_price;
          const tax = weighings[i].tax;

          const sum = (net * unitPrice.toFixed(3)) * tax / 100;
          totalSum += sum;
        }



        /*  const resultTax = procurement[0].weighings.reduce((totalSum, weighing) => {
        const { net, unit_price, tax } = weighing;
        const sum = (net * unit_price) * tax / 100;
        return totalSum + sum;
      }, 0);
  */
        const netWeight = procurement[0].weighings.reduce((totalSum, weighing) => {
          const {
            net
          } = weighing;
          const sum = net;
          return totalSum + sum;
        }, 0);

        // Update the procurement record with calculated values
        const updatedProcurement = await strapi.entityService.update('api::procurement.procurement', procurement[0].id, {
          data: {
            total_price: (result - totalSum).toFixed(4),
            total_net_weight: netWeight,
            total_price_provider: resultProv.toFixed(4),

            // Add any other fields you need to update here
          },
        });
        ctx.status = 200;
        ctx.body = {
          message: 'Procurement updated successfully',
          data: updatedProcurement
        };
      } catch (error) {
        console.error('Error updating procurement:', error);
        ctx.status = 500;
        ctx.body = {
          error: 'Internal server error'
        };
      }
    }


    ,
  async update(ctx) {
      print("rrrrrrrrrrr");
      // some logic here
      const response = await super.update(ctx);
      // some more logic
      const reqData = ctx.request.body.data
      let procurement
      if (reqData.procurement) {
        procurement = await strapi.entityService.findOne('api::procurement.procurement', reqData.procurement)
      }
      let provider
      if (reqData.provider) {
        provider = await strapi.entityService.findOne('api::provider.provider', reqData.provider)
      }
      let userId = null
      if (ctx.state.user) {
        userId = ctx.state.user.id
      }
      let cashTransactionUpdateDetails = {}
      if (reqData.value) {
        cashTransactionUpdateDetails.amount = -(reqData.value + ((procurement && procurement.dal) ? procurement.dal : 0))
      }
      if (reqData.warehouse) {
        cashTransactionUpdateDetails.warehouse = reqData.warehouse
      }
      if (reqData.type) {
        cashTransactionUpdateDetails.type = reqData.type
      }
      const pp = await strapi.entityService.findOne('api::procurement-payment.procurement-payment', ctx.params.id, {
        populate: '*'
      })
      let cashTransaction = await strapi.entityService.update('api::cash-transaction.cash-transaction', pp.cash_transaction.id, {
        data: cashTransactionUpdateDetails
      })
      let history = await strapi.entityService.create('api::history.history', {
        data: {
          event: {
            type: 'update',
            data: ctx.request.body.data
          },
          user: userId,
          collection_type: contentType,
          collection_item_id: ctx.params.id
        }
      })
      return response;
    }

    ,

}));
