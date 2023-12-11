'use strict';

/**
 * batch controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::batch.batch', ({ strapi }) => ({
    async find(ctx) {
        // some logic here
        let { data, meta } = await super.find(ctx);
        let populatedBatches = await strapi.entityService.findMany('api::batch.batch', {
            populate: '*',
        })
        // some more logic
        let newPopulatedBatches = populatedBatches.map(b => {
            return {
                ...b,
                total_weight: b.weighings.reduce((acc, cv) => acc + (cv.gross - cv.tare) , 0)
            }
        })
        data = data.map(item => ({...item, attributes: { ...item.attributes, total_weight: newPopulatedBatches.find(pb => pb.id == item.id) && newPopulatedBatches.find(pb => pb.id == item.id).total_weight }}))
        return { data, meta };
      } ,
      async getAllBatch(ctx) {
        try {
      
          const filters = {};
      
          if (ctx.query.warehouseId) { // Corrected typo
            filters.warehouse = ctx.query.warehouseId; // Corrected typo
          }
      
          const allBatches = await strapi.entityService.findMany('api::batch.batch', {
            populate: '*',

            _limit: -1,
            filters: filters
          });
      
          ctx.send({
            data: allBatches.map(batch => ({
              id: batch.id,
              attributes: {
                date: batch.date, // Corrected the property name
                description: batch.description,
                total_weight: batch.total_weight,
                total_cost: batch.total_cost,
                olive_extraction: batch.olive_extraction,
                createdAt: batch.createdAt,
                updatedAt: batch.updatedAt,
              }
            })),
          });
        } catch (error) {
          console.error('An error occurred while fetching data:', error);
          ctx.send({
            error: 'An error occurred while fetching data. Dali'
          }, 500);
        }
      }
      ,
      async  updateBatch(ctx) {
        const reqData = ctx.request.body.data;
        try {
          const objproc = {
            id: reqData.id
          };
      
          const batch = await strapi.entityService.findMany('api::batch.batch', {
            populate: '*', 
            filters: objproc
          }, );
    
          if (!batch) {
            throw new Error('Batch record not found');
          }
      
          // Calculate total price, total net weight, and other values
          const result = procurement[0].weighings.reduce((totalSum, weighing) => {
            const { net, unit_price, dal, hab, tax } = weighing;
            const sum = (net * unit_price) + dal - hab;
            return totalSum + sum;
          }, 0);
      
       
          // Update the procurement record with calculated values
          const updatedProcurement = await strapi.entityService.update('api::batch.batch', batch[0].id, {
            data: {
              total_net_weight: netWeight,
              // Add any other fields you need to update here
            },
          });
            ctx.status = 200;
          ctx.body = { message: 'Procurement updated successfully', data: updatedProcurement };
        } catch (error) {
          console.error('Error updating procurement:', error);
          ctx.status = 500;
          ctx.body = { error: 'Internal server error' };
        }
      }
      
    
}));
