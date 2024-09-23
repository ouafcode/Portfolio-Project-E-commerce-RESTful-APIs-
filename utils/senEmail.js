const nodemailer = require("nodemailer");

const sendMail = async (values) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true, // true for port 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: "E-Comm App <ouafaesaim@gmail.com>",
    to: values.email,
    subject: values.subject,
    text: values.message,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = sendMail;
