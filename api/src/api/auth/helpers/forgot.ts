import { sendMail } from "../../../emails/transporter";
import user from "./user";

export default {
  validateToken: async (ctx: any) => {
    const { code } = ctx.request.body;

    if (!code) throw new Error("El token es requerido");

    const dataUser = await user.findUser("resetPasswordToken", code, ctx);

    if (!dataUser) return ctx.badRequest("Token inválido o expirado");

    return dataUser;
  },

  validatePassword: async (ctx: any) => {
    const { password, passwordConfirmation } = ctx.request.body;

    if (!password || !passwordConfirmation)
      return ctx.badRequest("La contraseña es requerida");

    if (password !== passwordConfirmation)
      return ctx.badRequest("Las contraseñas no coinciden");

    return true;
  },

  updateUser: async (ctx: any) => {
    const { code, password } = ctx.request.body;

    if (!code || !password) {
      return ctx.badRequest("El token y la nueva contraseña son requeridos");
    }

    // Buscar el usuario por resetPasswordToken
    const dataUser = await user.findUser("resetPasswordToken", code, ctx);

    // Actualizar la contraseña en la base de datos
    const update = await strapi.plugins["users-permissions"].services.user.edit(
      dataUser.id,
      {
        password: password,
        resetPasswordToken: null,
      }
    );

    // Notificar al usuario por correo
    await sendMail({
      isAdmin: false,
      to: dataUser.email,
      subject: "Cambio de contraseña exitoso",
      templateName: "resetSuccess",
      variables: { nombre: dataUser.username },
    });

    return update;
  },
};
