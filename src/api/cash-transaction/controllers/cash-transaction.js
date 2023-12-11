'use strict';

/**
 * cash-transaction controller
 */

const {
  createCoreController
} = require('@strapi/strapi').factories;

module.exports = createCoreController('api::cash-transaction.cash-transaction', ({
  strapi
}) => ({
  async find(ctx) {
    // some logic here
    let {
      data,
      meta
    } = await super.find(ctx);
    // let procurementPayments = await strapi.entityService.findMany('api::procurement-payment.procurement-payment', {
    //     populate: '*',
    //     filters: {
    //         type: 'CASH',
    //     }
    // })
    // const pc = await strapi.entityService.findOne('api::payment-category.payment-category', 1, {
    //     // populate: '*',
    // });
    // procurementPayments = procurementPayments.map(pp => {
    //     return {
    //         ...pp,
    //         warehouse: {
    //             data: {
    //                 id: pp.warehouse.id,
    //                 attributes: {
    //                     ...pp.warehouse,
    //                     id: undefined
    //                 }
    //             }
    //         },
    //         user: {
    //             data: {
    //                 id: pp.user.id,
    //                 attributes: {
    //                     ...pp.user,
    //                     id: undefined,
    //                     password: undefined
    //                 }
    //             }
    //         },
    //         createdBy: undefined,
    //         updatedBy: undefined,
    //         payment_category: {
    //             data: {
    //                 id: pc.id,
    //                 attributes: {
    //                     ...pc,
    //                     id: undefined
    //                 }
    //             }
    //         },
    //         beneficiary: pp.provider.name,
    //         provider: undefined
    //     }
    // })
    // let createdAt$gte = ctx.query?.filters?.createdAt?.$gte
    // let createdAt$lte = ctx.query?.filters?.createdAt?.$lte
    // let createdAt$gt = ctx.query?.filters?.createdAt?.$gt
    // let createdAt$lt = ctx.query?.filters?.createdAt?.$lt
    // if (createdAt$gte) {
    //     procurementPayments = procurementPayments.filter(item => item.createdAt >= createdAt$gte)
    // }
    // if (createdAt$lte) {
    //     procurementPayments = procurementPayments.filter(item => item.createdAt <= createdAt$lte)
    // }
    // if (createdAt$gt) {
    //     procurementPayments = procurementPayments.filter(item => item.createdAt > createdAt$gt)
    // }
    // if (createdAt$lt) {
    //     procurementPayments = procurementPayments.filter(item => item.createdAt < createdAt$lt)
    // }
    // data = [...data, ...procurementPayments.map(item => ({ id: 'pp-' + item.id, attributes: { ...item, id: undefined, amount: item.value } }))]
    // data = data.sort((a, b) => { if (a.attributes.createdAt > b.attributes.createdAt) { return 1 } else { return -1 } })
    // // some more logic
    let total = data.reduce((acc, cv) => acc + (cv.attributes && cv.attributes.amount), 0)
    const cashValidations = await strapi.entityService.findMany('api::cash-validation.cash-validation', {
      sort: {
        date: 'DESC'
      },
    });
    const lastCashValidation = cashValidations.length && cashValidations[0]
    const amountToAdd = lastCashValidation ? lastCashValidation.real_cash : 0
    return {
      data,
      meta: {
        ...meta,
        total,
        total_plus: total + amountToAdd
      }
    };
  },
  async getAll(ctx) {
      try {
        const filters = {};
        const startDate = new Date(ctx.query.dateCreatedStart);
        const endDate = new Date(ctx.query.dateCreatedEnd);
        /*      if (ctx.query.dateCreatedStart && ctx.query.dateCreatedEnd) {
                filters.createdAt = {
                  $gte: new Date(ctx.query.dateCreatedStart),
                  $lte: new Date(ctx.query.dateCreatedEnd),
                };
              }*/


        if (ctx.query.beneficiaryId && ctx.query.beneficiaryId != 'null') {
          filters.beneficiary = ctx.query.beneficiaryId;
        }
        if (ctx.query.warehousId) {
          filters.warehouse = ctx.query.warehousId;
        }
        if (ctx.query.paymentCategoryId) {
          filters.payment_category = ctx.query.paymentCategoryId.split(',')
        }
        const cashTransactions = await strapi.entityService.findMany('api::cash-transaction.cash-transaction', {
          _limit: -1,
          populate: '*', // This populates all relationships. Make sure your relationships are defined correctly.

          filters: filters
        }, );

        const filteredCashTransactions = cashTransactions.filter(transaction => {

          const transactionDate = new Date(transaction.createdAt);
          const startDateFormat = new Date(startDate);
          const endDateFormat = new Date(endDate);
          endDateFormat.setDate(endDateFormat.getDate() + 1); // Add one day to the end date

          return transactionDate >= startDateFormat && transactionDate < endDateFormat;
        });


        ctx.send({
          data: filteredCashTransactions.map(transaction => ({
            id: transaction.id,
            attributes: {
              amount: transaction.amount,
              oldBeneficiary: transaction.oldBeneficiary,
              comment: transaction.comment,
              type: transaction.type,
              date: transaction.date,
              createdAt: transaction.createdAt,
              updatedAt: transaction.updatedAt,
              num_cheque: transaction.num_cheque,
              name_bank: transaction.name_bank,

              user: {
                data: {
                  id: transaction.user.id,
                  attributes: {

                    username: transaction.user.username,
                    email: transaction.user.email,
                    provider: transaction.user.provider,
                    confirmed: transaction.user.confirmed,
                    blocked: transaction.user.blocked,
                    name: transaction.user.name,
                    createdAt: transaction.user.createdAt,
                    updatedAt: transaction.user.updatedAt,
                  }
                }
              },
              beneficiary: transaction.beneficiary ? {
                data: {
                  id: transaction.beneficiary.id,
                  attributes: {
                    name: transaction.beneficiary.name,
                    createdAt: transaction.beneficiary.createdAt,
                    updatedAt: transaction.beneficiary.updatedAt,
                  }
                }
              } : null,
              warehouse: {
                data: {

                  id: transaction.warehouse.id,
                  attributes: {
                    name: transaction.warehouse.name,
                    address: transaction.warehouse.address,
                    phone: transaction.warehouse.phone,
                    createdAt: transaction.warehouse.createdAt,
                    updatedAt: transaction.warehouse.updatedAt,
                  }
                }
              },
              payment_category: {
                data: {

                  id: transaction.payment_category.id,
                  attributes: {
                    name: transaction.payment_category.name,
                    description: transaction.payment_category.description,
                    color: transaction.payment_category.color,
                    type: transaction.payment_category.type,
                    is_locked: transaction.payment_category.is_locked,
                    createdAt: transaction.payment_category.createdAt,
                    updatedAt: transaction.payment_category.updatedAt,
                  }
                }
              },
            }

            // Include related data here, e.g., beneficiary, warehouse, payment_category, etc.
          })),
        });
      } catch (error) {
        console.error('An error occurred while fetching data:', error);
        ctx.send({
          error: 'An error occurred while fetching data.'
        }, 500);
      }
    }

    ,
  async getTotalCaisseToday(ctx) {
    const date = ctx.query.date;
    const warehouseId = ctx.query.warehousId;

    if (!date || !warehouseId) {
      ctx.status = 400;
      ctx.body = {
        error: 'Invalid input 😌 , Both date and warehouseId are required.',
      };
      return;
    }
    const cashTransRecords = await strapi.entityService.findMany('api::cash-transaction.cash-transaction', {
      filters: {
        warehouse: warehouseId,
        date: {
          $gte: `${date}T00:00:00.000Z`, // Start of the specified date
          $lt: `${date}T23:59:59.999Z`, // End of the specified date
        },
      },
      populate: '*',
      _limit: -1,
    });
    const sumAmount = cashTransRecords.reduce((total, record) => {
      return total + record.amount;
    }, 0);

    ctx.status = 200;
    ctx.body = {
      message: 'Successfully 😀',
      data: {
        sumAmount: sumAmount
      },
    };
  },
  async getValueTotalEspace(ctx) {

    try {
      // Get the date and warehouseId from the query parameters
      const date = ctx.query.date;
      const warehouseId = ctx.query.warehousId; // Typo corrected: 'warehousId' to 'warehouseId'

      // Validate input values
      if (!date || !warehouseId) {
        ctx.status = 400;
        ctx.body = {
          error: 'Invalid input 😌 , Both date and warehouseId are required.',
        };
        return;
      }

      // Find a single record based on date and warehouseId
      const cashValidationRecords = await strapi.entityService.findMany('api::cash-validation.cash-validation', {
        filters: {
          warehouse: warehouseId,
          date: date,
        },
        populate: '*', // Make sure your relationships are defined correctly.
      });

      // If no record is found, return 0
      const value = cashValidationRecords[0] ? cashValidationRecords[0].real_cash : 0;

      ctx.status = 200;
      ctx.body = {
        message: 'Successfully 😀',
        data: {
          value
        },
      };
    } catch (error) {
      console.error('Error handling request:', error);
      ctx.status = 500;
      ctx.body = {
        error: 'Internal server error',
      };
    }
  },
  async getAllCashTransactionByWarehouseAndDate(ctx) {
    try {
      const warehouseId = ctx.query.warehousId;
      const date = ctx.query.date;
      if (!warehouseId || !date) {
        ctx.status = 400;
        ctx.body = {
          error: 'Invalid input 😌 , warehouseId is required.',
        };
        return;
      }

      const cashTranList = await strapi.entityService.findMany('api::cash-transaction.cash-transaction', {
        filters: {
          warehouse: warehouseId,
          date: {
            $gte: `${date}T00:00:00.000Z`, // Start of the specified date
            $lt: `${date}T23:59:59.999Z`, // End of the specified date
          },
        },
        _limit: -1,
        populate: '*'
      });
      ctx.status = 200;
      ctx.body = {
        message: 'List Of Cash Transactions',
        data: cashTranList
      };
    } catch (error) {
      console.error('Error cashTranList GET:', error);
      ctx.status = 500;
      ctx.body = {
        error: 'Internal server error'
      };
    }
  }

}));
