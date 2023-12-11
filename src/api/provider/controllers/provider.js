'use strict';

/**
 * provider controller
 */

const {
  createCoreController
} = require('@strapi/strapi').factories;

module.exports = createCoreController('api::provider.provider', ({
  strapi
}) => ({
  async find(ctx) {
    ctx.query = {
      ...ctx.query
    }
    // ctx.query = { ...ctx.query, populate: '*' }
    const procurements = await strapi.entityService.findMany('api::procurement.procurement', {
      populate: '*',
    })
    const procurementPayments = await strapi.entityService.findMany('api::procurement-payment.procurement-payment', {
      populate: '*',
    })
    let {
      data,
      meta
    } = await super.find(ctx);
    data = data.map(item => {
      let relatedProcurements = procurements.filter(p => p.provider && p.provider.id == item.id)

      relatedProcurements = relatedProcurements.filter(p => p.state !== 'CANCELED')
      const relatedProcurementsPaid = relatedProcurements.filter(p => p.state === 'PAID')
      const relatedProcurementPayments = procurementPayments.filter(p => p.provider && p.provider.id == item.id)
      var relatedProcurementsTotal = 0; // Initialize the total
      let dal = 0;
      let hab = 0;
      const relatedProcurementsPaidProgress = relatedProcurements.filter(p => p.state === 'IN_PROGRESS')

      relatedProcurements.forEach(rp => {
        // Calculate the sum without tax for this relatedProcurement
        const sumWithHabWithoutTax = rp.weighings.reduce((accumulator, cv) => {
          // Calculate the cost of each item considering tax
          const itemCostWithTax = cv.unit_price * cv.net - (cv.unit_price * cv.net * (cv.tax / 100)) - cv.hab;
          return accumulator + itemCostWithTax;
        }, 0);

        rp.weighings.reduce((accumulator, cv) => {
          // Calculate the cost of each item considering tax
          dal += cv.dal;
        }, 0);
        rp.weighings.reduce((accumulator, cv) => {
          // Calculate the cost of each item considering tax
          hab += cv.hab;
        }, 0);
        relatedProcurementsTotal += sumWithHabWithoutTax; // Add to the total for this item
      });
      const avances = relatedProcurementPayments
        .filter(payment => payment.procurements.length === 0)
        .reduce((sum, payment) => sum + payment.value, 0);
      const paid = relatedProcurementPayments
        .filter(payment => payment.procurements.length != 0)
        .reduce((sum, payment) => sum + payment.value, 0);

      let relatedProcurementsPaidTotal = 0
      relatedProcurementsPaid.forEach(rp => {

        relatedProcurementsPaidTotal += rp.total_price_provider
      })

      let relatedProcurementsPaidTotalProgress = 0
      relatedProcurementsPaidProgress.forEach(rp => {

        relatedProcurementsPaidTotalProgress += rp.total_price_provider
      })
      let relatedProcurementsPaymentsTotal = relatedProcurementPayments.reduce((acc, cv) => acc + cv.total_price_provider, 0)

      

      return {
        ...item,
        attributes: {
          ...item.attributes,
          total: Number(paid.toFixed(3)) + Number(relatedProcurementsPaidTotalProgress.toFixed(3)),
          credit: Number(avances.toFixed(3)) + Number(paid.toFixed(3)),
          total_paid: Number(relatedProcurementsPaidTotal.toFixed(3)) + Number(relatedProcurementsPaidTotalProgress.toFixed(3)),
          total_paid_provider: Number(relatedProcurementsPaidTotalProgress.toFixed(3))

        }
      }
    })

    return {
      data,
      meta,
      ctx: ctx.query
    };
  },

  async findOne(ctx) {
    ctx.query = {
      ...ctx.query,
      populate: '*'
    }
    const response = await super.findOne(ctx);
    if (!response) {
      return response
    }
    const procurements = await strapi.entityService.findMany('api::procurement.procurement', {
      populate: '*',
    })
    const procurementPayments = await strapi.entityService.findMany('api::procurement-payment.procurement-payment', {
      populate: '*',
    })
    let relatedProcurements = procurements.filter(p => p.provider && p.provider.id == response.data.id)
    relatedProcurements = relatedProcurements.filter(p => p.state !== 'CANCELED')
    const relatedProcurementsPaid = relatedProcurements.filter(p => p.state === 'PAID')
    const relatedProcurementsPaidProgress = relatedProcurements.filter(p => p.state === 'IN_PROGRESS')

    const relatedProcurementPayments = procurementPayments.filter(p => p.provider && p.provider.id == response.data.id)
    let relatedProcurementsTotal = 0
    let dal = 0;
    relatedProcurements.forEach(rp => {

      const sumWithTax = rp.weighings.reduce((accumulator, cv) => {
        const itemCostWithTax = cv.unit_price * cv.net - (cv.unit_price * cv.net * (cv.tax / 100));
        return accumulator + itemCostWithTax;
      }, 0);


      const totalTax = rp.weighings.reduce((accumulator, cv) => accumulator + cv.hab, 0);
      rp.weighings.reduce((accumulator, cv) => {
        // Calculate the cost of each item considering tax
        dal += cv.dal;
      }, 0);
      relatedProcurementsTotal += sumWithTax - totalTax;
    });
    let relatedProcurementsPaidTotal = 0
    relatedProcurementsPaid.forEach(rp => {
      relatedProcurementsPaidTotal += rp.total_price_provider
    })


    let relatedProcurementsPaidTotalProgress = 0
    relatedProcurementsPaidProgress.forEach(rp => {
      relatedProcurementsPaidTotalProgress += rp.total_price_provider
    })
    let relatedProcurementsPaymentsTotal = relatedProcurementPayments.reduce((acc, cv) => acc + cv.value, 0)
    response.data.attributes.total = Number(relatedProcurementsPaidTotalProgress.toFixed(3));
    response.data.attributes.credit = Number(relatedProcurementsPaymentsTotal.toFixed(3));
    response.data.attributes.total_paid = Number(relatedProcurementsPaidTotal.toFixed(3));
    response.data.attributes.total_paid_provider = Number(relatedProcurementsPaidTotalProgress.toFixed(3));
    

//delete fixed number 
    return response;
  },
  async findBestProviders(ctx) {
    const procurements = await strapi.entityService.findMany('api::procurement.procurement', {
      populate: '*',

    })

    let providers = {}
    let providersList = []

    procurements.forEach(proc => {
      if (proc.provider && proc.provider.id && proc.provider.name) {
        if (!providers[`${proc.provider.id}-${proc.provider.name}`]) {
          providers[`${proc.provider.id}-${proc.provider.name}`] = 0
        }
        providers[`${proc.provider.id}-${proc.provider.name}`] += proc.weighings.reduce((acc, cv) => acc + cv.total_price, 0)
      }
    })
    Object.keys(providers).forEach(prov => {
      if (providers[prov]) {
        providersList.push({
          name: prov.split('-')[1],
          total: providers[prov]
        })
      }
    })

    return {
      providersList: providersList.sort((a, b) => b.total - a.total)
    }

  },
  async getAllProviderByWarehouse(ctx) {
    try {
      const warehouseId = ctx.query.warehousId;

      if (!warehouseId) {
        ctx.status = 400;
        ctx.body = {
          error: 'Invalid input 😌 , warehouseId is required.',
        };
        return;
      }

      const providerRecords = await strapi.entityService.findMany('api::provider.provider', {
        filters: {
          warehouse: warehouseId,
        },
        _limit: -1,
      });
      ctx.status = 200;
      ctx.body = {
        message: 'List Of Provider',
        data: providerRecords
      };
    } catch (error) {
      console.error('Error updating procurement:', error);
      ctx.status = 500;
      ctx.body = {
        error: 'Internal server error'
      };
    }
  }
,async getAllProviderByWarehouse(ctx) {
  try {
    const warehouseId = ctx.query.warehousId;

    if (!warehouseId) {
      ctx.status = 400;
      ctx.body = {
        error: 'Invalid input 😌 , warehouseId is required.',
      };
      return;
    }

    const providerRecords = await strapi.entityService.findMany('api::provider.provider', {
      filters: {
        warehouse: warehouseId,
      },
      _limit: -1,
      populate :'*'
    });
  
    ctx.status = 200;
    ctx.body = {
      message: 'List Of Provider',
      data: providerRecords
    };
  } catch (error) {
    console.error('Error updating procurement:', error);
    ctx.status = 500;
    ctx.body = {
      error: 'Internal server error'
    };
  }
}

}));
