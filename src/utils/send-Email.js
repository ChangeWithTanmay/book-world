import nodemailer from "nodemailer";

const otpStore = new Map();

const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

// Setup Email Transporter (SMTP Configuration).
const Transporter = nodemailer.createTransport({
  secure: true,
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: true,
    minVersion: "TLSv1.2",
  },
});

Transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready for messages");
    console.log(success);
  }
});

export { Transporter };
