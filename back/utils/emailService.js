const nodemailer = require('nodemailer');

// Email configuration
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail', // You can change this to your email provider
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS  // Your email password or app password
    }
  });
};

// Welcome email template
const getWelcomeEmailTemplate = (userName) => {
  return {
    subject: 'Welcome to Hope for Children Organization!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1e88e5; margin-bottom: 10px;">Welcome to Hope for Children!</h1>
          <p style="color: #666; font-size: 16px;">Thank you for joining our mission to help children in need</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #333; margin-top: 0;">Hello ${userName}!</h2>
          <p style="color: #555; line-height: 1.6;">
            We're thrilled to have you as part of our community. Your registration helps us build a stronger network of supporters dedicated to improving the lives of children.
          </p>
        </div>
        
        <div style="margin-bottom: 30px;">
          <h3 style="color: #1e88e5;">What's Next?</h3>
          <ul style="color: #555; line-height: 1.8;">
            <li>Explore our latest projects and impact stories</li>
            <li>Stay updated with our newsletter</li>
            <li>Join our volunteer programs</li>
            <li>Make a donation to support our cause</li>
          </ul>
        </div>
        
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0; color: #1565c0; font-weight: bold;">
            💡 Did you know? Your support helps us provide education, healthcare, and shelter to over 1,000 children annually.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="http://localhost:5173" style="background: #1e88e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Visit Our Website
          </a>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 14px;">
          <p>Hope for Children Organization<br>
          Making a difference, one child at a time</p>
          <p>If you have any questions, feel free to contact us at info@hopeforchildren.org</p>
        </div>
      </div>
    `
  };
};

// Send welcome email
const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const transporter = createTransporter();
    const emailTemplate = getWelcomeEmailTemplate(userName);
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: emailTemplate.subject,
      html: emailTemplate.html
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendWelcomeEmail
};
