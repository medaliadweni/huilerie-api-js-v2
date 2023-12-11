// ./src/api/[api-name]/content-types/[api-name]/lifecycles.js

const contentType = 'procurement'

module.exports = {
    async beforeCreate(event) {
        const { data, where, select, populate } = event.params;

        const { warehouse } = data
        const items = await strapi.entityService.findMany(`api::${contentType}.${contentType}`, {
            filters: { warehouse }
        });
        event.params.data.number = items.length + 1;
    },
    async beforeUpdate(event) {
        const { data, where, select, populate } = event.params;
        // const { unit_price, gross, tare } = data
        // const item = await strapi.entityService.findOne(`api::${contentType}.${contentType}`, where.id, {populate: '*'});
        
        // let truthyUnitPrice = unit_price || item.unit_price
        // let truthyGross = gross || item.gross
        // let truthyTare = tare || item.tare

        // event.params.data.total_price = Number((truthyUnitPrice *  (truthyGross - truthyTare)).toFixed(3));
        // event.params.data.net = truthyGross - truthyTare;
    },
    afterCreate(event) {
        const { result, params } = event;
     //   strapi.$io.raw("procurement.create", {...result});
    },
    afterUpdate(event) {
        const { result, params } = event;
       // strapi.$io.raw("procurement.update",  {...result});
    },
  };
  