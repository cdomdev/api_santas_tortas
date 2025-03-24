/**
 * subscriber controller
 */

import { factories } from "@strapi/strapi";
import { sendMail } from "../../../emails/transporter";

export default factories.createCoreController(
  "api::subscriber.subscriber",
  ({ strapi }) => ({
    async create(ctx) {
      const { email } = ctx.request.body;
      if (!email || !email.includes("@")) {
        return ctx.badRequest("Ingrese un correo electrónico válido");
      }
      // validate if the email already exists
      const existingSubscriber = await strapi.entityService.findMany(
        "api::subscriber.subscriber",
        { filters: { email }, limit: 1 }
      );
  
      if (existingSubscriber.length > 0) {
        return ctx.badRequest("El correo electrónico ya está registrado");
      }
      try {
        // Crear el suscriptor
        const subscriber = await strapi.entityService.create(
          "api::subscriber.subscriber",
          {
            data: { email, active: true },
          }
        );

        // Enviar correo de confirmación
        sendMail({
          to: email,
          subject: "Gracias por suscribirte!",
          templateName: "subscriber",
          variables: {},
        });

        return ctx.send({ ok: "Gracias por suscribirte", subscriber });
      } catch (error) {
        if (error.message.includes("duplicate key")) {
          return ctx.badRequest("El correo electrónico ya está registrado");
        }
        strapi.log.error("Error al registrar suscriptor:", error);
        return ctx.internalServerError("Ocurrió un error inesperado");
      }
    },
  })
);
