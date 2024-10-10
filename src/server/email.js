import nodemailer from "nodemailer";
import "dotenv/config";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const mailTemplate = (buttonUrl) => {
  return `<!DOCTYPE html>
  <html>
  <body style="text-align: center; font-family: 'Verdana', serif; color: #000;">
    <div
      style="
        max-width: 400px;
        margin: 10px;
        background-color: #fafafa;
        padding: 25px;
        border-radius: 20px;
      "
    >
      <p>
        <b>Create a new password for your account</b>
      </p>
      <a href="${buttonUrl}" target="_blank">
        <button
          style="
            background-color: #c4b4d8;
            border: 0;
            width: 200px;
            height: 30px;
            border-radius: 6px;
            color: #fff;
          "
        >
          Set a new password
        </button>
      </a>
      <a href="${buttonUrl}" target="_blank">
          <p style="margin: 20px 0 0 0; text-align: left; font-size: 10px; text-decoration: none; overflow: hidden;">
            ${buttonUrl}
          </p>
      </a>
    </div>
  </body>
</html>`;
};
