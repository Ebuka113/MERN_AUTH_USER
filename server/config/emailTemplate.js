
export const EMAIL_VERIFY_TEMPLATE =  `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f5f7fa;">
    <table width="100%" cellpadding="0" cellspacing="0" style="font-family: 'Segoe UI', sans-serif;">
      <tr>
        <td align="center" style="padding: 40px 20px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.08); padding: 40px;">
            <tr>
              <td style="text-align: center;">
                <h2 style="color: #333333; margin-bottom: 10px;">Verify Your Email</h2>
                <p style="color: #666666; font-size: 16px; line-height: 1.5;">
                  Hello <strong>{{email}}</strong>,<br />
                  Use the code below to verify your account:
                </p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 30px 0;">
                <div style="
                  display: inline-block;
                  background-color: #f0f4ff;
                  padding: 12px 20px;
                  border-radius: 8px;
                  letter-spacing: 18px;
                  font-size: 28px;
                  font-weight: bold;
                  color: #4A90E2;
                  font-family: 'Courier New', monospace;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                ">
                  {{otp}}
                </div>
              </td>
            </tr>
            <tr>
              <td style="text-align: center;">
                <p style="color: #999999; font-size: 14px;">
                  This code will expire in 10 minutes. If you did not request this, please ignore this email.
                </p>
              </td>
            </tr>
            <tr>
              <td style="text-align: center; padding-top: 30px;">
                <p style="color: #cccccc; font-size: 12px;">
                  &copy; ${new Date().getFullYear()} Your Company. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;


export const PASSWORD_RESET_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password Reset</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f5f7fa;">
    <table width="100%" cellpadding="0" cellspacing="0" style="font-family: 'Segoe UI', sans-serif;">
      <tr>
        <td align="center" style="padding: 40px 20px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.08); padding: 40px;">
            <tr>
              <td style="text-align: center;">
                <h2 style="color: #333333; margin-bottom: 10px;">Reset Your Password</h2>
                <p style="color: #666666; font-size: 16px; line-height: 1.5;">
                  Hi <strong>{{email}}</strong>,<br />
                  We received a request to reset your password. Use the code below to continue:
                </p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 30px 0;">
                <div style="
                  display: inline-block;
                  background-color: #fff3f0;
                  padding: 12px 20px;
                  border-radius: 8px;
                  letter-spacing: 18px;
                  font-size: 28px;
                  font-weight: bold;
                  color: #FF6F61;
                  font-family: 'Courier New', monospace;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                ">
                  {{otp}}
                </div>
              </td>
            </tr>
            <tr>
              <td style="text-align: center;">
                <p style="color: #999999; font-size: 14px;">
                  This code will expire in 10 minutes. If you didn't request this, you can safely ignore this email.
                </p>
              </td>
            </tr>
            <tr>
              <td style="text-align: center; padding-top: 30px;">
                <p style="color: #cccccc; font-size: 12px;">
                  &copy; ${new Date().getFullYear()} Your Company. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

