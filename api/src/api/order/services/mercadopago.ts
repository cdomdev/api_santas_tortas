
import { MercadoPagoConfig, Preference } from "mercadopago";

const mercadopagoToken = process.env.ACCESSTOKEN_MERCADOPAGO;

// Configura las credenciales de Mercado Pago
export const client = new MercadoPagoConfig({
  accessToken: mercadopagoToken.trim(),
});

const HOST = process.env.DOMAIN_CLIENT;
const API_HOST = process.env.PUBLIC_HOST;

export default {
  async createPreference(productos, shipping_cost, orderId) {
    const items = productos.map((item) => ({
      title: item.title,
      quantity: item.quantity,
      unit_price: parseFloat(
        (item.price - (item.price * item.discount) / 100).toFixed(2)
      ),
    }));

    if (shipping_cost > 0) {
      items.push({
        title: "Costo de envío",
        quantity: 1,
        unit_price: shipping_cost,
      });
    }

    const body = {
      items,
      back_urls: {
        success: `${HOST}/payment-status-mercadopago/feedback-success`,
        failure: `${HOST}/payment-status-mercadopago/feedback-failure`,
        pending: `${HOST}/payment-status-mercadopago/feedback-pending`,
      },
      auto_return: "approved",
      notification_url: `${API_HOST}/api/webhooks-user`,
      external_reference: `${orderId}`,
    };

    const preference = new Preference(client);
    const result = await preference.create({
      body,
    });

    return result.init_point;
  },
};
