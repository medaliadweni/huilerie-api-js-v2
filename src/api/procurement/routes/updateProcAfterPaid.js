module.exports = {
    routes: [
      {
        method: 'PUT',
        path: '/procurmenet/update-after-paid',
        handler: 'procurement.deletePayedProc',
        config: {
          auth: false,
        },
      },
    ],
  };
  
  