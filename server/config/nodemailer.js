import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 2525,             // ✅ Changed from 587 to 2525 to bypass Render port block
  secure: false,          // Use TLS, but not SSL
  auth: {
    user: process.env.SMTP_USER, // ✅ Use correct .env variable
    pass: process.env.SMTP_PASS, // ✅ Use correct .env variable
  },
});

// Optional: Debug SMTP connection
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP configuration error:', error);
  } else {
    console.log('✅ SMTP is ready to send emails');
  }
});

export default transporter;
