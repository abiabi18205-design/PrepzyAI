import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text) => {
  try {
    // ✅ Create transporter inside function so env vars are loaded first
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    console.log('📧 Attempting to send email to:', to);
    console.log('📧 Using user:', process.env.EMAIL_USER);

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    });

    console.log("✅ Email sent:", info.response);
  } catch (error) {
    console.log("❌ Email failed:", error.message);
  }
};