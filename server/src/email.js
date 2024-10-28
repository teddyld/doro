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

export const mailTemplateForgotPassword = (buttonUrl, pageUrl) => {
  return `
  <!DOCTYPE html>
  <html>
    <body
      style="
        font-family: 'Verdana', serif;
        color: #000;
        margin: 0;
        box-sizing: border-box;
      "
    >
      <div
        style="
          width: 80%;
          height: 100%;
          background-color: #f8f8f8;
          margin: 20px auto;
          padding: 25px;
          display: flex;
          flex-direction: column;
          row-gap: 20px;
          justify-content: center;
          align-items: center;
        "
      >
        <h1
          style="
            color: #575757;
            font-size: 1.8em;
            font-weight: normal;
            text-align: center;
            margin: 10px 0 10px 0;
            padding-bottom: 10px;
            border-bottom: 1px #e3e3e3 solid;
          "
        >
          Password Reset
        </h1>
        <div
          style="
            background-color: white;
            padding: 35px 30px;
            border: 1px #e3e3e3 solid;
            font-size: 1em;
            max-width: 40em;
          "
        >
          <p>
            Someone just requested to change your Pomodoro account's credentials.
            If this was you, follow this link to reset them.
          </p>
          <a href="${buttonUrl}" target="_blank">
            <button
              style="
                background-color: #eb9bb8;
                border: 0;
                font-weight: bold;
                font-size: 1em;
                width: 100%;
                height: 3.5em;
                margin: 20px 0 20px 0;
                border-radius: 6px;
                color: #fff;
              "
            >
              Change my password
            </button>
          </a>
          <p>
            If you don't want to reset your credentials, just ignore this message,
            and nothing will be changed.
          </p>
          <a href="${pageUrl}" target="_blank" style="align-self: center">
          Pomodoro
          </a>
        </div>
      </div>
    </body>
  </html>`;
};
