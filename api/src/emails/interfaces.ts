// Interfaces para tipar las funciones
export interface LoadTemplateParams {
  templateName: string;
  variables: Record<string, string>;
  isAdmin?: boolean;
}

export interface MailOptions {
  to: string;
  subject: string;
  templateName: string;
  variables?: Record<string, string>;
}
