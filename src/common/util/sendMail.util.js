import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER || "kunalbhanuse07@gmail.com",
    pass: process.env.SMTP_PASS || "sfwxcwdfikzbprra",
  },
});

async function sendMail(to, sub, msg) {
  try {
    if (!to || !sub || !msg) {
      throw new Error("Missing email fields");
    }

    const info = await transporter.sendMail({
      from: `"Todo App" <${process.env.SMTP_USER}>`,
      to,
      subject: sub,
      html: msg,
    });

    console.log("Mail sent:", info.messageId);

    return info;
  } catch (error) {
    console.error("Mail error:", error);
    throw error;
  }
}

export { sendMail };
