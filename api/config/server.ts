export default ({ env }) => ({
  host: env('HOST', 'PUBLIC_HOST'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
});
