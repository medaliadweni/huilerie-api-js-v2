module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/provider/find-best-provider',
      handler: 'provider.findBestProviders',
      config: {
        auth: false,
      },
      
    },
    {
      method: 'GET',
      path: '/provider/all_providers',
      handler: 'provider.getAllProviderByWarehouse',
      config: {
        auth: false,
      },
    },
  ],
};

