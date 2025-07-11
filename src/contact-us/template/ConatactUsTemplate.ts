export const ContactFormDetailsEmail = (data: {
  name: string
  email: string
  phone: string
  message: string
}) => `
<table width="600" cellpadding="0" cellspacing="0" border="0" style="padding: 20px 0; margin: 0 auto;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; font-family: Arial, sans-serif; color: #000000;">
        <!-- Header -->
        <tr style="background-color: #232323;">
          <td align="left" style="padding: 20px;">
            <img src="https://i.imgur.com/IeSz6wc.png" alt="monefi" width="100" style="display: block;">
          </td>
        </tr>
        
        <!-- Body -->
        <tr>
          <td style="padding: 20px; font-size: 16px; line-height: 1.5; color: #333333;">
            <h2 style="margin: 0 0 20px 0; color: #232323; font-size: 20px; font-weight: bold;">New Contact Form Submission</h2>
            
            <p style="margin: 0 0 20px 0;">
              You have received a new contact form submission from your website:
            </p>
            
            <!-- Contact Details -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8f9fa; border-radius: 8px; margin: 20px 0;">
              <tr>
                <td style="padding: 20px;">
                  
                  <!-- Name -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 15px;">
                    <tr>
                      <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef;">
                        <strong style="color: #232323; font-size: 14px;">Name:</strong><br>
                        <span style="color: #333333; font-size: 16px;">${data.name}</span>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Email -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 15px;">
                    <tr>
                      <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef;">
                        <strong style="color: #232323; font-size: 14px;">Email:</strong><br>
                        <a href="mailto:${data.email}" style="color: #2a7ae2; text-decoration: none; font-size: 16px;">${data.email}</a>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Phone -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 15px;">
                    <tr>
                      <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef;">
                        <strong style="color: #232323; font-size: 14px;">Phone:</strong><br>
                        <a href="tel:${data.phone}" style="color: #2a7ae2; text-decoration: none; font-size: 16px;">${data.phone}</a>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Message -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="padding: 8px 0;">
                        <strong style="color: #232323; font-size: 14px;">Message:</strong><br>
                        <div style="background-color: #ffffff; padding: 15px; border-radius: 4px; border: 1px solid #e9ecef; color: #333333; font-size: 16px; line-height: 1.5; margin-top: 8px; white-space: pre-wrap;">${data.message}</div>
                      </td>
                    </tr>
                  </table>
                  
                </td>
              </tr>
            </table>
            
            <p style="margin: 20px 0 15px 0; color: #333333;">
              Please respond to this inquiry promptly.
            </p>
            
            <p style="margin: 0; color: #666666; font-size: 14px;">
              This notification was automatically generated from your website contact form.
            </p>
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
`