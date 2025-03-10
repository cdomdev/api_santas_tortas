export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 10000),
  url: env('PUBLIC_URL', 'http://localhost:1337'),
  admin: {
    url: env('PUBLIC_URL', 'http://localhost:1337'),
    serveAdminPanel: true,
  },
  app: {
    keys: env.array('APP_KEYS'),
  },
});
