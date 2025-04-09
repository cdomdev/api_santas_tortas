import fs from "fs";
import path from "path";
import { LoadTemplateParams } from "./interfaces";

export const loadTemplate = ({
  templateName,
  variables,
  isAdmin,
}: LoadTemplateParams): string => {
  const basePath = isAdmin
    ? "src/emails/email-templates/admin"
    : "src/emails/email-templates";

  const templatePath = path.join(
    process.cwd(),
    basePath,
    `${templateName}.html`
  );

  if (!fs.existsSync(templatePath)) {
    throw new Error(
      `La plantilla ${templateName}.html no existe en la ruta especificada (${templatePath}).`
    );
  }

  let template = fs.readFileSync(templatePath, "utf8");

  // Reemplaza las variables {{nombre}}, {{url}}, etc.
  Object.entries(variables).forEach(([key, value]) => {
    const safeValue =  value == null || value === ""  ?  "No hay información" : String(value);
    template = template.replace(new RegExp(`{{${key}}}`, "g"), safeValue);
  });

  return template;
};

