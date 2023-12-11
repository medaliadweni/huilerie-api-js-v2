// ./src/api/[api-name]/content-types/[api-name]/lifecycles.js

const contentType = 'weighing'

module.exports = {
    beforeCreate(event) {
        const { data, where, select, populate } = event.params;

        // let's do a 20% discount everytime
        const { unit_price, gross, tare } = data
        event.params.data.total_price = Number((unit_price * (gross - tare)).toFixed(3));
        event.params.data.net = gross - tare;
    },
    async beforeUpdate(event) {
        const { data, where, select, populate } = event.params;
        const { unit_price, gross, tare } = data
        const item = await strapi.entityService.findOne(`api::${contentType}.${contentType}`, where.id, {populate: '*'});

        let truthyUnitPrice = (unit_price !== undefined) ? unit_price : item.unit_price
        let truthyGross = (gross !== undefined) ? gross : item.gross
        let truthyTare = (tare !== undefined) ? tare : item.tare

        event.params.data.total_price = Number((truthyUnitPrice *  (truthyGross - truthyTare)).toFixed(3));
        event.params.data.net = truthyGross - truthyTare;
    },

    afterCreate(event) {
        const { result, params } = event;
      //  strapi.$io.raw("weighing.create", {...result});
    },
    afterUpdate(event) {
        const { result, params } = event;
       // strapi.$io.raw("weighing.update", {...result});
    },
  };
  