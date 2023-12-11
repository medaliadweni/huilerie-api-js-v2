const eventLogger = require('../../../../logs.js');

module.exports = {


 async afterCreate(event) {
    const {
      result,
      params
    } = event;
    await eventLogger.logEvent('api::batch.batch', 'create', result);


  },
};
