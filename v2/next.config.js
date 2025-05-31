const nextConfig = {
    async redirects() {
      return [
        {
          source: '/',
          destination: '/page/1',
          permanent: true,
        },
      ];
    },
  };
  
  module.exports = nextConfig;