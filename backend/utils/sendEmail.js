import nodemailer from "nodemailer";

export const sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Your OTP for Agroww Signup",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Your OTP for Agroww Signup</h2>
        <p>Your OTP is:</p>
        <h1 style="letter-spacing: 4px; font-weight: bold;">${otp}</h1>
        <p>This OTP will expire in <b>5 minutes</b>.</p>
        <p style="color: gray; font-size: 12px;">
          If you didn’t request this, ignore this email.
        </p>
      </div>
    `,
  });
};
