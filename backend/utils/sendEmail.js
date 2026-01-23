import axios from "axios";

export const sendOtpEmail = async (email, otp) => {
  try {
    const BREVO_API_KEY = process.env.BREVO_API_KEY;

    if (!BREVO_API_KEY) {
      throw new Error("BREVO_API_KEY is missing in environment variables");
    }

    const fromEmail = process.env.EMAIL_FROM;

    if (!fromEmail) {
      throw new Error("EMAIL_FROM is missing in environment variables");
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Your OTP for Agroww Signup</h2>
        <p>Your OTP is:</p>
        <h1 style="letter-spacing: 4px; font-weight: bold;">${otp}</h1>
        <p>This OTP will expire in <b>5 minutes</b>.</p>
        <p style="color: gray; font-size: 12px;">
          If you didn’t request this, ignore this email.
        </p>
      </div>
    `;

    await axios.post(
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
        timeout: 20000,
      }
    );

    return true;
  } catch (err) {
    console.log("BREVO API EMAIL ERROR:", err.response?.data || err.message);
    throw err;
  }
};
