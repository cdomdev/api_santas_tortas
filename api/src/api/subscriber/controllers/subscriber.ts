/**
 * subscriber controller
 */

import { factories } from '@strapi/strapi'
import { sendMail } from '../../../emails/transporter';

export default factories.createCoreController('api::subscriber.subscriber', ({strapi}) => ({
    async create(ctx) {
        const { email } = ctx.request.body;
        if(!email || !email.includes('@')) {
            return ctx.badRequest('Ingrese un correo electrónico válido');
        }
        // validate if the email already exists
        const existingSubscriber = await strapi.entityService.findMany("api::subscriber.subscriber", {
            filters: { email },
          });
        
        if (existingSubscriber.length > 0) {
            return ctx.badRequest('El correo electrónico ya está registrado')
        }

        // create the subscriber

        const subscriber = await strapi.entityService.create("api::subscriber.subscriber", {
            data: { email, active: true },
        });

        // send mail to the subscriber

        sendMail({
            to: email,
            subject: "Gracias por suscribirte!",
            templateName: "subscriber",
            variables: {},
          });

        return ctx.send({ok: "Gracias por subscribirte", subscriber});
    },

}));
