export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 10000),
  url: env('PUBLIC_URL', 'https://apisantastortas-production.up.railway.app'),
  admin: {
    url: env('PUBLIC_URL', 'https://apisantastortas-production.up.railway.app'),
    serveAdminPanel: true,
  },
  app: {
    keys: env.array('APP_KEYS'),
  },
});
