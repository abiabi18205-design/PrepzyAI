import nodemailer from "nodemailer";

export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "Please provide name, email, and message." });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn("Contact form submitted, but EMAIL_USER or EMAIL_PASS not configured in .env.");
      // We return success anyway in dev, or send real error. Let's return error.
      return res.status(500).json({ success: false, message: "Email service not configured. Please contact support directly." });
    }

    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"${name}" <${process.env.EMAIL_USER}>`, // Needs to be authenticated user to avoid spam filters, but we display name
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER, // Send to admin
      replyTo: email,
      subject: `[PrepzyAI Contact] ${subject || 'General Inquiry'} - from ${name}`,
      text: `You have received a new message from the PrepzyAI contact form.\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject || 'None'}\n\nMessage:\n${message}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending contact email:", error);
    res.status(500).json({ success: false, message: "Failed to send message. Please try again later." });
  }
};
