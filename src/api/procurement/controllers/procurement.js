'use strict';

/**
 * procurement controller
 */

const fs = require('fs')
const path = require('path')
let pdf = require('handlebars-pdf')
const Handlebars = require("handlebars");
const moment = require('moment-timezone')



const {
  createCoreController
} = require('@strapi/strapi').factories;

const contentType = 'procurement'

module.exports = createCoreController('api::procurement.procurement', ({
  strapi
}) => ({
  async find(ctx) {
    if (!ctx.query.populate) {
      ctx.query = {
        ...ctx.query,
        populate: '*'
      }
    }
    let {
      data,
      meta
    } = await super.find(ctx);
    data = data.map(item => {
      const procurementState = item.attributes.state
      return {
        ...item,
        attributes: {
          ...item.attributes,
          total_price: procurementState === 'CANCELED' ? 0 : item.attributes.total_price,

          net_price: procurementState === 'CANCELED' ? 0 : item.attributes.weighings.data.reduce((acc, cv) => acc + cv.attributes.total_price, 0),
          total_net_weight: item.attributes.weighings.data.reduce((acc, cv) => acc + cv.attributes.net, 0),
        }

      }
    })

    return {
      data,
      meta
    };
  },

  async findOne(ctx) {
    if (!ctx.query.populate) {
      ctx.query = {
        ...ctx.query,
        populate: '*'
      }
    }
    const response = await super.findOne(ctx);
    if (!response) {
      return response
    }
    const procurementState = response.data.attributes.state

    response.data.attributes.total_price = procurementState === 'CANCELED' ? 0 : response.data.attributes.weighings.data.reduce((acc, cv) => acc + cv.attributes.total_price - cv.attributes.hab, 0)
    response.data.attributes.total_net_weight = response.data.attributes.weighings.data.reduce((acc, cv) => acc + cv.attributes.net, 0)

    let weighings = response.data.attributes.weighings.data
    for (let index = 0; index < weighings.length; index++) {
      const weighing = weighings[index];
      const popWeighing = await strapi.entityService.findOne('api::weighing.weighing', weighing.id, {
        populate: '*'
      });
      weighing.attributes.batchInfo = {
        data: popWeighing.batch
      }
    }

    const provider = response.data.attributes.provider.data
    const warehouse = response.data.attributes.warehouse.data
    let total = weighings.reduce((acc, cv) => acc + cv.attributes.total_price, 0)
    weighings = weighings.map((w, ind) => ({
      ...w,
      attributes: {
        ...w.attributes,
        unit_price: w.attributes.unit_price.toFixed(3),
        total_price: w.attributes.total_price.toFixed(3),
        index: ind + 1
      }
    }))

    let hab = weighings.reduce((acc, cv) => acc + cv.attributes.hab, 0)
    let dal = weighings.reduce((acc, cv) => acc + cv.attributes.dal, 0)
    const procurementPayments = await strapi.entityService.findMany('api::procurement-payment.procurement-payment', {
      populate: '*'
    });
    const pp = procurementPayments.find(item => {
      return item.procurement && item.procurement.id == ctx.params.id
    })
    if (ctx.originalUrl.includes('ticket')) {
      let timestamp = Date.now()
      let procurementPaymentValue = pp ? pp.value : 0
      let id = String(response.data.id).padStart(8, '0')
      let fileName = `bon-n${id}-${timestamp}`

      function render(data) {
        let source = fs.readFileSync(
          path.join(__dirname, "../../../../public/views/ticket.handlebars")
        ).toString();
        let template = Handlebars.compile(source);
        let output = template(data);
        fs.writeFileSync(`${process.cwd()}/public/uploads/${fileName}.html`, output);
        return output;
      }
      const totalValue = Number(total).toFixed(3)
      const habValue = Number(hab).toFixed(3)
      const context = {
        date: moment().tz('Africa/Tunis').format('DD/MM/YYYY - HH:mm:ss'),
        providerName: provider.attributes.name,
        warehouse,
        weighings,
        total: totalValue,
        hab: habValue,
        dal: Number(dal).toFixed(3),
        totalToPay: Number(total - hab).toFixed(3),
        id,
        totalPaidFloor: Math.floor(totalValue - habValue).toFixed(3),
        totalPaid: (totalValue - habValue).toFixed(3),
        fullProcurementPaymentValue: (totalValue - habValue + dal).toFixed(3)
      }

      fs.openSync(`${process.cwd()}/public/uploads/${fileName}.html`, 'w')

      let result = render(context);

      response.data.attributes.ticket = `/uploads/${fileName}.html`
      return response
    }
    return response
  },
  async create(ctx) {
    var results = await strapi.db.query("api::procurement.procurement").findMany({
      where: {
        warehouse: ctx.request.body.data.warehouse
      },
      sort: {
        // Assuming 'createdAt' is a timestamp field
        createdAt: 'desc'
      },
      limit: 1,
    });

    if (results && results.length > 0) {
      var lastRecord = results[0];
      ctx.request.body.data.number = lastRecord.number;

    } else {
      console.log("No records found for the specified warehouse.");
    }
    // some logic here
    const response = await super.create(ctx);
    console.log(ctx.request.body.data);
    // some more logic
    let userId = null
    if (ctx.state.user) {
      userId = ctx.state.user.id
    }
    let history = await strapi.entityService.create('api::history.history', {
      data: {
        event: {
          type: 'create',
          data: ctx.request.body.data
        },
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


    if (ctx.request.body.data.state == "CANCELED") {
      const idProc = ctx.request.body.data.idProc;

      const entry = await strapi.entityService.findOne('api::procurement.procurement', idProc, {
        populate: ['weighings.batch.oils', 'weighings.batch.transport_oils', 'weighings.batch.in_transports', 'procurement_payment']
      });
      if (entry.weighings && entry.weighings.length > 0) {
        for (const weighing of entry.weighings) {
          const createdCanceledWeighings = await strapi.db.query('api::canceled-weighing.canceled-weighing').create({
            data: {
              gross: weighing.gross,
              extruction_rate: weighing.extruction_rate,
              unit_price: weighing.unit_price,
              tare: weighing.tare,
              total_price: weighing.total_price,
              net: weighing.net,
              hab: weighing.hab,
              dal: weighing.dal,
              batch: weighing.batch == null ? null : weighing.batch.id,
              procurement: idProc,
              tax: weighing.tax,
              cash_transaction: null,
            }
          });

          await strapi.entityService.delete('api::weighing.weighing', weighing.id);
        }
      }
    }
    // some more logic
    let userId = null
    if (ctx.state.user) {
      userId = ctx.state.user.id
    }
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
  },

  async deletePayedProc(ctx) {
    const reqData = ctx.request.body.data;

    const idProc = reqData.id;
var tax = 0 ;

    const entry = await strapi.entityService.findOne('api::procurement.procurement', idProc, {
      populate: ['weighings.batch.oils', 'weighings.batch.transport_oils', 'weighings.batch.in_transports', 'procurement_payment' ,'provider']
    });
    let problemFound = true;
    if (entry && entry.weighings) {
      entry.weighings.forEach(weighing => {
        const oilsEmpty = weighing.batch.oils.length === 0;
        const transportOilsEmpty = weighing.batch.transport_oils.length === 0;
        const inTransportsEmpty = weighing.batch.in_transports.length === 0;

        if (oilsEmpty && transportOilsEmpty && inTransportsEmpty) {
          problemFound = false;
        }
      });
    }

    if (problemFound) {
      ctx.response.status = 400;
      ctx.response.body = {
        status: 400,
        message: "Tu n'a pas le droit de supprimer ce Procurement. Il y a des actions deja fait ⚠️",
        state: "false"

      };
    } else {

      if (entry.weighings && entry.weighings.length > 0) {
        for (const weighing of entry.weighings) {
          tax +=(weighing.net*weighing.unit_price*weighing.tax)/100;
          const createdCanceledWeighings = await strapi.db.query('api::canceled-weighing.canceled-weighing').create({
            data: {
              gross: weighing.gross,
              extruction_rate: weighing.extruction_rate,
              unit_price: weighing.unit_price,
              tare: weighing.tare,
              total_price: weighing.total_price,
              net: weighing.net,
              hab: weighing.hab,
              dal: weighing.dal,
              batch: weighing.batch.id,
              procurement: idProc,
              tax: weighing.tax,
              cash_transaction: null,
            }
          });

          await strapi.entityService.delete('api::weighing.weighing', weighing.id);


          const allCashTrans = await strapi.entityService.findMany("api::cash-transaction.cash-transaction", {
            filters: {
              procurement_payment: entry.procurement_payment.id,

            },
            populate: '*'
          });
          const proc = await strapi.entityService.findOne("api::procurement-payment.procurement-payment", allCashTrans[0].procurement_payment.id, {
            populate: {
              procurements: true
            },
          })
          console.log(proc)
          if (proc.procurements.length == 1) {
            const total_amount = allCashTrans
              .filter(cashTrans => cashTrans.comment.toLowerCase().includes('tax') === false)
              .reduce((total, cashTrans) => total + cashTrans.amount, 0);
            await strapi.entityService.create('api::cash-transaction.cash-transaction', {
              data: {
                user: allCashTrans[0].user.id,
                amount: (total_amount),
                warehouse: allCashTrans[0].warehouse.id,
                beneficiary: allCashTrans[0].beneficiary.id,
                comment: `Avance Bon/Dalel Annulé : ${allCashTrans[0].comment}`,
                type: "CASH",
                payment_category: allCashTrans[0].payment_category.id,

                procurement_payment: allCashTrans[0].procurement_payment.id,
                date: new Date()
              },
              populate: '*'
            })
            const idsToDelete = allCashTrans.map(cashTrans => cashTrans.id);

            for (const idToDelete of idsToDelete) {
              await strapi.entityService.delete('api::cash-transaction.cash-transaction', idToDelete);
            }
          } else {
            try {
              console.log('many bons ')
              console.log(entry)
              const allCashTrans = await strapi.entityService.findMany("api::cash-transaction.cash-transaction", {
                filters: {
                  procurement_payment: entry.procurement_payment.id,

                },
                populate: '*'
              });
              console.log(allCashTrans)

              const filteredCashTransIdCash = allCashTrans.filter(cashTrans => cashTrans.payment_category.name.toLowerCase().includes('achat'));
              const filteredCashTransIdTax = allCashTrans.filter(cashTrans => cashTrans.payment_category.name.toLowerCase().includes('tax'));

              //console.log(filteredCashTransIds)

              const updatedProc = await strapi.entityService.update('api::procurement-payment.procurement-payment', entry.procurement_payment.id, {
                data: {
                  value: entry.procurement_payment.value - entry.total_price_provider,
                },
              });

              const updatedCashTransactionTax = await strapi.entityService.update('api::cash-transaction.cash-transaction', filteredCashTransIdTax[0].id, {
                data: {
                  amount: filteredCashTransIdTax[0].amount + tax,
                  comment: filteredCashTransIdTax[0].comment + ' Bon annulé'
                },
              });
              const updatedCashTransaction = await strapi.entityService.update('api::cash-transaction.cash-transaction', filteredCashTransIdCash[0].id, {
                data: {
                  amount: filteredCashTransIdCash[0].amount + entry.total_price_provider,
                  comment: filteredCashTransIdCash[0].comment + ' Bon annulé'
                },
              });
         
              await strapi.entityService.create('api::cash-transaction.cash-transaction', {
                data: {
                  user: filteredCashTransIdCash[0].user.id,
                  amount: (-entry.total_price_provider),
                  warehouse: filteredCashTransIdCash[0].warehouse.id,
                  beneficiary: filteredCashTransIdCash[0].beneficiary.id,
                  comment: `Avance Bon/Dalel Annulé : ${filteredCashTransIdCash[0].comment}`,
                  type: "CASH",
                  payment_category: filteredCashTransIdCash[0].payment_category.id,
  
                  procurement_payment: filteredCashTransIdCash[0].procurement_payment.id,
                  date: new Date()
                },
                populate: '*'
              })
              await strapi.entityService.create('api::procurement-payment.procurement-payment', {
                data: {

                  type:"CASH" ,
                  value : (entry.total_price_provider) ,
                  user: filteredCashTransIdCash[0].user.id,
                  provider :entry.provider.id ,
                  warehouse: filteredCashTransIdCash[0].warehouse.id,
               
                },
                populate: '*'
              })
            } catch (e) {
              console.log(e)
            }
          }
        }
      }



      //      const proc = await strapi.db.query('api::canceled-weighing.canceled_weighing').createm(objproc,{populate:'*'});


      const updatedEntity = await strapi.entityService.update(
        'api::procurement.procurement', idProc, {
          data: {
            weighings: null,
            state: "CANCELED_PAID"
          }
        }
      );
      ctx.response.status = 200;
      ctx.response.body = {
        status: 200,
        message: "L'opération de suppression est autorisée ✅",
        state: "true"

      };

    }
  }

}));
