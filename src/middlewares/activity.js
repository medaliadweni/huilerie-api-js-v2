module.exports = (config, { strapi })=> {
    return (context, next) => {
        console.log({ context });
        next()
    };
  };