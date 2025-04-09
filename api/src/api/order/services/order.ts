import { Console } from "console";
import mercadopagoService from "./mercadopago";

export default {
  createPreferenceMercadoPago: async (ctx: any, data: any, strapi) => {
    const { usuario, products, envio } = data;

    const user = await strapi.db
      .query("plugin::users-permissions.user")
      .findOne({
        where: { email: usuario.email },
      });

    if (!user) {  
      return ctx.badRequest("HUbo un error para proceder con tu pedido, !Usuario no encontrado!");
    }

    const total_productos = products.reduce((acc, item) => {
      const price = item.price || 0;
      const discount = item.discount || 0;
      const finalPrice = price - (price * discount) / 100;
      return acc + finalPrice * item.quantity;
    }, 0);

    const total_payment = total_productos + envio;


    // Crear el pedido en Strapi
    const newOrder = await strapi.entityService.create("api::order.order", {
      data: {
        total_payment,
        shipping_cost: envio,
        status_order: "pendiente",
        reference_payments: "",
        users_permissions_user: user.id,
        products: products.map((p) => p.id),
      },
    });

    return newOrder
    // // Crear la preferencia en Mercado Pago
    // const preference = await mercadopagoService.createPreference(
    //   products,
    //   shipping_cost,
    //   newOrder.id
    // );

    // return {
    //   init_point: preference,
    //   order_id: newOrder.id,
    // };
  },
};
