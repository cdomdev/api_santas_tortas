import crypto from "crypto";
import { sendMail } from "../../../emails/transporter";

module.exports = {
  async forgot(ctx) {
    const { email } = ctx.request.body;

    if (!email) {
      return ctx.badRequest("El correo electrónico es requerido");
    }

    // buscar usuario

    const user = await strapi
      .query("plugin::users-permissions.user")
      .findOne({ where: { email } });

    if (!user) {
      return ctx.badRequest("El correo electrónico no está registrado");
    }

    // generar token

    const resetPasswordToken = crypto.randomBytes(20).toString("hex");

    // actualizar usuario con el token

    await strapi.entityService.update(
      "plugin::users-permissions.user",
      user.id,
      {
        data: {
          resetPasswordToken: resetPasswordToken,
        },
      }
    );

    // let hostTest = "http://localhost:4321";
    //   contruir enlace de recuperación

    const resetPasswordUrl = `${process.env.DOMAIN_CLIENT}/restablecer-contrasenia/${resetPasswordToken}`;
    // const resetPasswordUrl = `${hostTest}/restablecer-contrasenia/${resetPasswordToken}`;

    // enviar correo electrónico

    await sendMail({
      to: email,
      subject: "Recuperación de contraseña",
      templateName: "forgot",
      variables: { nombre: user.username, url: resetPasswordUrl },
    });

    return ctx.send({
      message: "Correo electrónico de recuperacion enviado con éxito",
      username: user.username,
      email: user.email,
    });
  },
};
