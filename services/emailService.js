const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

const sendOTPEmail = async (email, name, otp) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Auth System <onboarding@resend.dev>",
      to: email,
      subject: "Email Verification - OTP Code",
      html: `
        <p>Hello <strong>${name}</strong>,</p>
        <p>Your OTP is:</p>
        <h2>${otp}</h2>
        <p>This OTP expires in ${
          process.env.OTP_EXPIRY_MINUTES || 10
        } minutes.</p>
      `,
    });

    if (error) {
      console.log("❌ Email send error:", error);
      throw new Error("Failed to send email");
    }

    console.log("✅ OTP Email sent:", data.id);
    return true;
  } catch (err) {
    console.error("❌ Email sending failed:", err.message);
    throw new Error("Failed to send verification email");
  }
};

module.exports = { sendOTPEmail };
