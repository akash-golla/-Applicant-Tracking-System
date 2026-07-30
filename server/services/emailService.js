import nodemailer from 'nodemailer';

const createTransporter = () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  return nodemailer.createTransport({
    jsonTransport: true,
  });
};

export const sendEmailNotification = async ({ to, subject, text }) => {
  const transporter = createTransporter();
  const mailOptions = {
    from: process.env.SMTP_FROM || 'no-reply@ai-hr.local',
    to,
    subject,
    text,
  };

  return transporter.sendMail(mailOptions);
};
