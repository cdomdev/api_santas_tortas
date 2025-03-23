import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

// Interfaces para tipar las funciones
interface LoadTemplateParams {
    templateName: string;
    variables: Record<string, string>;
}

interface MailOptions {
    to: string;
    subject: string;
    templateName: string;
    variables?: Record<string, string>;
}

// Cargar variables de entorno
const USER_MAIL = process.env.SMTP_USER as string;
const PASS_MAILS = process.env.SMTP_PASS as string;

if (!USER_MAIL || !PASS_MAILS) {
    throw new Error("Faltan las credenciales del correo en las variables de entorno.");
}

// Configuración del transporte de correos
export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: { user: USER_MAIL, pass: PASS_MAILS },
    secure: false,
    requireTLS: true,
});

// Función para cargar y reemplazar variables en plantillas HTML
const loadTemplate = ({ templateName, variables }: LoadTemplateParams): string => {
    const templatePath = path.join(process.cwd(), "src/emails/email-templates", `${templateName}.html`);

    if (!fs.existsSync(templatePath)) {
        throw new Error(`La plantilla ${templateName}.html no existe en la ruta especificada.`);
    }

    let template = fs.readFileSync(templatePath, "utf8");

    // Reemplaza las variables {{nombre}}, {{url}}, etc.
    Object.entries(variables).forEach(([key, value]) => {
        template = template.replace(new RegExp(`{{${key}}}`, "g"), value);
    });

    return template;
};

// Función para enviar correos

export const sendMail = async ({ to, subject, templateName, variables }: MailOptions) => {
    try {
      const htmlContent = loadTemplate({ templateName, variables });
  
      const mailOptions = {
        from: `"Santas Tortas" <${USER_MAIL}>`,
        to,
        subject,
        html: htmlContent,
        attachments: [
          {
            filename: "lg.png",
            path: path.join(process.cwd(), "src/emails/images/lg.png"),
            cid: "logo-st",
          },
          {
            filename: "em.png",
            path: path.join(process.cwd(), "src/emails/images/em.png"),
            cid: "email-icon",
          },
          {
            filename: "wapp.png",
            path: path.join(process.cwd(), "src/emails/images/wapp.png"),
            cid: "whatsapp-icon",
          },
        ],
      };
  
      await transporter.sendMail(mailOptions);
      console.log("✅ Correo enviado con éxito");
    } catch (error) {
      console.error("❌ Error al enviar correo:", error);
    }
  };
  