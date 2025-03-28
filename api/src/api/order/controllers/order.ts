/**
 * order controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::order.order",
  ({ strapi }) => ({
    async crear(ctx) {
      const data = ctx.request.body;
      console.log("Datos de compra que llegan desde el clinte", data);
    },
  })
);
