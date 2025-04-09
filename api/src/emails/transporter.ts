import nodemailer from "nodemailer";
import { MailOptions} from './interfaces'
import path from "path";
import {loadTemplate} from './utils'
const USER_MAIL = process.env.SMTP_USER as string;
const PASS_MAILS = process.env.SMTP_PASS as string;


// Configuración del transporte de correos
export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: { user: USER_MAIL, pass: PASS_MAILS },
  secure: false,
  requireTLS: true,
});

const sharedAttachments = [
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
];
// Versión unificada de la función para enviar correos
export const sendMail = async ({
  to,
  subject,
  templateName,
  variables,
  isAdmin = false, 
}: MailOptions & { isAdmin?: boolean }) => {
  try {
    const htmlContent = loadTemplate({ templateName, variables, isAdmin });

    const mailOptions = {
      from: `"Santas Tortas" <${USER_MAIL}>`,
      to,
      subject,
      html: htmlContent,
      attachments: sharedAttachments,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Correo enviado ${isAdmin ? 'al administrador' : 'al usuario'} con éxito`);
  } catch (error) {
    console.error(`❌ Error al enviar correo ${isAdmin ? 'al administrador' : 'al usuario'}:`, error);
  }
};
