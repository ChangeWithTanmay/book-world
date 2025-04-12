import nodemailer from "nodemailer";


// make a Map()
const otpStore = new Map();

// Function to generate OTP
const generateOtp = Math.floor(100000 + Math.random()*900000);

// Setup Email Transporter (SMTP Configuration)

const transporter = nodemailer.createTransport({
    secure: true,
    host: "smtp.google.com", 
    port: 465,
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD
    }
});


const sendOTP =  async(email) =>{
    // OTP Valid Time
    const expiresAt = Date.now()+5*60*1000;
    const otp = generateOtp();

    otpStore.set(email, {otp, expiresAt})

    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: email,
        subject: "Vectosmind your varification code",
        text: `Your OTP is: ${otp}. It is valid for 5 minutes.`
    };

    try {
        await transporter.sendMail(mailOptions);

        console.log(`${email} is Address mail successfully sending.`);
    } catch (error) {
        console.log('Error sending Error', error);
    }
};