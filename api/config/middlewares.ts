const { HOST_PRODUCTION } = process.env;
export default [
  "strapi::logger",
  "strapi::errors",
  {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "connect-src": ["'self'", "https:"],
          "img-src": [
            "'self'",
            "data:",
            "blob:",
            "dl.airline.com",
            "res.cloudinary.com",
          ],
          "media-src": [
            "'self'",
            "data:",
            "blob:",
            "dl.airline.com",
            "res.cloudinary.com",
          ],
          "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          "frame-src": ["'self'", "editor.unlayer.com"],
        },
      },
    },
  },
  {
    name: "strapi::cors",
    settings: {
      cors: {
        enabled: true,
        credentials: true, 
        origin: HOST_PRODUCTION ? [HOST_PRODUCTION] : "*",
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      },
    },
  },
  "strapi::poweredBy",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];
