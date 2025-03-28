export default () =>({
        async create(ctx){
            console.log('datos del cuerp de la solicitud --->', ctx.request.body)
            if(ctx.request.body){
                return ctx.send({
                    message: "Datos recibidos",
                    status: 200
                  });
            }
        }
    }
)