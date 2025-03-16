interface GoogleTokenInfo {
    audience?: string;
  }
  
  interface GoogleUserInfo {
    email?: string;
    name?: string;
    picture?: string;
  }
  
  export default {
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
  
        const { email, name, picture } = (await userInfoResponse.json()) as GoogleUserInfo;
  
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
  
          // 🔹 Asociar la imagen de perfil si existe
          if (picture) {
            await strapi.plugins["upload"].services.upload.downloadFile(picture, {
              ref: "plugin::users-permissions.user",
              refId: user.id,
              field: "image",
            });
          }
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
  };
  