/**
 * personalized-order router custom
 */

export default {
  routes: [
    {
      method: "POST",
      path: "/personalized-orders-custom",
      handler: "personalized-order-custom.create",
      config: {
        auth: false,
      },
    },
  ],
};
