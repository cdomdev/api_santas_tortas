import { factories } from "@strapi/strapi";
import mercadopagoService from "../services/order";

export default factories.createCoreController(
  "api::order.order",
  ({ strapi }) => ({
    async mercadopago(ctx) {
      try {
        const data = ctx.request.body;
        const {  products, envio, usuario } = data;

        if (!usuario || !products || !envio) {
          return ctx.badRequest("Faltan datos para procesar la compra");
        }

        const dataOrder = {
          usuario,
          products,
          envio,
        };


        const result = await mercadopagoService.createPreferenceMercadoPago(
          ctx,
          dataOrder,
          strapi
        );

        console.log("Se crea el pedido en Strapi ----> ", result);

        ctx.send(result);
      } catch (error) {
        console.error("❌ Error en mercadopago controller:", error);
        ctx.internalServerError(
          "Error interno al crear preferencia de Mercado Pago"
        );
      }
    },
  })
);
