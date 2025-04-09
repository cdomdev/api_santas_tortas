export default {
    routes: [
      {
        method: "POST",
        path: "/payment/create-order-mercadopago",
        handler: "order.mercadopago",
        config: {
          auth: false,
        },
      },
      
    ],
  };
  


