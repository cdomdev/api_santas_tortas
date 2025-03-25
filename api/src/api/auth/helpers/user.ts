export default {
  async findUser(field: string, value: string, ctx: any) {
    if (!field || !value) {
      ctx.badRequest(
        "El campo y el valor para la busqueda de un usuario son requeridos"
      );
    }

    const users = await strapi.entityService.findMany(
      "plugin::users-permissions.user",
      {
        // Campo dinámico
        filters: { [field]: value },
      }
    );

    return users.length > 0 ? users[0] : null;
  },
};
