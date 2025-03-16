
export default ({ env }) => ({
  upload: {
    config: {
      provider: "cloudinary",
      providerOptions: {
        cloud_name: env("CLOUDINARY_NAME"),
        api_key: env("CLOUDINARY_KEY"),
        api_secret: env("CLOUDINARY_SECRET"),
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },

  email: {
    config: {
      provider: "nodemailer",
      providerOptions: {
        host: env("SMTP_HOST", 'smtp.example.com'),
        port: env("SMTP_PORT", 1025),
        auth: {
          user: env("SMTP_USER", ""),
          pass: env("SMTP_PASS", ""),
        },
        ignoreTLS: true,
      },
      settings: {
        defaultFrom: env("EMAIL_FROM", "no-reply@tu-dominio.com"),
        defaultReplyTo: env("EMAIL_REPLY_TO", "no-reply@tu-dominio.com"),
      },
    },
  },
});
