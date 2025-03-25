export default {
  routes: [
    {
      method: "POST",
      path: "/auth/google",
      handler: "auth.googleAuth",
      config: {
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/auth/register",
      handler: "auth.registerCustom",
      config: {
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/auth/forgot-password",
      handler: "auth.forgot",
      config: {
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/auth/reset-password-custom",
      handler: "auth.reset",
      config: {
        auth: false,
      },
    },
  ],
};
