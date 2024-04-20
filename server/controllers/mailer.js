import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import ENV from "../config.js";

// SMTP configuration
const nodeConfig = {
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: ENV.EMAIL,
    pass: ENV.PASSWORD,
  },
};

const transporter = nodemailer.createTransport(nodeConfig);

const MailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Mailgen",
    link: "https://mailgen.js/",
  },
});

export const registerMail = async (req, res) => {
  try {
    const { username, userEmail, text, subject } = req.body;

    // Generate email content
    const email = {
      body: {
        name: username,
        intro:
          text ||
          "Welcome to Daily Tuition! We're very excited to have you on board.",
        outro:
          "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
    };
    const emailBody = MailGenerator.generate(email);

    // Email message configuration
    const message = {
      from: ENV.EMAIL,
      to: userEmail,
      subject: subject || "Signup Successful",
      html: emailBody,
    };

    // Send mail
    await transporter.sendMail(message);

    // Send success response
    return res
      .status(200)
      .send({ msg: "You should receive an email from us." });
  } catch (error) {
    // Log the error for debugging
    console.error("Error occurred during email sending:", error);
    // Send error response
    return res.status(500).send({ error: "Internal server error" });
  }
};
