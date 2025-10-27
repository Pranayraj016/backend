const nodemailer = require("nodemailer");

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

const sendOTPEmail = async (email, name, otp) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Auth System" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "Email Verification - OTP Code",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
            .otp-box { background: white; border: 2px dashed #4CAF50; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px; }
            .otp { font-size: 32px; font-weight: bold; color: #4CAF50; letter-spacing: 5px; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #777; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Email Verification</h1>
            </div>
            <div class="content">
              <p>Hello <strong>${name}</strong>,</p>
              <p>Thank you for signing up! Please use the following OTP to verify your email address:</p>
              
              <div class="otp-box">
                <div class="otp">${otp}</div>
              </div>
              
              <p>This OTP will expire in <strong>${
                process.env.OTP_EXPIRY_MINUTES || 10
              } minutes</strong>.</p>
              <p>If you didn't request this verification, please ignore this email.</p>
              
              <div class="footer">
                <p>This is an automated email, please do not reply.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ OTP Email sent:", info.messageId);
    return true;
  } catch (err) {
    console.error("❌ Email sending failed:", err.message);
    throw new Error("Failed to send verification email");
  }
};

module.exports = {
  sendOTPEmail,
};
