module.exports = {
    routes: [
      {
        method: "POST",
        path: "/auth/forgot-password",
        handler: "forgot-custom.forgot",
        config: {
          auth: false,
        },
      },
    ],
  };
  