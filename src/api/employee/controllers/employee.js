'use strict';

/**
 * employee controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::employee.employee', ({ strapi }) => ({
    async find(ctx) {
        // some logic here
        let { data, meta } = await super.find(ctx);
        // some more logic
        const employeePayments = await strapi.entityService.findMany('api::employee-payment.employee-payment', {
            populate: '*',
        })
        data = data.map(item => {
            const relatedEmployeePayments = employeePayments.filter(e => e.employee && e.employee.id == item.id)
            // let relatedProcurementsPaymentsTotal = relatedProcurementPayments.reduce((acc, cv) => acc + cv.value, 0)
            let relatedEmployeePaymentsTotal = relatedEmployeePayments.reduce((acc, cv) => acc + cv.payment, 0)
            return {
                ...item,
                attributes: {
                    ...item.attributes,
                    total_paid: relatedEmployeePaymentsTotal,
                }
            }
        })
        return { data, meta };
      }
}));
