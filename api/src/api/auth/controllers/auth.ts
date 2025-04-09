import { sendMail } from "../../../emails/transporter";
import forgot from "../helpers/forgot";
import crypto from "crypto";

interface GoogleTokenInfo {
  audience?: string;
}

interface GoogleUserInfo {
  email?: string;
  name?: string;
  picture?: string;
}

export default () => ({
  // controlador para autenticar con Google
  async googleAuth(ctx) {
    try {
      const { token } = ctx.request.body;

      if (!token) {
        return ctx.badRequest("Token de Google requerido");
      }

      const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

      // 🔹 Verificar el token en Google
      const googleResponse = await fetch(
        `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`
      );

      if (!googleResponse.ok) {
        return ctx.badRequest("Error al validar el token con Google");
      }

      const googleData = (await googleResponse.json()) as GoogleTokenInfo;

      if (googleData?.audience !== CLIENT_ID) {
        return ctx.badRequest("Token de acceso no válido");
      }

      // 🔹 Obtener datos del usuario
      const userInfoResponse = await fetch(
        "https://www.googleapis.com/oauth2/v1/userinfo",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!userInfoResponse.ok) {
        return ctx.badRequest("Error al obtener datos del usuario");
      }

      const { email, name } = (await userInfoResponse.json()) as GoogleUserInfo;

      if (!email) {
        return ctx.badRequest("No se pudo obtener el email del usuario");
      }

      // 🔹 Buscar si el usuario ya existe en Strapi
      let users = await strapi.entityService.findMany(
        "plugin::users-permissions.user",
        {
          filters: { email },
        }
      );

      let user = users.length > 0 ? users[0] : null;

      if (!user) {
        // 🔹 Si no existe, crearlo
        user = await strapi.entityService.create(
          "plugin::users-permissions.user",
          {
            data: {
              email,
              username: name,
              confirmed: true,
              provider: "google",
              password: Math.random().toString(36).slice(-8),
            },
          }
        );

        // enviar el email de bienvenida

        sendMail({
          to: email,
          subject: "Bienvenido a Santas Tortas 🎂",
          templateName: "welcome",
          variables: {
            nombre: name,
            url: "https://santas-tortas.vercel.app",
          },
        });
      }

      // 🔹 Generar JWT de Strapi
      const jwt = await strapi.plugins["users-permissions"].services.jwt.issue({
        id: user.id,
      });

      return ctx.send({ user, jwt });
    } catch (error) {
      console.error("Error en la autenticación con Google:", error);
      return ctx.internalServerError("No se pudo autenticar con Google");
    }
  },

  // controlador para registrar un usuario personalizado, para agregar el envio de email
  async registerCustom(ctx: any) {
    try {
      const { email, password, username } = ctx.request.body;

      if (!email || !password || !username) {
        return ctx.badRequest("Faltan datos obligatorios.");
      }

      const existingUser = await strapi.db
        .query("plugin::users-permissions.user")
        .findOne({
          where: { email },
        });

      if (existingUser) {
        return ctx.conflict("El correo ya está registrado.");
      }

      const newUser = await strapi.entityService.create(
        "plugin::users-permissions.user",
        {
          data: {
            email,
            username,
            password,
            confirmed: true,
            role: 1,
            provider: "local",
          },
        }
      );

      await sendMail({
        to: email,
        subject: "Bienvenido a Santas Tortas 🎂",
        templateName: "welcome",
        variables: {
          nombre: username,
          url: "https://santas-tortas.vercol.app",
        },
      });

      return ctx.send({
        message: "Usuario registrado con éxito",
        user: newUser,
      });
    } catch (error) {
      console.error("❌ Error en el registro:", error);
      return ctx.internalServerError("Error al registrar usuario.");
    }
  },

  //  controlador para enviar el correo de recuperación
  async forgot(ctx: any) {
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

    //   contruir enlace de recuperación
    const DOMAIN = process.env.DOMAIN_CLIENT as string;

    const resetPasswordUrl = `${DOMAIN}/restablecer-contrasenia/recovery?code=${resetPasswordToken}`;

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

  // controlador para resetear la contraseña
  async reset(ctx: any) {
    // validar token
    await forgot.validateToken(ctx);

    //  validar contraseñas
    await forgot.validatePassword(ctx);

    //  actualizar contraseña
    const response = await forgot.updateUser(ctx);

    return ctx.send({
      response,
    });
  },
});
