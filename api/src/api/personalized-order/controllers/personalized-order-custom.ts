import { factories } from "@strapi/strapi";
import { sendMail } from "../../../emails/transporter";

export default factories.createCoreController(
  "api::personalized-order.personalized-order",
  ({ strapi }) => ({
    async create(ctx) {
      const { data } = ctx.request.body;
      const { datos } = data;

      if (!data) {
        return ctx.badRequest(
          "No hay datos para procesar un pedido personalizado"
        );
      }

      const {
        email,
        nombre: name,
        apellidos: surname,
        telefono: phone,
        direccion: address,
        message: detalles,
      } = data;
      const {
        tematica,
        relleno,
        sabor,
        porciones,
        fecha_estimada,
        mensaje: detail_user,
        image: idea_de_referencia,
      } = datos;
      // crar el peido personalizado

      try {
        const personalizedOrder = await strapi.entityService.create(
          "api::personalized-order.personalized-order",
          {
            data: {
              tematica,
              relleno,
              sabor,
              porciones,
              fecha_estimada,
              idea_de_referencia,
              detalles,
              email,
              name,
              surname,
              address,
              phone,
              detail_user,
            },
          }
        );

        if (!personalizedOrder) {
          // Enviar correo de confirmación al usuario
          console.log("No se pudo crear el pedido personalizado");
          return ctx.badRequest("No se pudo crear el pedido personalizado");
        } else {
          sendMail({
            isAdmin: false,
            to: email,
            subject: "Gracias por tu pedido personalizado!",
            templateName: "personalized-order",
            variables: {
              tematica,
              relleno,
              sabor,
              porciones,
              fecha_estimada,
              idea_de_referencia,
              detalles,
              email,
              name,
              surname,
              address,
              phone,
              detail_user,
            },
          });

          // Enviar correo de notificación al administrador

          sendMail({
            isAdmin: true,
            to: process.env.SMTP_USER as string,
            subject: "Nuevo pedido personalizado recibido",
            templateName: "personalized-order-admin",
            variables: {
              tematica,
              relleno,
              sabor,
              porciones,
              fecha_estimada,
              idea_de_referencia,
              detalles,
              email,
              name,
              surname,
              address,
              phone,
              detail_user,
            },
          });

          return ctx.send({
            message: "Pedido personalizado tomado con exito",
            status: 201,
            personalizedOrder,
          });
        }
      } catch (error) {
        strapi.log.error(
          "Error al crear un nuevo pedido personalizado:",
          error
        );
        return ctx.internalServerError("Ocurrió un error inesperado");
      }
    },
  })
);
