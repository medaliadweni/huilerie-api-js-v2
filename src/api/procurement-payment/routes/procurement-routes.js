module.exports = {
    routes: [
      {
        method: 'PUT',
        path: '/proc-update/',
        handler: 'procurement-payment.updateProc',
        config: {
          auth: false,
        },
      },
      {
        method: 'GET',
        path: '/total-avance/',
        handler: 'procurement-payment.getAvanceValue',
        config: {
          auth: false,
        },
      },
    ],
  };
  
  