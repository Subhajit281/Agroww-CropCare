import axios from "axios";

export const sendOtpEmail = (email, otp) => {
  const BREVO_API_KEY = process.env.BREVO_API_KEY;

  if (!BREVO_API_KEY) {
    console.error("BREVO_API_KEY is missing in environment variables");
    return;
  }

  const fromEmail = process.env.EMAIL_FROM;

  if (!fromEmail) {
    console.error("EMAIL_FROM is missing in environment variables");
    return;
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Your OTP for Agroww Signup</h2>
      <p>Your OTP is:</p>
      <h1 style="letter-spacing: 4px; font-weight: bold;">${otp}</h1>
      <p>This OTP will expire in <b>5 minutes</b>.</p>
      <p style="color: gray; font-size: 12px;">
        If you didn't request this, ignore this email.
      </p>
    </div>
  `;

  // Fire and forget - send email in background without blocking
  axios.post(
    "https://api.brevo.com/v3/smtp/email",
    {
      sender: {
        name: "Agroww",
        email: fromEmail.includes("<")
          ? fromEmail.match(/<(.*)>/)?.[1]
          : fromEmail,
      },
      to: [{ email }],
      subject: "Your OTP for Agroww Signup",
      htmlContent,
    },
    {
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
        accept: "application/json",
      },
      timeout: 10000, // Reduced from 20s to 10s
    }
  ).catch(err => {
    // Log errors but don't throw - email failure won't crash the app
    console.error("BREVO API EMAIL ERROR:", err.response?.data || err.message);
  });

  // Return immediately - don't wait for email to send
  return true;
};