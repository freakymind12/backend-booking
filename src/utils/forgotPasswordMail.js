const forgotPasswordMail = (link) => {
  return `<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reset Your Password</title>
    <style>
      body {
        font-family: 'Arial', sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background: #ffffff;
        padding: 20px 30px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      .button {
        display: inline-block;
        padding: 12px 24px;
        margin-top: 20px;
        background-color: #1890ff;
        color: white;
        text-decoration: none;
        border-radius: 5px;
      }
      .footer {
        font-size: 12px;
        color: #999999;
        text-align: center;
        margin-top: 30px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Reset Your Password</h2>
      <p>
        We received a request to reset your password. This link will expire in 30 minutes. Click the button below to set a new password.
      </p>
      <a href="${link}" class="button">Reset Password</a>
      <p>If you did not request a password reset, you can ignore this email.</p>
      <div class=footer>
      <p>HRS Booking Room Management Apps</p>
      </div>
    </div>
  </body>
</html>
`
}

module.exports = forgotPasswordMail