const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true, // 465 port ke liye true
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendOTPEmail = async (to, name, otp) => {
  try {
    const mailOptions = {
      from: `"Your App Name" <${process.env.SMTP_USER}>`,
      to,
      subject: "Your OTP Code",
      html: `<p>Hello ${name},</p><p>Your OTP is <b>${otp}</b></p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ OTP email sent to:", to);
  } catch (error) {
    console.log("❌ Email send error:", error);
    throw new Error("Failed to send email");
  }
};

module.exports = { sendOTPEmail };
