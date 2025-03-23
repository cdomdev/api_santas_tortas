
import { sendMail } from "../../../emails/transporter";

const register = async (ctx: any) => {
  try {
    const { email, password, username } = ctx.request.body;

    if (!email || !password || !username) {
      return ctx.badRequest("Faltan datos obligatorios.");
    }

    const existingUser = await strapi.db.query("plugin::users-permissions.user").findOne({
      where: { email },
    });

    if (existingUser) {
      return ctx.conflict("El correo ya está registrado.");
    }

    const newUser = await strapi.entityService.create("plugin::users-permissions.user", {
      data: {
        email,
        username,
        password,
        confirmed: true,
        role: 1,
      },
    });

    await sendMail({
      to: email,
      subject: "Bienvenido a Santas Tortas 🎂",
      templateName: "welcome",
      variables: { nombre: username, url: "https://santas-tortas.vercol.app" },
    });

    return ctx.send({ message: "Usuario registrado con éxito", user: newUser });
  } catch (error) {
    console.error("❌ Error en el registro:", error);
    return ctx.internalServerError("Error al registrar usuario.");
  }
};

export default { register };
