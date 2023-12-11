module.exports = {
    getAll: async (ctx) => {
      try {
        const cashTransactions = await strapi.query('api::cash-transaction.cash-transaction').find();
        ctx.send(cashTransactions);
      } catch (error) {
        ctx.send({ error: 'An error occurred while fetching data.' }, 500);
      }
    },
  };