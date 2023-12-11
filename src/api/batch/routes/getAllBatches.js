module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/batches-all/getall',
        handler: 'batch.getAllBatch',
        config: {
          auth: false,
        },
      },
    ],
  };
  
  