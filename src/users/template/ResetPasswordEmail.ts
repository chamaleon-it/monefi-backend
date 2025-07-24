export const ResetPasswordEmail = (link: string) => `
<table width="600" cellpadding="0" cellspacing="0" border="0" style="padding: 20px 0; margin: 0 auto;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff; font-family: Arial, sans-serif; color:#000000;">
        <!-- Header -->
        <tr style="background-color:#232323;">
          <td align="left" style="padding: 20px;">
            <img src="https://i.imgur.com/IeSz6wc.png" alt="monefi" width="100" style="display:block;">
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding: 20px; font-size: 16px; line-height: 1.5; color: #333333;">
            <p style="margin: 0 0 15px 0;">Dear Customer,</p>

            <p style="margin: 0 0 15px 0;">
              You have requested to reset your password. To set a new password, please click the button below. This link is valid for <strong>2 hours</strong>.
            </p>

            <!-- Button -->
            <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 25px 0;">
              <tr>
                <td align="center" bgcolor="#eb7099" style="border-radius: 5px;">
                  <a href=${link}
                     target="_blank" 
                     style="display:inline-block; padding: 12px 24px; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 5px;">
                    Reset Password
                  </a>
                </td>
              </tr>
            </table>

            <p style="margin: 0 0 15px 0;">
              If you did not request a password reset, you can safely ignore this email.
            </p>

            <p style="margin: 0 0 15px 0;">
              For help, reach out to us at 
              <a href="mailto:hello@monefi.co.uk" style="color:#2a7ae2; text-decoration: none;">hello@monefi.co.uk</a>.
            </p>

            <p style="margin: 0 0 15px 0;">Best regards,</p>
            <p style="margin: 0; color:black">Administration Team<br>Monefi</p>
          </td>
        </tr>

        <!-- Footer spacing -->
        <tr>
          <td style="padding: 20px;"></td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`;
