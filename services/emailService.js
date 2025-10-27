const SibApiV3Sdk = require("@sendinblue/client");

const brevo = new SibApiV3Sdk.TransactionalEmailsApi();
brevo.setApiKey(
  SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

const sendOTPEmail = async (to, name, otp) => {
  try {
    await brevo.sendTransacEmail({
      sender: { email: "yourgmail@gmail.com", name: "Your App" },
      to: [{ email: to }],
      subject: "Your OTP Code",
      htmlContent: `
        <p>Hello ${name},</p>
        <p>Your OTP is <b>${otp}</b></p>
      `,
    });

    console.log("✅ Email sent to:", to);
  } catch (err) {
    console.log("❌ Email send failed:", err);
    throw new Error("Failed to send email");
  }
};

module.exports = { sendOTPEmail };
