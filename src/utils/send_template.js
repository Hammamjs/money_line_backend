export const HTMLTemplate = (username, resetCode) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Money Line - Reset Code</title>
<style>
    body {
        margin: 0;
        padding: 0;
        background: #f4f7fb;
        font-family: Arial, Helvetica, sans-serif;
    }

    .container {
        max-width: 600px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }

    .header {
        background: linear-gradient(135deg, #0f9d58, #00c853);
        color: white;
        text-align: center;
        padding: 35px;
    }

    .header h1 {
        margin: 0;
        font-size: 32px;
        letter-spacing: 1px;
    }

    .content {
        padding: 40px;
        color: #333;
    }

    .content h2 {
        margin-top: 0;
        color: #222;
    }

    .code-box {
        background: #f2f8f4;
        border: 2px dashed #00c853;
        border-radius: 12px;
        padding: 20px;
        text-align: center;
        margin: 30px 0;
    }

    .code {
        font-size: 34px;
        font-weight: bold;
        letter-spacing: 8px;
        color: #00a651;
    }

    .footer {
        background: #f8f8f8;
        text-align: center;
        padding: 20px;
        color: #777;
        font-size: 14px;
    }

    @media(max-width:600px){
        .content{
            padding:25px;
        }

        .header h1{
            font-size:28px;
        }

        .code{
            font-size:28px;
            letter-spacing:5px;
        }
    }
</style>
</head>
<body>

<div class="container">

    <div class="header">
        <h1>💰 Money Line</h1>
        <p>Secure Financial Services</p>
    </div>

    <div class="content">

        <h2>Hello, ${username}</h2>

        <p>
            We received a request to reset your account verification.
            Use the code below to continue.
        </p>

        <div class="code-box">
            <div class="code">${resetCode}</div>
        </div>

        <p>
            This reset code will expire shortly for your security.
            If you didn't request this code, you can safely ignore this email.
        </p>

        <p>
            Thank you,<br>
            <strong>Money Line Team</strong>
        </p>

    </div>

    <div class="footer">
        © 2026 Money Line. All Rights Reserved.
    </div>

</div>

</body>
</html>`;
};
