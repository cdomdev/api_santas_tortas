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
    ],
  };
  