module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/cash-transaction/getall',
      handler: 'cash-transaction.getAll',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/cash-transaction/getamout',
      handler: 'cash-transaction.getValueTotalEspace',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/cash-transaction/getamountYestarday',
      handler: 'cash-transaction.getValueTotalEspace',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/cash-transaction/getTotalCaisseByDate',
      handler: 'cash-transaction.getTotalCaisseToday',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/cash-transaction/getTransacationListToday',
      handler: 'cash-transaction.getAllCashTransactionByWarehouseAndDate',
      config: {
        auth: false,
      },
    },
  ],
};

