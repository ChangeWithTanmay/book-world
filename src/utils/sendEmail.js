import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { TemplateEmail } from "./TemplateEmail.js";

dotenv.config();

// Setup Email Transporter (SMTP Configuration)

const transporter = nodemailer.createTransport({
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

const sendEmailWithOtp = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: email,
    subject: "Vectosmind your varification code",
    // text: `Your OTP is: ${otp}. It is valid for 5 minutes.`,
    html: TemplateEmail(otp),
  };

  try {
    await transporter.sendMail(mailOptions);

    console.log(`✅ ${email} is Address mail successfully sending.`);
    return 1;
  } catch (error) {
    console.log("❌ Error sending Error:", error);
    return -1;
  }
};

export { sendEmailWithOtp };
