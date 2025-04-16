const otpStore = new Map();

// SEND OTP THROW MOBILE NUMBER
const sendOtp = (mobile) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000;
  otpStore.set(mobile, { otp, expiresAt });
  console.log(`OTP for ${otp}`);
  return otp;
};

// VARIFY OTP, THROW MOBILE NUMBER AND OTP
const varifyOtp = (mobile, otp) => {
  const storeOtp = otpStore.get(mobile);
  console.log(`otp is ${storeOtp}`);

  if (storeOtp === otp) {
    otpStore.delete(mobile);
    return true;
  }
  return false;
};

export { sendOtp, varifyOtp };
