import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "gracie.larson84@ethereal.email",
    pass: "KqhQZm2dmC13WawYdd",
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
